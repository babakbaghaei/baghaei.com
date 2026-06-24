import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { getTool, getCategoryMeta } from '@/lib/data/tools';

/**
 * صفحهٔ «قفل» یک ابزار. برای ابزارهایی که هنوز قابل انتشار نیستند (مثلاً منتظر
 * تأیید نرخ رسمی) به‌جای ماشین‌حساب کامل نمایش داده می‌شود تا کاربر نتیجهٔ
 * غیررسمی نگیرد. کد ماشین‌حساب دست‌نخورده باقی می‌ماند تا فعال‌سازی دوباره آسان
 * باشد — فقط page.tsx این صفحه را رندر می‌کند.
 */
export default function ToolLockedScreen({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const title = tool?.title ?? 'این ابزار';
  const note = tool?.lockNote ?? 'به‌زودی در دسترس قرار می‌گیرد';
  const accent = tool ? getCategoryMeta(tool.category).color : '139, 92, 246';

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center px-6 py-24" dir="rtl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: `rgb(${accent})` }}
        />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div
          className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl"
          style={{ background: `rgba(${accent}, 0.12)`, color: `rgb(${accent})` }}
        >
          <Lock className="h-7 w-7" strokeWidth={1.75} />
        </div>

        <h1 className="font-display text-2xl font-black text-foreground md:text-3xl">
          {title}
        </h1>

        <span
          className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold font-display"
          style={{
            borderColor: `rgba(${accent}, 0.35)`,
            background: `rgba(${accent}, 0.08)`,
            color: `rgb(${accent})`,
          }}
        >
          {note}
        </span>

        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          این ابزار به‌دلیل وابستگی به نرخ‌ها و مصوبات رسمی، فعلاً غیرفعال است و به‌محض
          نهایی‌شدن مرجع رسمی، در دسترس قرار می‌گیرد.
        </p>

        <Link
          href="/tools"
          className="group mt-9 inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3.5 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
        >
          بازگشت به جعبه ابزار
          <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
