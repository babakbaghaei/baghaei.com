import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { CareersService } from './careers.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';

describe('CareersService', () => {
  let service: CareersService;
  const prisma = { jobApplication: { create: jest.fn() } };
  const security = { sanitizeInput: jest.fn((x) => x) };
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
    expect(security.sanitizeInput).toHaveBeenCalled();
    expect(prisma.jobApplication.create).toHaveBeenCalled();
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
  });
});
