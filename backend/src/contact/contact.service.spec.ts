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
});
