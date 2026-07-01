'use client';

/**
 * R23 — «دیدگاه، امتیاز و گزارش مشکل» برای هر ابزار، همه از داخلِ پنل (نه ایمیل).
 * زیر هر صفحهٔ ابزار در ToolShell رندر می‌شود؛ اسلاگ از مسیر صفحه گرفته می‌شود.
 * روی دیتای بک‌اند (‎/api/v1/tool-feedback‎) کار می‌کند و اگر بک‌اند در دسترس
 * نباشد بی‌سروصدا فقط فرم‌ها را نشان می‌دهد.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, Bug, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { toPersianDigits as faNum } from '@/lib/utils/format';
import {
  fetchToolReviews,
  submitToolReview,
  submitToolReport,
  type ReviewSummary,
} from '@/lib/toolFeedback';

const faDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
};

const inputCls =
  'w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-foreground/40 transition-colors';

/** فیلد تله برای ربات‌ها — کاربر واقعی نمی‌بیندش و خالی می‌ماند. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute -left-[9999px] top-0 h-0 w-0 opacity-0"
    />
  );
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= Math.round(value)
              ? 'text-amber-400 fill-amber-400'
              : 'text-muted-foreground/30'
          }
          style={{ width: size, height: size }}
          strokeWidth={1.75}
        />
      ))}
    </span>
  );
}

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="امتیاز شما">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} ستاره`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={
              (hover || value) >= i
                ? 'text-amber-400 fill-amber-400'
                : 'text-muted-foreground/40'
            }
            style={{ width: 26, height: 26 }}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────── فرم گزارش مشکل (بازاستفاده‌پذیر) ─────────────────────── */

export function ReportForm({ slug, onDone }: { slug: string; onDone?: () => void }) {
  const [issue, setIssue] = useState('');
  const [contact, setContact] = useState('');
  const [company, setCompany] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (issue.trim().length < 3) {
      setError('لطفاً مشکل را کوتاه توضیح دهید.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await submitToolReport({
        toolSlug: slug,
        issue: issue.trim(),
        contact: contact.trim() || undefined,
        company,
      });
      setDone(true);
      setIssue('');
      setContact('');
      onDone?.();
    } catch {
      setError('ارسال ناموفق بود. لطفاً کمی بعد دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-4 text-sm font-medium text-emerald-400">
        <Check className="h-4 w-4 shrink-0" />
        گزارش شما ثبت شد؛ ممنون که به دقیق‌تر شدن ابزارها کمک کردید.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="شرح مشکل، خطای محاسباتی یا نتیجهٔ نادرست…"
        className={`${inputCls} resize-none`}
      />
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        maxLength={120}
        placeholder="راه ارتباطی (اختیاری) — تلفن یا ایمیل"
        className={inputCls}
      />
      <Honeypot value={company} onChange={setCompany} />
      {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      <Button
        size="sm"
        onClick={submit}
        isLoading={busy}
        rightIcon={<Send className="h-4 w-4" />}
        className="px-6"
      >
        ارسال گزارش
      </Button>
    </div>
  );
}

/* ─────────────────────────── پنل کاملِ دیدگاه ابزار ─────────────────────────── */

export default function ToolFeedback({
  slug,
  initialSummary,
}: {
  slug: string;
  // وقتی والد (ToolShell) خودش خلاصه را می‌خواند و می‌دهد، این‌جا دوباره واکشی نمی‌کنیم.
  // undefined = والد مدیریت نمی‌کند (خودمان مستقل واکشی کنیم)؛
  // null یا مقدار = والد مدیریت می‌کند (در حال بارگذاری یا آماده).
  initialSummary?: ReviewSummary | null;
}) {
  const managed = initialSummary !== undefined;
  const [summary, setSummary] = useState<ReviewSummary | null>(initialSummary ?? null);
  const [loading, setLoading] = useState(!managed || initialSummary == null);

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [company, setCompany] = useState('');
  const [busy, setBusy] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState('');

  const [reportOpen, setReportOpen] = useState(false);

  // حالتِ مدیریت‌شده: خلاصهٔ والد را آینه کن (بدون واکشیِ دوباره). مرجعِ آبجکت
  // در ToolShell پس از بارگذاری ثابت می‌ماند، پس این افکت روی بروزرسانیِ خوش‌بینانهٔ
  // پایین دست نمی‌گذارد.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!managed) return;
    setSummary(initialSummary ?? null);
    setLoading(initialSummary == null);
  }, [managed, initialSummary]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // حالتِ مستقل: اگر والد چیزی ندهد، خودمان واکشی می‌کنیم (سازگاری به‌عقب).
  useEffect(() => {
    if (managed) return;
    let alive = true;
    setLoading(true);
    fetchToolReviews(slug)
      .then((s) => {
        if (alive) setSummary(s);
      })
      .catch(() => {
        // بک‌اند در دسترس نیست — فقط فرم‌ها را نگه می‌داریم.
        if (alive) setSummary({ toolSlug: slug, count: 0, average: 0, reviews: [] });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, managed]);

  const submitReview = async () => {
    if (rating < 1) {
      setError('لطفاً ابتدا امتیاز خود را انتخاب کنید.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const review = await submitToolReview({
        toolSlug: slug,
        rating,
        name: name.trim() || undefined,
        body: body.trim() || undefined,
        company,
      });
      // بروزرسانی خوش‌بینانه با نتیجهٔ برگشتی
      setSummary((prev) => {
        const list = [review, ...(prev?.reviews ?? [])];
        const count = list.length;
        const average =
          Math.round((list.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10;
        return { toolSlug: slug, count, average, reviews: list };
      });
      setPosted(true);
      setRating(0);
      setName('');
      setBody('');
    } catch {
      setError('ثبت دیدگاه ناموفق بود. لطفاً کمی بعد دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  };

  const count = summary?.count ?? 0;
  const average = summary?.average ?? 0;
  const reviews = summary?.reviews ?? [];

  return (
    <section className="no-print mt-16" dir="rtl" aria-label="دیدگاه کاربران">
      {/* سرصفحه */}
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-black font-display text-foreground">دیدگاه کاربران</h2>
        <div className="flex-1 h-px bg-border" />
        {count > 0 && (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Stars value={average} size={14} />
            <span className="font-display font-bold text-foreground">{faNum(average)}</span>
            <span>({faNum(count)} دیدگاه)</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        {/* فرم ثبت دیدگاه */}
        <div className="rounded-[2rem] border border-border bg-card/40 backdrop-blur-xl p-6 md:p-7">
          {posted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground">دیدگاه شما ثبت شد</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                ممنون از وقتی که گذاشتید. نظر شما همین حالا در فهرست کنار نمایش داده می‌شود.
              </p>
              <button
                type="button"
                onClick={() => setPosted(false)}
                className="mt-1 text-xs font-display font-bold text-primary hover:underline"
              >
                ثبت دیدگاه دیگر
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-bold text-foreground">این ابزار چقدر برایتان مفید بود؟</p>
              <StarInput value={rating} onChange={setRating} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="نام شما (اختیاری)"
                className={inputCls}
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="تجربه‌تان را بنویسید… (اختیاری)"
                className={`${inputCls} resize-none`}
              />
              <Honeypot value={company} onChange={setCompany} />
              {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
              <Button
                onClick={submitReview}
                isLoading={busy}
                rightIcon={<Send className="h-4 w-4" />}
                className="w-full"
              >
                ثبت دیدگاه
              </Button>
            </div>
          )}
        </div>

        {/* فهرست دیدگاه‌ها */}
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-[2rem] border border-border bg-card/40 p-6 text-center text-xs text-muted-foreground">
              در حال بارگذاری دیدگاه‌ها…
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-[2rem] border border-dashed border-border bg-card/20 p-8 text-center">
              <Stars value={0} size={18} />
              <p className="text-sm font-bold text-foreground">هنوز دیدگاهی ثبت نشده</p>
              <p className="text-xs text-muted-foreground">اولین نفری باشید که تجربه‌اش را می‌نویسد.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[26rem] overflow-y-auto pl-1">
              {reviews.map((r) => (
                <motion.div
                  key={r.id || `${r.createdAt}-${r.rating}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-foreground font-display">
                      {r.name || 'کاربر'}
                    </span>
                    <Stars value={r.rating} size={13} />
                  </div>
                  {r.body && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground/60">{faDate(r.createdAt)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* گزارش مشکل — پنلی، نه ایمیل */}
      <div className="mt-6 rounded-[2rem] border border-border bg-card/30 p-6 md:p-7">
        <button
          type="button"
          onClick={() => setReportOpen((v) => !v)}
          className="flex w-full items-center gap-3 text-right"
          aria-expanded={reportOpen}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <Bug className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-black font-display text-foreground">مشکلی در محاسبه دیدید؟</span>
            <span className="block text-xs text-muted-foreground mt-0.5">
              خطا یا نتیجهٔ نادرست را همین‌جا گزارش دهید تا سریع بررسی شود.
            </span>
          </span>
          <motion.span animate={{ rotate: reportOpen ? 180 : 0 }} className="text-muted-foreground">
            ▾
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {reportOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <ReportForm slug={slug} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
