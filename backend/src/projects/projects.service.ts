import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SecurityService } from '../security/security.service';

@Injectable()
export class ProjectsService {
  private cacheManager: Cache;

  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @Inject(CACHE_MANAGER) cacheManager: any,
  ) {
    this.cacheManager = cacheManager;
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Case-insensitive search across title + description. Uncached on purpose so
  // it never collides with the cached findAll() ('all_projects') key.
  async search(query: string) {
    const q = (query || '').trim();
    if (!q) return [];
    return this.prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto) {
    const sanitizedData = this.securityService.sanitizeInput(createProjectDto);
    await this.cacheManager.del('all_projects'); // Invalidate cache
    return this.prisma.project.create({
      data: sanitizedData as any, // Prisma types are strict, sanitizedData is generic
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const sanitizedData = this.securityService.sanitizeInput(updateProjectDto);
    await this.cacheManager.del('all_projects'); // Invalidate cache
    return this.prisma.project.update({
      where: { id },
      data: sanitizedData as any,
    });
  }

  async remove(id: number) {
    await this.cacheManager.del('all_projects'); // Invalidate cache
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
