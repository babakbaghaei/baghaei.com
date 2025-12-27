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
        slug: string;
        description: string;
        content: string | null;
        imageUrl: string | null;
        tags: string[];
        published: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        content: string | null;
        imageUrl: string | null;
        tags: string[];
        published: boolean;
    }>;
    create(createProjectDto: CreateProjectDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        content: string | null;
        imageUrl: string | null;
        tags: string[];
        published: boolean;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        content: string | null;
        imageUrl: string | null;
        tags: string[];
        published: boolean;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        content: string | null;
        imageUrl: string | null;
        tags: string[];
        published: boolean;
    }>;
}
