import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecurityService } from '../security/security.service';
import { TwoFactorService } from './two-factor.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockSecurityService = {
    sanitizeInput: jest.fn((input) => input),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: SecurityService, useValue: mockSecurityService },
        TwoFactorService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('returns the user without the password when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'admin@baghaei.com',
        password: hashedPassword,
        name: 'Admin',
        role: Role.ADMIN,
      });

      const result = await service.validateUser(
        'admin@baghaei.com',
        'correct-password',
      );

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe('admin@baghaei.com');
    });

    it('returns null when the password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'admin@baghaei.com',
        password: hashedPassword,
        name: 'Admin',
        role: Role.ADMIN,
      });

      const result = await service.validateUser(
        'admin@baghaei.com',
        'wrong-password',
      );

      expect(result).toBeNull();
    });

    it('returns null when the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(
        'ghost@baghaei.com',
        'whatever',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('signs an access and refresh token and omits the password', async () => {
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login({
        id: 1,
        email: 'admin@baghaei.com',
        name: 'Admin',
        role: Role.ADMIN,
      });

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user).toEqual({
        id: '1',
        email: 'admin@baghaei.com',
        name: 'Admin',
        role: Role.ADMIN,
      });
      // refresh token must be signed with a longer expiry
      expect(mockJwtService.sign).toHaveBeenCalledWith(expect.any(Object), {
        expiresIn: '7d',
      });
    });
  });

  describe('register', () => {
    it('hashes the password before persisting and never stores plaintext', async () => {
      mockPrismaService.user.create.mockImplementation(({ data }) => data);

      const result = await service.register({
        email: 'new@baghaei.com',
        password: 'plaintext-password',
        name: 'New User',
      });

      expect(mockSecurityService.sanitizeInput).toHaveBeenCalled();
      expect(result.password).not.toBe('plaintext-password');
      // bcrypt hash must verify against the original password
      await expect(
        bcrypt.compare('plaintext-password', result.password),
      ).resolves.toBe(true);
      expect(result.role).toBe(Role.USER);
    });
  });
});
