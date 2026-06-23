# Phase 1 — Conversion-Blocking Bugs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every form submit and persist, and fix the two broken UI affordances (dark-mode "همه" filter, ⌘K label).

**Architecture:** Frontend gets a single bug-proof backend-URL helper used by both the client API wrapper and server actions (browser → public origin, server action → internal container origin). A new NestJS `careers` module + `JobApplication` Prisma model persists job applications, mirroring the existing `contact` module exactly. Two small CSS/markup fixes resolve the filter contrast and remove the ⌘K hint.

**Tech Stack:** Next.js 16 (App Router, RTL), NestJS 11, Prisma 7 + PostgreSQL, class-validator, Playwright (frontend e2e), Jest (backend unit).

## Global Constraints

- Backend route prefix is `/api/v1`; controllers declare only the bare path (e.g. `@Controller('careers')`).
- Route ALL user input through `SecurityService.sanitizeInput()` before persisting (project convention).
- After any `schema.prisma` change run `npx prisma generate` and create a migration.
- Frontend is `strict: false` and `no-explicit-any` is off — match existing loose typing; do not introduce strict types unprompted.
- Frontend has NO unit-test runner; verify frontend via `npm run build` + Playwright e2e (`E2E_BACKEND=1` boots the backend). Backend uses Jest (`*.spec.ts`).
- Résumé handling is a **link field** (decision A) — no file upload, no object storage.
- Keep RTL (`dir="rtl"`) and Persian copy.

---

### Task 1: Bug-proof backend URL helper (fixes contact + admin forms)

**Root cause:** root `.env` sets `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`; `api.ts` and `actions.ts` then append `/api/v1` again → `…/api/v1/api/v1/contact` (404). Also `localhost` is unreachable from the prod container.

**Files:**
- Create: `frontend/src/lib/apiBase.ts`
- Modify: `frontend/src/lib/api.ts:14`
- Modify: `frontend/src/app/actions.ts:30-32,51-65`
- Modify: root `.env:18`, `.env.example:17`
- Modify: `docker-compose.yml` (frontend service env)

**Interfaces:**
- Produces: `normalizeApiOrigin(raw?: string | null): string` — origin with no trailing slash and no `/api/v1` suffix. `apiV1Url(path: string, raw?: string | null): string` — full `…/api/v1<path>` URL.
- Consumes: `process.env.NEXT_PUBLIC_API_URL` (browser), `process.env.API_INTERNAL_URL` (server action, optional).

- [ ] **Step 1: Write the helper**

Create `frontend/src/lib/apiBase.ts`:

```ts
// Single source of truth for backend URLs. Tolerates env values that mistakenly
// include a trailing slash or an `/api/v1` suffix, so callers never double-prefix.
export function normalizeApiOrigin(raw?: string | null): string {
  const fallback = 'http://127.0.0.1:8000';
  let v = (raw && raw.trim()) || fallback;
  v = v.replace(/\/+$/, ''); // drop trailing slashes
  v = v.replace(/\/api\/v1$/i, ''); // drop an accidental /api/v1 suffix
  return v;
}

export function apiV1Url(path: string, raw?: string | null): string {
  const origin = normalizeApiOrigin(raw);
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin}/api/v1${p}`;
}
```

- [ ] **Step 2: Verify the normalizer logic (no TS runner needed)**

Run (replicates the regex in plain JS):
```bash
node -e "const n=s=>{let v=(s&&s.trim())||'http://127.0.0.1:8000';v=v.replace(/\/+\$/,'').replace(/\/api\/v1\$/i,'');return v}; console.log(n('http://localhost:8000/api/v1')); console.log(n('https://api.baghaei.com/')); console.log(n(''));"
```
Expected output:
```
http://localhost:8000
https://api.baghaei.com
http://127.0.0.1:8000
```

- [ ] **Step 3: Wire `api.ts`**

In `frontend/src/lib/api.ts`, add the import at the top (after the `'use client';` line) and replace line 14.

Add import:
```ts
import { normalizeApiOrigin } from './apiBase';
```
Replace line 14:
```ts
const BASE_URL = normalizeApiOrigin(process.env.NEXT_PUBLIC_API_URL) + '/api/v1';
```

- [ ] **Step 4: Wire `actions.ts` (server action uses internal origin; remove double prefix + log)**

In `frontend/src/app/actions.ts`, add import below line 3:
```ts
import { apiV1Url } from '@/lib/apiBase'
```
Replace the `getServices` fetch (lines 30-34) body:
```ts
 const backendBase = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL
 try {
  const res = await fetch(apiV1Url('/services', backendBase), {
   next: { revalidate: 3600 },
  })
```
Replace the `submitContactForm` backend block (lines 50-65), removing the `console.log`:
```ts
 // Server action runs in the frontend container: prefer the internal backend
 // address, falling back to the public one for local dev.
 const backendBase = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

 try {
  const response = await fetch(apiV1Url('/contact', backendBase), {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    name,
    email: email || undefined,
    phone,
    message,
    company: company || undefined,
   }),
  });
```

- [ ] **Step 5: Fix env files**

In root `.env` line 18, strip the `/api/v1` and add an internal URL line:
```
NEXT_PUBLIC_API_URL=http://46.249.99.158:8000
API_INTERNAL_URL=http://backend:8000
```
(`NEXT_PUBLIC_API_URL` is the browser-reachable backend origin — Phase 7 switches it to `https://api.baghaei.com`. Confirm the current public host with the user if unsure.)

In root `.env.example` line 17:
```
NEXT_PUBLIC_API_URL=https://api.baghaei.com # public backend origin, NO /api/v1 suffix
API_INTERNAL_URL=http://backend:8000        # internal compose address for server actions
```

- [ ] **Step 6: Pass `API_INTERNAL_URL` to the frontend container**

In `docker-compose.yml`, under the frontend service `environment:` block (alongside the existing `NEXT_PUBLIC_API_URL:` runtime entry near line 66), add:
```yaml
        API_INTERNAL_URL: ${API_INTERNAL_URL:-http://backend:8000}
```

- [ ] **Step 7: Build to confirm types compile**

Run: `cd frontend && npm run build`
Expected: build completes; no TypeScript errors referencing `apiBase`, `api.ts`, or `actions.ts`.

- [ ] **Step 8: Behavioral e2e — contact form persists**

Add `frontend/tests/contact-submit.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

// Requires a live backend: run with E2E_BACKEND=1.
test('contact form submits successfully', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact input[name="name"]').fill('تست خودکار');
  await page.locator('#contact input[name="phone"]').fill('09123456789');
  await page.locator('#contact textarea[name="message"]').fill('پیام تست از پلی‌رایت.');
  await page.locator('#contact button[type="submit"]').click();
  await expect(page.getByText(/با موفقیت|ارسال شد|دریافت شد/)).toBeVisible({ timeout: 15000 });
});
```
(Adjust selectors to the real `Contact.tsx` markup if attribute names differ — inspect `frontend/src/components/home/Contact.tsx` first.)

- [ ] **Step 9: Run the e2e**

Run: `cd frontend && E2E_BACKEND=1 npx playwright test tests/contact-submit.spec.ts`
Expected: PASS. (If the success-copy selector differs, fix the assertion to match `Contact.tsx`, not the app.)

- [ ] **Step 10: Commit**

```bash
git add frontend/src/lib/apiBase.ts frontend/src/lib/api.ts frontend/src/app/actions.ts frontend/tests/contact-submit.spec.ts .env .env.example docker-compose.yml
git commit -m "fix(api): bug-proof backend URL (no double /api/v1) + internal origin for server actions"
```

---

### Task 2: Dark-mode "همه" filter contrast

**Root cause:** dark `--primary` is `0 0% 98%` (near-white); the active "همه" button hardcodes `text-white` → white-on-white. (`ToolsClient.tsx:106-115`.)

**Files:**
- Modify: `frontend/src/app/tools/ToolsClient.tsx:106-115`

- [ ] **Step 1: Use `text-primary-foreground` for the primary case**

Replace the `className` template and `style` of the chip `<button>` (lines 106-115):
```tsx
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black font-display transition-all border min-h-11 ${
                    isActive
                      ? color
                        ? 'text-white border-transparent'
                        : 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
                  }`}
                  style={
                    color && isActive
                      ? { backgroundColor: `rgb(${color})` }
                      : undefined
                  }
```
(`min-h-11` also lifts the chip to a 44px touch target — Phase 2 alignment. Category chips keep white text on their saturated color; only the colorless "همه" chip switches to `text-primary-foreground`.)

- [ ] **Step 2: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 3: Verify in-browser (dark mode is forced)**

Use the `run` skill (or `npm run dev`) to open `/tools`. Confirm the active "همه" chip text is dark-on-light and clearly legible; category chips unchanged.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/tools/ToolsClient.tsx
git commit -m "fix(tools): legible active 'همه' filter chip in dark mode + 44px target"
```

---

### Task 3: Remove the ⌘K label

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx:151`

- [ ] **Step 1: Delete the `<kbd>` line**

Remove line 151 entirely:
```tsx
       <kbd className="hidden lg:inline-block rounded border border-border px-1.5 py-0.5 text-[10px] font-mono leading-none text-muted-foreground">⌘K</kbd>
```
Leave the search `<button>` and its `command-menu:open` dispatch intact. The Ctrl/⌘+K shortcut in `CommandMenu.tsx` keeps working.

- [ ] **Step 2: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Navbar.tsx
git commit -m "chore(nav): remove ⌘K hint label (shortcut still works)"
```

---

### Task 4: `JobApplication` model + migration

**Files:**
- Modify: `backend/prisma/schema.prisma` (append model)
- Generated: `backend/prisma/migrations/*`

**Interfaces:**
- Produces: Prisma model `JobApplication { id, position, name, email, phone, portfolioUrl, message, isRead, createdAt }`.

- [ ] **Step 1: Append the model**

Add to `backend/prisma/schema.prisma` after the `ContactMessage` model (line 52):
```prisma
model JobApplication {
  id           Int      @id @default(autoincrement())
  position     String
  name         String
  email        String
  phone        String?
  portfolioUrl String?
  message      String?
  isRead       Boolean  @default(false)
  createdAt    DateTime @default(now())

  @@index([createdAt])
  @@index([isRead, createdAt])
}
```

- [ ] **Step 2: Generate client + migration**

Run: `cd backend && npx prisma generate && npx prisma migrate dev --name add_job_application`
Expected: Prisma Client regenerates; a new migration directory appears under `prisma/migrations/`; no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations
git commit -m "feat(db): add JobApplication model + migration"
```

---

### Task 5: `careers` module (controller + service + DTO + wiring)

Mirrors the `contact` module pattern exactly (sanitize → persist → queue Telegram alert).

**Files:**
- Create: `backend/src/careers/dto/create-job-application.dto.ts`
- Create: `backend/src/careers/careers.service.ts`
- Create: `backend/src/careers/careers.controller.ts`
- Create: `backend/src/careers/careers.module.ts`
- Create: `backend/src/careers/careers.service.spec.ts`
- Modify: `backend/src/app.module.ts` (import + register `CareersModule`)

**Interfaces:**
- Consumes: `PrismaService`, `SecurityService.sanitizeInput()`, the `notifications` BullMQ queue.
- Produces: `POST /api/v1/careers` accepting `CreateJobApplicationDto`; `CareersService.create(dto)` returns the created `JobApplication`.

- [ ] **Step 1: Write the DTO**

Create `backend/src/careers/dto/create-job-application.dto.ts`:
```ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  position: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Matches(/^\+?[\d\s().-]{7,}$/, { message: 'phone must be a valid phone number' })
  phone?: string;

  @IsUrl({ require_protocol: true })
  @IsOptional()
  @MaxLength(500)
  portfolioUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  message?: string;

  // Honeypot — see CreateContactDto. Non-empty flags spam.
  @IsString()
  @IsOptional()
  @MaxLength(200)
  company?: string;
}
```

- [ ] **Step 2: Write the failing service test**

Create `backend/src/careers/careers.service.spec.ts`:
```ts
import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { CareersService } from './careers.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';

describe('CareersService', () => {
  let service: CareersService;
  const prisma = { jobApplication: { create: jest.fn() } };
  const security = { sanitizeInput: jest.fn((x) => x) };
  const queue = { add: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CareersService,
        { provide: PrismaService, useValue: prisma },
        { provide: SecurityService, useValue: security },
        { provide: getQueueToken('notifications'), useValue: queue },
      ],
    }).compile();
    service = moduleRef.get(CareersService);
  });

  it('sanitizes, persists, and queues a notification', async () => {
    prisma.jobApplication.create.mockResolvedValue({ id: 1, name: 'Ali', position: 'Frontend' });
    const dto = { position: 'Frontend', name: 'Ali', email: 'a@b.com' } as any;
    const result = await service.create(dto);
    expect(security.sanitizeInput).toHaveBeenCalled();
    expect(prisma.jobApplication.create).toHaveBeenCalled();
    expect(queue.add).toHaveBeenCalledWith('job-application', expect.any(Object), expect.any(Object));
    expect(result).toEqual({ id: 1, name: 'Ali', position: 'Frontend' });
  });

  it('drops honeypot submissions without persisting', async () => {
    const dto = { position: 'X', name: 'Bot', email: 'b@b.com', company: 'spam' } as any;
    await service.create(dto);
    expect(prisma.jobApplication.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run the test to confirm it fails**

Run: `cd backend && npx jest src/careers/careers.service.spec.ts`
Expected: FAIL — cannot find module `./careers.service`.

- [ ] **Step 4: Write the service**

Create `backend/src/careers/careers.service.ts`:
```ts
import { Injectable, Logger } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CareersService {
  private readonly logger = new Logger(CareersService.name);

  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(dto: CreateJobApplicationDto) {
    // Honeypot guard — mirror ContactService: silently drop, return success shape.
    if (dto.company && dto.company.trim() !== '') {
      this.logger.warn('Honeypot triggered — dropping suspected spam application.');
      return { id: 0, name: '', position: '', isRead: false, createdAt: new Date() };
    }

    const payload = { ...dto };
    delete payload.company;
    const data = this.securityService.sanitizeInput(payload);

    const application = await this.prisma.jobApplication.create({ data });

    await this.notificationsQueue.add(
      'job-application',
      {
        name: application.name,
        position: application.position,
        email: application.email,
        phone: application.phone,
        portfolioUrl: application.portfolioUrl,
        message: application.message,
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );

    return application;
  }
}
```

- [ ] **Step 5: Write the controller**

Create `backend/src/careers/careers.controller.ts`:
```ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('careers')
@UseInterceptors(TransformInterceptor)
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Post()
  async create(@Body() dto: CreateJobApplicationDto) {
    return this.careersService.create(dto);
  }
}
```

- [ ] **Step 6: Write the module**

Create `backend/src/careers/careers.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from '../notifications/notifications.processor';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    SecurityModule,
    NotificationsModule,
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [CareersController],
  providers: [CareersService, NotificationsProcessor],
})
export class CareersModule {}
```

- [ ] **Step 7: Register in `app.module.ts`**

Add the import alongside the other module imports (after line 16):
```ts
import { CareersModule } from './careers/careers.module';
```
Add `CareersModule,` to the `imports` array (after `ContactModule,` on line 81).

- [ ] **Step 8: Run the test to confirm it passes**

Run: `cd backend && npx jest src/careers/careers.service.spec.ts`
Expected: PASS (both tests).

- [ ] **Step 9: Confirm the app boots + route exists**

Run: `cd backend && npm run build`
Expected: Nest build succeeds; no DI errors.

- [ ] **Step 10: Commit**

```bash
git add backend/src/careers backend/src/app.module.ts
git commit -m "feat(careers): job application endpoint mirroring contact module"
```

---

### Task 6: Wire the careers form (CV link field, real submit)

**Root cause:** `CareerModal.tsx` form `onSubmit` is a no-op and there was no endpoint.

**Files:**
- Modify: `frontend/src/components/ui/CareerModal.tsx:78-96`

**Interfaces:**
- Consumes: `api.post('/careers', payload)` from `@/lib/api`; `POST /api/v1/careers` from Task 5.

- [ ] **Step 1: Add state + submit handler, replace the file drop with a link field**

In `frontend/src/components/ui/CareerModal.tsx`, add imports/state at the top of the component body (after line 14 `if (!job) return null;` — move the early return below the hooks, or lift hooks above it). Replace lines 13-14 opening with:
```tsx
export const CareerModal: React.FC<CareerModalProps> = ({ job, onClose }) => {
 const [form, setForm] = React.useState({ name: '', email: '', phone: '', portfolioUrl: '', message: '' });
 const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');

 if (!job) return null;

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.name.trim() || !form.email.trim()) { setStatus('error'); return; }
  setStatus('sending');
  try {
   const { api } = await import('@/lib/api');
   await api.post('/careers', { position: job.title, ...form });
   setStatus('done');
  } catch {
   setStatus('error');
  }
 };
```
Replace the `<form>` block (lines 78-96) with:
```tsx
        {status === 'done' ? (
         <div className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary" />
          <p className="font-display text-foreground">درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>
         </div>
        ) : (
         <form className="space-y-6" onSubmit={submit}>
          <input
           type="text" required value={form.name}
           onChange={(e) => setForm({ ...form, name: e.target.value })}
           placeholder="نام و نام خانوادگی"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="email" required value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
           placeholder="آدرس ایمیل"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="tel" value={form.phone}
           onChange={(e) => setForm({ ...form, phone: e.target.value })}
           placeholder="شماره تماس (اختیاری)"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <input
           type="url" value={form.portfolioUrl}
           onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
           placeholder="لینک رزومه یا نمونه‌کار (Google Drive، LinkedIn، …)"
           className="w-full bg-transparent border-b border-border py-4 min-h-11 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right"
          />
          <textarea
           value={form.message} rows={3}
           onChange={(e) => setForm({ ...form, message: e.target.value })}
           placeholder="توضیح کوتاه (اختیاری)"
           className="w-full bg-transparent border-b border-border py-4 text-foreground focus:outline-none focus:border-foreground transition-colors font-display text-right resize-none"
          />
          {status === 'error' && (
           <p className="text-rose-500 text-sm font-display">لطفاً نام و ایمیل معتبر وارد کنید و دوباره تلاش کنید.</p>
          )}
          <Button type="submit" className="w-full py-5" disabled={status === 'sending'}>
           {status === 'sending' ? 'در حال ارسال…' : 'ارسال درخواست'}
          </Button>
         </form>
        )}
```
Remove the now-unused `Upload` import on line 5 (`X, Upload, CheckCircle2` → `X, CheckCircle2`).

- [ ] **Step 2: Build**

Run: `cd frontend && npm run build`
Expected: compiles; no unused-import or type errors.

- [ ] **Step 3: Behavioral e2e — application persists**

Add `frontend/tests/careers-submit.spec.ts` (requires live backend):
```ts
import { test, expect } from '@playwright/test';

test('career application submits', async ({ page }) => {
  await page.goto('/careers');
  // open the first job's modal (adjust selector to real JobCard markup)
  await page.getByRole('button', { name: /درخواست|مشاهده|جزئیات/ }).first().click();
  await page.locator('input[placeholder="نام و نام خانوادگی"]').fill('تست خودکار');
  await page.locator('input[placeholder="آدرس ایمیل"]').fill('test@example.com');
  await page.getByRole('button', { name: /ارسال درخواست/ }).click();
  await expect(page.getByText(/درخواست شما ثبت شد/)).toBeVisible({ timeout: 15000 });
});
```

- [ ] **Step 4: Run the e2e**

Run: `cd frontend && E2E_BACKEND=1 npx playwright test tests/careers-submit.spec.ts`
Expected: PASS. (Fix the job-open selector to the real `careers` page markup if it differs.)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ui/CareerModal.tsx frontend/tests/careers-submit.spec.ts
git commit -m "feat(careers): wire application form to /careers with CV-link field"
```

---

## Self-Review

**Spec coverage (Phase 1 items):**
- Forms error/don't save → Tasks 1 (URL bug-proof + transport split + env/compose), 4-5-6 (careers endpoint + form). ✓
- "همه" filter white-on-white → Task 2. ✓
- Remove ⌘K → Task 3. ✓
- Decision A (CV link, no upload) → Task 6 (url field, `Upload` removed). ✓
- CORS for submitting origins → existing allowlist already covers `https://baghaei.com` + `http://localhost:3000`; subdomain origins are added in Phase 7. No new origin submits in Phase 1. ✓ (no task needed now)

**Placeholder scan:** none — every code step shows complete content; verification commands have expected output.

**Type consistency:** `normalizeApiOrigin`/`apiV1Url` defined in Task 1, consumed in Tasks 1 & 6 path strings. `CareersService.create` signature defined in Task 5, consumed by controller (Task 5) and frontend `api.post('/careers', …)` (Task 6). Queue job name `'job-application'` consistent between service (Task 5) and test (Task 5). Prisma `jobApplication` model (Task 4) matches service `prisma.jobApplication.create` (Task 5). ✓

**Note for executor:** the contact/careers e2e success paths need a live backend (`E2E_BACKEND=1`) — see memory `contact-e2e-server-action`. Selectors in Steps 8/3 are best-effort; inspect the real `Contact.tsx` / careers page markup before running and adjust the locators (not the app) if they differ.
