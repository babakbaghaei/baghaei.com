import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('ContactService', () => {
  let service: ContactService;

  const mockPrismaService = {
    contactMessage: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockNotificationsQueue = {
    add: jest.fn(),
  };

  const mockSecurityService = {
    sanitizeInput: jest.fn((input) => input),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: getQueueToken('notifications'),
          useValue: mockNotificationsQueue,
        },
        { provide: SecurityService, useValue: mockSecurityService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sanitize input and save contact message', async () => {
    const dto = {
      name: 'John <script>alert(1)</script>',
      phone: '1234567890',
      message: 'Hello',
    };

    const sanitizedDto = {
      name: 'John &lt;script&gt;alert(1)&lt;/script&gt;',
      phone: '1234567890',
      message: 'Hello',
    };

    mockSecurityService.sanitizeInput.mockReturnValue(sanitizedDto);
    mockPrismaService.contactMessage.create.mockResolvedValue({
      id: 1,
      ...sanitizedDto,
    });
    mockNotificationsQueue.add.mockResolvedValue({ id: 'job-id' });

    const result = await service.create(dto as any);

    expect(result.id).toBe(1);
  });

  it('should drop spam silently when the honeypot field is filled', async () => {
    jest.clearAllMocks();
    const dto = {
      name: 'Bot',
      phone: '1234567890',
      message: 'spam',
      company: 'definitely-a-bot', // honeypot
    };

    const result = await service.create(dto as any);

    // Returns a success-shaped response but never persists or queues anything.
    expect(result.id).toBe(0);
    expect(mockPrismaService.contactMessage.create).not.toHaveBeenCalled();
    expect(mockNotificationsQueue.add).not.toHaveBeenCalled();
  });

  it('should strip the honeypot field before persisting a real message', async () => {
    jest.clearAllMocks();
    mockSecurityService.sanitizeInput.mockImplementation((input) => input);
    mockPrismaService.contactMessage.create.mockResolvedValue({ id: 5 });
    mockNotificationsQueue.add.mockResolvedValue({ id: 'job' });

    await service.create({
      name: 'Real',
      phone: '1234567890',
      message: 'hi',
      company: '', // empty honeypot = real user
    } as any);

    const sanitizeArg = mockSecurityService.sanitizeInput.mock.calls[0][0];
    expect(sanitizeArg).not.toHaveProperty('company');
  });

  it('should mark a message read', async () => {
    jest.clearAllMocks();
    mockPrismaService.contactMessage.findUnique.mockResolvedValue({
      id: 7,
      isRead: false,
    });
    mockPrismaService.contactMessage.update.mockResolvedValue({
      id: 7,
      isRead: true,
    });

    const result = await service.setRead(7, true);

    expect(mockPrismaService.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { isRead: true },
    });
    expect(result.isRead).toBe(true);
  });

  it('should return the unread count', async () => {
    jest.clearAllMocks();
    mockPrismaService.contactMessage.count.mockResolvedValue(3);

    const result = await service.countUnread();

    expect(result).toEqual({ count: 3 });
    expect(mockPrismaService.contactMessage.count).toHaveBeenCalledWith({
      where: { isRead: false },
    });
  });
});
