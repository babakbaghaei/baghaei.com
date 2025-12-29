import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("./auth.service").LoginResponse>;
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
