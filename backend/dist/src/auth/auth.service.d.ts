import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { SecurityService } from '../security/security.service';
export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private securityService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, securityService: SecurityService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: {
        id: number;
        email: string;
        name: string | null;
        role: Role;
    }): Promise<LoginResponse>;
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(refreshToken?: string): Promise<void>;
}
