import { Controller, Get, Post, Body, Param, UseInterceptors, Put, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('projects')
@UseInterceptors(TransformInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  // Admin routes can be added here with Guards
}