import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sanitizeInput', () => {
    it('escapes HTML special characters in strings', () => {
      const result = service.sanitizeInput('<b>hello</b>');
      expect(result).not.toContain('<b>');
      expect(result).toContain('&lt;');
    });

    it('neutralizes a script-tag XSS payload', () => {
      const result = service.sanitizeInput('<script>alert("xss")</script>hi');
      expect(result.toLowerCase()).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('recursively sanitizes object string fields', () => {
      const result = service.sanitizeInput({
        name: '<img src=x onerror=alert(1)>',
        nested: { bio: '"><script>evil()</script>' },
      });
      expect(result.name).not.toContain('<img');
      expect(result.nested.bio).not.toContain('<script>');
    });

    it('leaves non-string primitives untouched', () => {
      expect(service.sanitizeInput(42)).toBe(42);
      expect(service.sanitizeInput(true)).toBe(true);
      expect(service.sanitizeInput(null)).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('accepts a valid email and rejects an invalid one', () => {
      expect(service.validateEmail('admin@baghaei.com')).toBe(true);
      expect(service.validateEmail('not-an-email')).toBe(false);
    });
  });
});
