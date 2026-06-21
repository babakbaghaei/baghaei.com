import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockPrismaService = {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockSecurityService = {
    sanitizeInput: jest.fn((val) => val),
  };

  const mockCacheManager = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns [] for an empty search query without hitting the DB', async () => {
    mockPrismaService.project.findMany.mockClear();
    const result = await service.search('   ');
    expect(result).toEqual([]);
    expect(mockPrismaService.project.findMany).not.toHaveBeenCalled();
  });

  it('runs a case-insensitive OR search on title and description', async () => {
    mockPrismaService.project.findMany.mockClear();
    mockPrismaService.project.findMany.mockResolvedValue([
      { id: 1, title: 'Ravro' },
    ]);
    const result = await service.search('ravro');
    expect(mockPrismaService.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { title: { contains: 'ravro', mode: 'insensitive' } },
            { description: { contains: 'ravro', mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(result).toHaveLength(1);
  });
});
