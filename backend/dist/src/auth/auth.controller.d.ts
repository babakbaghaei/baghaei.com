import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(body: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
