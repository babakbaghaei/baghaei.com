import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../notifications/telegram.service';
import { SecurityService } from '../security/security.service';

describe('ContactService', () => {
  let service: ContactService;
  let prismaService: PrismaService;
  let securityService: SecurityService;

  const mockPrismaService = {
    contactMessage: {
      create: jest.fn(),
    },
  };

  const mockTelegramService = {
    sendMessage: jest.fn(),
  };

  const mockSecurityService = {
    sanitizeInput: jest.fn((input) => input), // Default passthrough behavior
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TelegramService, useValue: mockTelegramService },
        { provide: SecurityService, useValue: mockSecurityService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    prismaService = module.get<PrismaService>(PrismaService);
    securityService = module.get<SecurityService>(SecurityService);
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

    const result = await service.create(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(securityService.sanitizeInput).toHaveBeenCalledWith(dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaService.contactMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: sanitizedDto.name,
      }),
    });
    expect(result).toEqual({ success: true, messageId: 1 });
  });
});
