'use client';

/**
 * عناصر مشترک رابط کاربری ابزارها — هم‌سبک با طراحی «خسارت تأخیر تأدیه».
 * هدف: نگه‌داشتن فیزیک و ظاهر یکدست (شیشه‌ای + لهجهٔ رنگی) در تمام ابزارها و
 * جلوگیری از تکرار قالب در هر صفحه.
 */

import React, { useState, useCallback, useSyncExternalStore, useId, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  X,
  Share2,
  Check,
  Copy,
  AlertTriangle,
  Info,
  BookOpen,
  Printer,
  History as HistoryIcon,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';
import { numToPersian } from '@/lib/utils/num-to-persian';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

/* ───────────── helpers ───────────── */

export const faNum = toPersianDigits;
export const toWords = (n: number) => numToPersian(String(Math.round(n)));

/** پاک‌کردن جداکننده و تبدیل به عدد. */
export const cleanNum = (s: string) => Number(String(s).replace(/,/g, '')) || 0;

/** نرمال‌سازی ورودی فارسی/عربی به انگلیسی و سپس فقط ارقام. */
export const normalizeDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);

export const groupThousands = (digits: string) =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const fmtMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString('en-US'));
export const fmtPct = (n: number) =>
  toPersianDigits((Math.round(n * 100) / 100).toLocaleString('en-US')) + '٪';
export const fmtNum = (n: number, maxFrac = 2) =>
  toPersianDigits(n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxFrac }));

/* ───────────── shell ───────────── */

export interface ToolInfo {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}

export function ToolShell({
  title,
  subtitle,
  icon: Icon,
  accent,
  children,
  info,
  disclaimer,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  children: React.ReactNode;
  info?: ToolInfo[];
  disclaimer?: React.ReactNode;
}) {
  return (
    <main
      className="relative overflow-x-hidden px-4 md:px-6 pt-24 pb-28"
      dir="rtl"
      style={{ ['--accent' as string]: accent }}
    >
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] blur-[140px] rounded-full"
          style={{ background: `rgba(${accent}, 0.07)` }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/5 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* breadcrumb */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-display mb-8"
        >
          <ChevronRight className="w-4 h-4" /> جعبه ابزار
        </Link>

        {/* header */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `rgba(${accent}, 0.12)`,
              border: `1px solid rgba(${accent}, 0.25)`,
              color: `rgb(${accent})`,
            }}
          >
            <Icon className="w-7 h-7" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black font-display tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-xs md:text-sm font-medium mt-1">{subtitle}</p>
          </div>
        </div>

        {children}

        {/* info / educational cards */}
        {info && info.length > 0 && (
          <>
            <div className="w-full flex items-center gap-2 mt-12 mb-5">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black font-display text-foreground">قوانین و اطلاعات بیشتر</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
              {info.map((c, i) => (
                <InfoCard key={i} icon={c.icon} title={c.title}>
                  {c.body}
                </InfoCard>
              ))}
            </div>
          </>
        )}

        {/* disclaimer */}
        {disclaimer && (
          <div className="mt-6 flex items-start gap-3 text-muted-foreground text-xs font-medium bg-muted/40 border border-border rounded-2xl p-5 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{disclaimer}</span>
          </div>
        )}

        {/* offline + back */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="inline-flex items-center gap-2 text-muted-foreground font-medium">
            <Info className="w-4 h-4 text-primary" />
            تمامی محاسبات آفلاین در مرورگر شما انجام می‌شود.
          </span>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-display"
          >
            <ChevronRight className="w-4 h-4" /> سایر ابزارها
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ───────────── layout ───────────── */

export function TwoPane({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-6 items-start">{children}</div>
  );
}

export function Panel({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-card border border-border rounded-[2rem] p-6 md:p-9 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function VerdictPanel({
  accent,
  children,
  delay = 0.08,
}: {
  accent: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // قابلیت کشف نتیجه روی موبایل: پنل نتیجه فقط lg:sticky است، پس کاربر موبایل
  // پس از وارد کردن مقادیر باید پایین برود تا نتیجه را ببیند. وقتی محتوای پنل
  // برای نخستین‌بار از حالت خالی فراتر می‌رود (نتیجه ظاهر می‌شود)، یک‌بار و فقط
  // در صفحه‌های کوچک، پنل را با حرکت ملایم به دید می‌آوریم.
  const scrolledRef = useRef(false);
  const baseHeightRef = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const isSmall = () =>
      typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (baseHeightRef.current === 0) {
        baseHeightRef.current = h;
        return;
      }
      // یک جهش معنادار ارتفاع = ظهور نتیجه (نسبت به حالت خالی).
      if (!scrolledRef.current && h > baseHeightRef.current + 40 && isSmall()) {
        scrolledRef.current = true;
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="lg:sticky lg:top-24 rounded-[2rem] border overflow-hidden scroll-mt-24"
      style={{ borderColor: `rgba(${accent}, 0.25)` }}
    >
      <div
        className="p-6 md:p-9"
        style={{ background: `linear-gradient(160deg, rgba(${accent}, 0.10), transparent 60%)` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ───────────── inputs ───────────── */

/**
 * id جاری فیلد — به ورودی داخل هر Field تزریق می‌شود تا برچسب (label) واقعی با
 * htmlFor به کنترل گره بخورد و کلیک روی برچسب، ورودی را فوکوس کند.
 */
const FieldContext = React.createContext<string | undefined>(undefined);

/** id فیلد جاری را برمی‌گرداند تا روی <input>/<select> داخل Field گذاشته شود. */
export function useFieldId() {
  return React.useContext(FieldContext);
}

export function Field({
  label,
  action,
  hint,
  children,
  center,
  htmlFor,
}: {
  label: string;
  action?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
  center?: boolean;
  htmlFor?: string;
}) {
  const generatedId = useId();
  const id = htmlFor ?? generatedId;
  return (
    <FieldContext.Provider value={id}>
      <div className="space-y-3">
        <div
          className={`relative flex items-center min-h-[28px] ${center ? 'justify-center' : 'justify-between'}`}
        >
          <label
            htmlFor={id}
            className="text-xs font-black text-muted-foreground uppercase tracking-wide"
          >
            {label}
          </label>
          {action && (
            <div className={center ? 'absolute left-0 top-1/2 -translate-y-1/2' : ''}>{action}</div>
          )}
        </div>
        {hint && (
          <p className="text-xs text-muted-foreground/70 font-display leading-relaxed">{hint}</p>
        )}
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export type Unit = 'toman' | 'rial';
export const unitLabel = (u: Unit) => (u === 'toman' ? 'تومان' : 'ریال');

/** ورودی مبلغ با تبدیل ارقام، جداکنندهٔ هزارگان، کلید پاک‌کردن و خط حروف. */
export function MoneyField({
  label,
  amount,
  setAmount,
  unit,
  setUnit,
  showWords = true,
  center = true,
}: {
  label: string;
  amount: string;
  setAmount: (v: string) => void;
  unit: Unit;
  setUnit?: (u: Unit) => void;
  showWords?: boolean;
  center?: boolean;
}) {
  const clean = cleanNum(amount);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
    if (v.length <= 15) setAmount(groupThousands(v));
  };
  return (
    <Field
      label={label}
      center={center}
      action={
        setUnit && (
          <div className="flex bg-muted p-0.5 rounded-lg border border-border">
            {(['toman', 'rial'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-md text-xs font-black transition-all ${
                  unit === u ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {unitLabel(u)}
              </button>
            ))}
          </div>
        )
      }
    >
      <MoneyInput
        amount={amount}
        onChange={onChange}
        onClear={() => setAmount('')}
        label={label}
        unit={unit}
      />
      {showWords && clean > 0 && (
        <p className="text-xs text-muted-foreground/70 font-display text-center mt-2">
          {toWords(clean)} {unitLabel(unit)}
        </p>
      )}
    </Field>
  );
}

/** ورودی داخلی MoneyField — از FieldContext، id برچسب را می‌گیرد. */
function MoneyInput({
  amount,
  onChange,
  onClear,
  label,
  unit,
}: {
  amount: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  label: string;
  unit: Unit;
}) {
  const id = useFieldId();
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={toPersianDigits(amount)}
        onChange={onChange}
        placeholder="۰"
        dir="ltr"
        aria-label={label}
        className="w-full bg-background border-2 border-border rounded-2xl py-5 px-5 pl-14 font-bold font-display text-center focus:border-primary transition-all outline-none text-2xl md:text-4xl placeholder:text-muted/30"
      />
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40">
        {unitLabel(unit)}
      </span>
      {amount && (
        <button
          onClick={onClear}
          aria-label="پاک کردن"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted text-muted-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function Select({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string | number;
  onChange: (v: string) => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const id = useFieldId();
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="w-full bg-background border-2 border-border rounded-xl py-2.5 pr-3 pl-8 font-display text-sm focus:border-primary outline-none transition-all text-foreground appearance-none cursor-pointer text-center"
      >
        {children}
      </select>
      <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
    </div>
  );
}

export function SelectField({
  icon,
  label,
  hint,
  value,
  onChange,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <FieldContext.Provider value={id}>
      <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
        <label htmlFor={id} className="flex items-center gap-2 text-foreground font-bold font-display text-sm">
          {icon && (
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {icon}
            </div>
          )}
          <span>{label}</span>
        </label>
        {hint && (
          <p className="text-xs text-muted-foreground/70 font-display leading-relaxed">{hint}</p>
        )}
        <Select value={value} onChange={onChange} ariaLabel={label}>
          {children}
        </Select>
      </div>
    </FieldContext.Provider>
  );
}

/** کلید عدد/ضریب ساده (Stepper) برای تعداد ورثه و مانند آن. */
export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-foreground font-bold font-display text-sm">{label}</span>
        {hint && <p className="text-xs text-muted-foreground/70 font-display mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => set(value - 1)}
          aria-label="کاهش"
          className="w-8 h-8 rounded-lg bg-background border border-border text-foreground font-black hover:border-primary transition-colors"
        >
          −
        </button>
        <span className="w-8 text-center font-display font-black tabular-nums">{faNum(value)}</span>
        <button
          onClick={() => set(value + 1)}
          aria-label="افزایش"
          className="w-8 h-8 rounded-lg bg-background border border-border text-foreground font-black hover:border-primary transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full bg-muted/30 border border-border rounded-2xl p-4 flex items-center justify-between gap-3 text-right hover:border-primary/40 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-foreground font-bold font-display text-sm">{label}</span>
        {hint && <p className="text-xs text-muted-foreground/70 font-display mt-0.5">{hint}</p>}
      </div>
      <span
        className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`block w-5 h-5 rounded-full bg-background transition-transform ${
            checked ? '-translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

/* ───────────── result display ───────────── */

export function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground font-display">{label}</span>
      <span
        className={`font-display text-left ${
          strong ? 'text-primary font-black text-sm' : 'text-foreground font-bold text-xs'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function Headline({
  accent,
  label,
  value,
  suffix,
  sub,
}: {
  accent: string;
  label: string;
  value: string;
  suffix?: string;
  sub?: React.ReactNode;
}) {
  // متن کپی: مقدار نتیجه و در صورت وجود، واحد آن.
  const copyText = suffix ? `${value} ${suffix}` : value;
  const hasResult = value != null && String(value).trim() !== '';
  return (
    <div className="relative text-center space-y-1.5">
      {hasResult && (
        <CopyButton accent={accent} text={copyText} className="absolute top-0 left-0" />
      )}
      <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <p
        className="text-3xl md:text-5xl font-black font-display leading-tight break-words"
        style={{ color: `rgb(${accent})` }}
      >
        {value}
        {suffix && (
          <span className="text-sm md:text-base text-muted-foreground font-bold mr-2">{suffix}</span>
        )}
      </p>
      {sub && <p className="text-xs text-muted-foreground/70 font-display px-2">{sub}</p>}
    </div>
  );
}

/**
 * کلید «کپی نتیجه» — عمومی برای تمام ابزارهای مبتنی بر shell. مقدار سرتیتر
 * (و در صورت وجود واحد) را در حافظهٔ موقت می‌گذارد و بازخورد کوتاه «کپی شد»
 * نشان می‌دهد. فقط زمانی نمایش داده می‌شود که نتیجه‌ای وجود داشته باشد.
 */
export function CopyButton({
  accent,
  text,
  className = '',
}: {
  accent: string;
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };
  return (
    <button
      onClick={onCopy}
      aria-label="کپی نتیجه"
      title="کپی نتیجه"
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black font-display transition-all ${className}`}
      style={{
        background: `rgba(${accent}, ${copied ? 0.15 : 0.08})`,
        color: `rgb(${accent})`,
        border: `1px solid rgba(${accent}, 0.2)`,
      }}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" /> کپی شد
        </>
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export function EmptyState({ accent, icon, children }: { accent: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center min-h-[280px] gap-4"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `rgba(${accent}, 0.10)`, color: `rgb(${accent})` }}
      >
        {icon}
      </div>
      <p className="text-muted-foreground font-display text-sm leading-relaxed">{children}</p>
    </motion.div>
  );
}

export function ErrorState({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center min-h-[280px] gap-3 text-destructive"
    >
      <AlertTriangle className="w-8 h-8" />
      <span className="font-bold text-sm leading-relaxed">{children}</span>
    </motion.div>
  );
}

export function Notice({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 text-xs font-display rounded-xl p-3 leading-relaxed"
      style={{ background: `rgba(${accent}, 0.08)`, color: `rgb(${accent})` }}
    >
      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export { AnimatePresence, motion };

/* ───────────── share ───────────── */

export function useShareResult() {
  const [copied, setCopied] = useState(false);
  const share = async ({
    title,
    text,
    params,
  }: {
    title: string;
    text: string;
    params?: Record<string, string>;
  }) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = params ? `${base}?${new URLSearchParams(params).toString()}` : base;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* dismissed — ignore */
    }
  };
  return { share, copied };
}

export function ShareButton({
  accent,
  copied,
  onClick,
}: {
  accent: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="اشتراک‌گذاری نتیجه"
      className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display transition-all"
      style={{
        background: `rgba(${accent}, ${copied ? 0.15 : 0.1})`,
        color: `rgb(${accent})`,
        border: `1px solid rgba(${accent}, 0.25)`,
      }}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" /> کپی شد
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" /> اشتراک‌گذاری نتیجه
        </>
      )}
    </button>
  );
}

/* ───────────── print / PDF ───────────── */

export function PrintButton({ accent }: { accent: string }) {
  return (
    <button
      onClick={() => window.print()}
      aria-label="چاپ یا ذخیره به‌صورت PDF"
      className="no-print w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display transition-all"
      style={{
        background: `rgba(${accent}, 0.1)`,
        color: `rgb(${accent})`,
        border: `1px solid rgba(${accent}, 0.25)`,
      }}
    >
      <Printer className="w-4 h-4" /> خروجی PDF / چاپ
    </button>
  );
}

/* ───────────── history (localStorage) ───────────── */

export interface ToolHistoryEntry {
  id: number;
  at: number;
  label: string; // human-readable input summary
  result: string; // human-readable result
  params?: Record<string, string>; // to rebuild the calculation via URL
}

// Module-level cache so useSyncExternalStore returns a STABLE reference per key
// (re-parsing localStorage on every render would loop). Keyed by storage key.
const EMPTY_HISTORY: ToolHistoryEntry[] = [];
const historyCache: Record<string, { raw: string | null; parsed: ToolHistoryEntry[] }> = {};
const historyListeners: Record<string, Set<() => void>> = {};

function readHistory(key: string): ToolHistoryEntry[] {
  let raw: string | null = null;
  try {
    raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    raw = null;
  }
  const cached = historyCache[key];
  if (cached && cached.raw === raw) return cached.parsed;
  let parsed: ToolHistoryEntry[] = [];
  try {
    parsed = raw ? JSON.parse(raw) : [];
  } catch {
    parsed = [];
  }
  historyCache[key] = { raw, parsed };
  return parsed;
}

function writeHistory(key: string, entries: ToolHistoryEntry[]) {
  const raw = JSON.stringify(entries);
  try {
    localStorage.setItem(key, raw);
  } catch {
    /* private mode / disabled storage */
  }
  historyCache[key] = { raw, parsed: entries }; // keep reference identity
  historyListeners[key]?.forEach((l) => l());
}

export function useToolHistory(toolKey: string, limit = 5) {
  const key = `tool-history:${toolKey}`;

  const subscribe = useCallback(
    (cb: () => void) => {
      (historyListeners[key] ||= new Set()).add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) cb();
      };
      window.addEventListener('storage', onStorage);
      return () => {
        historyListeners[key]?.delete(cb);
        window.removeEventListener('storage', onStorage);
      };
    },
    [key],
  );

  const entries = useSyncExternalStore(
    subscribe,
    () => readHistory(key),
    () => EMPTY_HISTORY,
  );

  const add = useCallback(
    (entry: Omit<ToolHistoryEntry, 'id' | 'at'>) => {
      const stamp = Date.now();
      const next = [{ ...entry, id: stamp, at: stamp }, ...readHistory(key)].slice(0, limit);
      writeHistory(key, next);
    },
    [key, limit],
  );

  const clear = useCallback(() => writeHistory(key, []), [key]);

  return { entries, add, clear };
}

export function HistoryPanel({
  entries,
  onClear,
  onSelect,
}: {
  entries: ToolHistoryEntry[];
  onClear: () => void;
  onSelect?: (entry: ToolHistoryEntry) => void;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="no-print mt-8 rounded-[1.75rem] border border-border bg-card/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-black font-display text-foreground">
          <HistoryIcon className="w-4 h-4 text-primary" /> محاسبات اخیر
        </h3>
        <button
          onClick={onClear}
          aria-label="پاک‌کردن تاریخچه"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors font-display"
        >
          <Trash2 className="w-3.5 h-3.5" /> پاک‌کردن
        </button>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => onSelect?.(e)}
              className="w-full text-right flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 hover:border-primary/40 transition-colors"
            >
              <span className="text-xs text-muted-foreground font-display truncate">{e.label}</span>
              <span className="text-xs font-bold font-display shrink-0">{e.result}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-[1.75rem] bg-card border border-border space-y-3 text-right">
      <div className="flex items-center justify-start gap-3 text-primary font-bold font-display text-sm">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
        <span>{title}</span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    </div>
  );
}
