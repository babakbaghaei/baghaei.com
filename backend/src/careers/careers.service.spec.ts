import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { CareersService } from './careers.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';

describe('CareersService', () => {
  let service: CareersService;
  const prisma = { jobApplication: { create: jest.fn() } };
  const security = {
    sanitizeInput: jest.fn((x) => ({ ...x, _sanitized: true })),
  };
  const queue = { add: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CareersService,
        { provide: PrismaService, useValue: prisma },
        { provide: SecurityService, useValue: security },
        { provide: getQueueToken('notifications'), useValue: queue },
      ],
    }).compile();
    service = moduleRef.get(CareersService);
  });

  it('sanitizes, persists, and queues a notification', async () => {
    prisma.jobApplication.create.mockResolvedValue({
      id: 1,
      name: 'Ali',
      position: 'Frontend',
    });
    const dto = { position: 'Frontend', name: 'Ali', email: 'a@b.com' } as any;
    const result = await service.create(dto);

    // sanitizeInput must receive the payload WITHOUT the honeypot field
    expect(security.sanitizeInput).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'Frontend',
        name: 'Ali',
        email: 'a@b.com',
      }),
    );
    expect(security.sanitizeInput).not.toHaveBeenCalledWith(
      expect.objectContaining({ company: expect.anything() }),
    );

    // The sanitized output (not the raw DTO) must be what reaches prisma.create
    const sanitizedData = security.sanitizeInput.mock.results[0].value;
    expect(prisma.jobApplication.create).toHaveBeenCalledWith({
      data: sanitizedData,
    });

    expect(queue.add).toHaveBeenCalledWith(
      'job-application',
      expect.any(Object),
      expect.any(Object),
    );
    expect(result).toEqual({ id: 1, name: 'Ali', position: 'Frontend' });
  });

  it('drops honeypot submissions without persisting', async () => {
    const dto = {
      position: 'X',
      name: 'Bot',
      email: 'b@b.com',
      company: 'spam',
    } as any;
    await service.create(dto);
    expect(prisma.jobApplication.create).not.toHaveBeenCalled();
    expect(security.sanitizeInput).not.toHaveBeenCalled();
  });
});
