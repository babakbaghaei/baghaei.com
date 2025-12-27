"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
const security_service_1 = require("../security/security.service");
let ProjectsService = class ProjectsService {
    prisma;
    securityService;
    cacheManager;
    constructor(prisma, securityService, cacheManager) {
        this.prisma = prisma;
        this.securityService = securityService;
        this.cacheManager = cacheManager;
    }
    async findAll() {
        return this.prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async create(createProjectDto) {
        const sanitizedData = this.securityService.sanitizeInput(createProjectDto);
        await this.cacheManager.del('all_projects');
        return this.prisma.project.create({
            data: sanitizedData,
        });
    }
    async update(id, updateProjectDto) {
        const sanitizedData = this.securityService.sanitizeInput(updateProjectDto);
        await this.cacheManager.del('all_projects');
        return this.prisma.project.update({
            where: { id },
            data: sanitizedData,
        });
    }
    async remove(id) {
        await this.cacheManager.del('all_projects');
        return this.prisma.project.delete({
            where: { id },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        security_service_1.SecurityService, Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map