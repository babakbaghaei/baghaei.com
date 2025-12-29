import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SecurityService } from '../security/security.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ServicesService {
  private cacheManager: Cache;

  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @Inject(CACHE_MANAGER) cacheManager: any,
  ) {
    this.cacheManager = cacheManager;
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { order: 'asc' },
      where: { published: true },
    });
  }

  async findAllAdmin() {
    return this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: CreateServiceDto) {
    const sanitizedData = this.securityService.sanitizeInput(createServiceDto);
    await this.cacheManager.del('services');
    return this.prisma.service.create({
      data: sanitizedData as any,
    });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const sanitizedData = this.securityService.sanitizeInput(updateServiceDto);
    await this.cacheManager.del('services');
    return this.prisma.service.update({
      where: { id },
      data: sanitizedData as any,
    });
  }

  async remove(id: number) {
    await this.cacheManager.del('services');
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
