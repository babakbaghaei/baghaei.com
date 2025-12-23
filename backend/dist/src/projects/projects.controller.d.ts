import { ProjectsService } from './projects.service';
import { Project as ProjectModel } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getAllProjects(): Promise<ProjectModel[]>;
    getProjectById(id: string): Promise<ProjectModel | null>;
    createProject(projectData: {
        title: string;
        slug: string;
        description: string;
        content?: string;
        tags?: string[];
    }): Promise<ProjectModel>;
    updateProject(id: string, projectData: {
        title?: string;
        description?: string;
        published?: boolean;
    }): Promise<ProjectModel>;
    deleteProject(id: string): Promise<ProjectModel>;
}
