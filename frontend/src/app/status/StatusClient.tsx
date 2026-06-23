'use client';

import { useEffect, useState, useCallback } from 'react';

// Shape written by deploy/auto-deploy.sh into public/deploy-status.json (served
// by nginx). All fields optional so a half-written/absent file degrades safely.
interface DeployStatus {
 stage?: 'idle' | 'fetch' | 'pull' | 'migrate' | 'up' | 'done' | 'error';
 percent?: number;
 eta?: string;
 commit?: string;
 message?: string;
 started_at?: string;
 updated_at?: string;
}

// Persian labels for each deploy stage, in order, so we can render a stepper.
const STAGES: { key: NonNullable<DeployStatus['stage']>; label: string }[] = [
 { key: 'fetch', label: 'دریافت کد' },
 { key: 'pull', label: 'دریافت ایمیج‌ها' },
 { key: 'migrate', label: 'مهاجرت پایگاه‌داده' },
 { key: 'up', label: 'راه‌اندازی سرویس‌ها' },
 { key: 'done', label: 'پایان' },
];

const STAGE_ORDER = STAGES.map((s) => s.key);

export default function StatusClient() {
 const [status, setStatus] = useState<DeployStatus | null>(null);
 const [error, setError] = useState(false);
 const [lastOk, setLastOk] = useState<number | null>(null);

 const poll = useCallback(async () => {
  try {
   // Cache-bust so we always read the freshest file, never a CDN/browser copy.
   const res = await fetch(`/deploy-status.json?t=${Date.now()}`, { cache: 'no-store' });
   if (!res.ok) throw new Error(String(res.status));
   const data = (await res.json()) as DeployStatus;
   setStatus(data);
   setError(false);
   setLastOk(Date.now());
  } catch {
   setError(true);
  }
 }, []);

 useEffect(() => {
  poll();
  const id = setInterval(poll, 3000);
  return () => clearInterval(id);
 }, [poll]);

 const stage = status?.stage ?? 'idle';
 const isError = stage === 'error';
 const isDone = stage === 'done';
 // Derive percent: explicit value wins, else infer from stage position.
 const stageIdx = STAGE_ORDER.indexOf(stage as NonNullable<DeployStatus['stage']>);
 const percent =
  typeof status?.percent === 'number'
   ? Math.max(0, Math.min(100, status.percent))
   : isDone
     ? 100
     : stageIdx >= 0
       ? Math.round(((stageIdx + 0.5) / STAGES.length) * 100)
       : 0;

 return (
  <main dir="rtl" className="min-h-screen flex items-center justify-center px-6 py-24 text-foreground">
   <div className="w-full max-w-xl">
    <div className="mb-8 text-center">
     <h1 className="font-display text-2xl md:text-3xl font-black">وضعیت استقرار</h1>
     <p className="mt-2 text-sm text-muted-foreground">
      {stage === 'idle' && !error && 'هیچ استقراری در حال اجرا نیست.'}
      {isError && 'استقرار با خطا متوقف شد.'}
      {isDone && 'آخرین استقرار با موفقیت کامل شد.'}
      {!isDone && !isError && stage !== 'idle' && 'استقرار در حال اجرا است…'}
      {error && stage === 'idle' && 'در انتظار اطلاعات وضعیت…'}
     </p>
    </div>

    {/* Progress bar */}
    <div
     className="h-3 w-full overflow-hidden rounded-full bg-secondary"
     role="progressbar"
     aria-valuenow={percent}
     aria-valuemin={0}
     aria-valuemax={100}
     aria-label="پیشرفت استقرار"
    >
     <div
      className={`h-full rounded-full transition-all duration-700 ease-out ${
       isError ? 'bg-red-500' : isDone ? 'bg-emerald-500' : 'bg-primary'
      }`}
      style={{ width: `${percent}%` }}
     />
    </div>
    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
     <span>{percent}%</span>
     {status?.eta && !isDone && !isError && <span>زمان تقریبی باقی‌مانده: {status.eta}</span>}
    </div>

    {/* Stage stepper */}
    <ol className="mt-10 space-y-3">
     {STAGES.map((s, i) => {
      const idx = STAGE_ORDER.indexOf(s.key);
      const active = stageIdx === idx && !isDone && !isError;
      const complete = isDone || (stageIdx > idx && stageIdx >= 0);
      return (
       <li key={s.key} className="flex items-center gap-3">
        <span
         className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
          complete
           ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
           : active
             ? 'border-primary bg-primary/15 text-primary'
             : 'border-border text-muted-foreground'
         }`}
        >
         {complete ? '✓' : i + 1}
        </span>
        <span className={`text-sm ${active ? 'text-foreground' : complete ? 'text-foreground/80' : 'text-muted-foreground'}`}>
         {s.label}
        </span>
        {active && <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
       </li>
      );
     })}
    </ol>

    {/* Meta */}
    <div className="mt-10 space-y-1 rounded-2xl border border-border bg-card/30 p-5 text-xs text-muted-foreground">
     {status?.commit && (
      <div className="flex justify-between">
       <span>کامیت</span>
       <span className="font-mono text-foreground/80">{status.commit.slice(0, 12)}</span>
      </div>
     )}
     {status?.message && (
      <div className="flex justify-between gap-4">
       <span>پیام</span>
       <span className="truncate text-foreground/80">{status.message}</span>
      </div>
     )}
     {lastOk && (
      <div className="flex justify-between">
       <span>آخرین به‌روزرسانی</span>
       <span className="text-foreground/80">{new Date(lastOk).toLocaleTimeString('fa-IR')}</span>
      </div>
     )}
    </div>
   </div>
  </main>
 );
}
