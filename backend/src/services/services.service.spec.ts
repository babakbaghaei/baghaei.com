import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ServicesService', () => {
  let service: ServicesService;

  const mockPrisma = {
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockSecurity = {
    sanitizeInput: jest.fn((val) => val),
  };

  const mockCache = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SecurityService, useValue: mockSecurity },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return published services ordered by order', async () => {
      const mockResult = [{ id: 1, title: 'Service 1', published: true }];
      mockPrisma.service.findMany.mockResolvedValue(mockResult);

      const result = await service.findAll();
      expect(result).toEqual(mockResult);
      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
        where: { published: true },
      });
    });
  });

  describe('create', () => {
    it('should sanitize input and clear cache', async () => {
      const dto = {
        title: 'New Service',
        description: 'Desc',
        iconName: 'Icon',
      };
      mockPrisma.service.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result.id).toBe(1);
      expect(mockSecurity.sanitizeInput).toHaveBeenCalledWith(dto);
      expect(mockCache.del).toHaveBeenCalledWith('services');
    });
  });
});
