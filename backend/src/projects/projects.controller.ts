import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project as ProjectModel } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<ProjectModel[]> {
    return this.projectsService.projects({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<ProjectModel | null> {
    return this.projectsService.project({ id: Number(id) });
  }

  @Post()
  async createProject(
    @Body() projectData: { title: string; slug: string; description: string; content?: string; tags?: string[] },
  ): Promise<ProjectModel> {
    return this.projectsService.createProject(projectData);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() projectData: { title?: string; description?: string; published?: boolean },
  ): Promise<ProjectModel> {
    return this.projectsService.updateProject({
      where: { id: Number(id) },
      data: projectData,
    });
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<ProjectModel> {
    return this.projectsService.deleteProject({ id: Number(id) });
  }
}
