import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SecurityService } from '../security/security.service';
export declare class ProjectsService {
    private prisma;
    private securityService;
    private cacheManager;
    constructor(prisma: PrismaService, securityService: SecurityService, cacheManager: any);
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
    findOne(id: number): Promise<{
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
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<{
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
    remove(id: number): Promise<{
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
