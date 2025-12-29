import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        published: boolean;
        slug: string;
        content: string | null;
        imageUrl: string | null;
        tags: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        published: boolean;
        slug: string;
        content: string | null;
        imageUrl: string | null;
        tags: string | null;
    }>;
    create(createProjectDto: CreateProjectDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        published: boolean;
        slug: string;
        content: string | null;
        imageUrl: string | null;
        tags: string | null;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        published: boolean;
        slug: string;
        content: string | null;
        imageUrl: string | null;
        tags: string | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        published: boolean;
        slug: string;
        content: string | null;
        imageUrl: string | null;
        tags: string | null;
    }>;
}
