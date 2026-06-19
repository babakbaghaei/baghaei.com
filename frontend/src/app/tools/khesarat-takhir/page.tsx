'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  RefreshCcw,
  Info,
  ChevronLeft,
  Gavel,
  CalendarClock,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  Share2,
  Check,
} from 'lucide-react';
import { numToPersian } from '@/lib/utils/num-to-persian';
import { toPersianDigits } from '@/lib/utils/format';
import {
  CPI_YEARS,
  CPI_BASE_YEAR,
  CPI_SOURCE,
  CPI_LAST_YEAR,
  CPI_LAST_COMPLETE_YEAR,
  CPI_LATEST_MONTHLY,
  getAnnualIndex,
  isProvisionalYear,
} from '@/lib/data/cpi-index';

type Unit = 'toman' | 'rial';

const ACCENT = '245, 158, 11'; // amber — اشتراک با رجیستری ابزارها

export default function KhesaratTakhir() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const [dueYear, setDueYear] = useState<number>(1400);
  const [payYear, setPayYear] = useState<number>(CPI_LAST_YEAR);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // restore state from a shared link (?amount&unit&due&pay). Runs after mount
  // (not a lazy initializer) to keep the static SSR markup hydration-safe.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) {
      setAmount(Number(a).toLocaleString('en-US'));
    }
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const d = Number(p.get('due'));
    if (d && CPI_YEARS.includes(d)) setDueYear(d);
    const pa = Number(p.get('pay'));
    if (pa && CPI_YEARS.includes(pa)) setPayYear(pa);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cleanNumber = useMemo(() => Number(amount.replace(/,/g, '')) || 0, [amount]);
  const displayAmount = useMemo(() => toPersianDigits(amount), [amount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
      .replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
      .replace(/[^\d]/g, '');
    if (value.length <= 15) {
      setAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  };

  const clearAll = () => {
    setAmount('');
    inputRef.current?.focus();
  };

  const calc = useMemo(() => {
    if (cleanNumber <= 0) return null;

    const indexDue = getAnnualIndex(dueYear);
    const indexPay = getAnnualIndex(payYear);

    if (indexDue == null || indexPay == null || indexDue <= 0) {
      return { error: 'شاخص این بازه هنوز منتشر نشده است.' as string };
    }
    if (payYear < dueYear) {
      return { error: 'سال پرداخت باید بعد از سال سررسید باشد.' as string };
    }

    const updated = Math.round(cleanNumber * (indexPay / indexDue));
    const penalty = updated - cleanNumber;
    const growthPct = (indexPay / indexDue - 1) * 100;
    const years = payYear - dueYear;
    const provisional = isProvisionalYear(payYear) || isProvisionalYear(dueYear);

    return { indexDue, indexPay, updated, penalty, growthPct, years, provisional };
  }, [cleanNumber, dueYear, payYear]);

  const fmt = (n: number) => toPersianDigits(Math.round(n).toLocaleString('en-US'));
  const fmtPct = (n: number) =>
    toPersianDigits((Math.round(n * 10) / 10).toLocaleString('en-US')) + '٪';
  // adaptive precision: shows more decimals for small index values so old
  // due-years (e.g. ۱۳۴۰ ≈ ۰٫۰۵ with base ۱۳۹۵=۱۰۰) never collapse to «۰».
  const fmtIndex = (n: number) => {
    const maxFrac = n >= 100 ? 1 : n >= 10 ? 2 : n >= 1 ? 3 : 4;
    return toPersianDigits(
      n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxFrac }),
    );
  };
  const unitLabel = unit === 'toman' ? 'تومان' : 'ریال';
  const latest = CPI_LATEST_MONTHLY[CPI_LATEST_MONTHLY.length - 1];

  const handleShare = async () => {
    if (!calc || 'error' in calc) return;
    const params = new URLSearchParams({
      amount: String(cleanNumber),
      unit,
      due: String(dueYear),
      pay: String(payYear),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    const text =
      `خسارت تأخیر تأدیه\n` +
      `اصل بدهی: ${fmt(cleanNumber)} ${unitLabel}\n` +
      `از سال ${toPersianDigits(dueYear)} تا ${toPersianDigits(payYear)}\n` +
      `جمع کل قابل پرداخت: ${fmt(calc.updated)} ${unitLabel}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'محاسبه خسارت تأخیر تأدیه', text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user dismissed share sheet — ignore */
    }
  };

  return (
    <main className="relative overflow-x-hidden px-4 md:px-6 pt-24 pb-28" dir="rtl">
      {/* ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] blur-[140px] rounded-full"
          style={{ background: `rgba(${ACCENT}, 0.07)` }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/5 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* breadcrumb */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-display mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> جعبه ابزار
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `rgba(${ACCENT}, 0.12)`,
              border: `1px solid rgba(${ACCENT}, 0.25)`,
              color: `rgb(${ACCENT})`,
            }}
          >
            <Scale className="w-7 h-7" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black font-display tracking-tight">
              محاسبه خسارت تأخیر تأدیه
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm font-medium mt-1">
              بر اساس ماده ۵۲۲ آیین دادرسی مدنی و رأی وحدت رویه ۸۵۰ (شاخص سالانهٔ بانک مرکزی)
            </p>
          </div>
        </div>

        {/* Calculator: inputs + live verdict */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-6 items-start">
          {/* ── INPUTS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-[2rem] p-6 md:p-9 space-y-9"
          >
            {/* amount */}
            <Field
              label="اصل بدهی"
              action={
                <div className="flex bg-muted p-0.5 rounded-lg border border-border">
                  {(['toman', 'rial'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-3 py-1 rounded-md text-[11px] font-black transition-all ${
                        unit === u ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      {u === 'toman' ? 'تومان' : 'ریال'}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={displayAmount}
                  onChange={handleInputChange}
                  placeholder="۰"
                  dir="ltr"
                  aria-label="اصل بدهی"
                  className="w-full bg-background border-2 border-border rounded-2xl py-5 px-5 pl-14 font-bold font-display text-center focus:border-primary transition-all outline-none text-2xl md:text-4xl placeholder:text-muted/30"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">
                  {unitLabel}
                </span>
                {amount && (
                  <button
                    onClick={clearAll}
                    aria-label="پاک کردن"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted text-muted-foreground transition-all"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
              {cleanNumber > 0 && (
                <p className="text-[11px] text-muted-foreground/70 font-display text-center mt-2">
                  {numToPersian(String(cleanNumber))} {unitLabel}
                </p>
              )}
            </Field>

            {/* years — payment first, due second (swapped) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <YearField
                icon={<Gavel className="w-4 h-4" />}
                label="سال پرداخت"
                hint="سالی که بدهی پرداخت یا حکم صادر می‌شود"
                year={payYear}
                onYear={setPayYear}
                years={CPI_YEARS}
              />
              <YearField
                icon={<CalendarClock className="w-4 h-4" />}
                label="سال سررسید"
                hint="سالی که بدهی باید پرداخت می‌شد"
                year={dueYear}
                onYear={setDueYear}
                years={CPI_YEARS}
              />
            </div>

            <p className="flex items-center gap-2 text-[11px] text-muted-foreground/70 font-display">
              <Info className="w-3.5 h-3.5 shrink-0" />
              مبنا «متوسط شاخص سالانه» است؛ آخرین سال قطعی {toPersianDigits(CPI_LAST_COMPLETE_YEAR)} و سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است.
            </p>
          </motion.div>

          {/* ── VERDICT ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="lg:sticky lg:top-24 rounded-[2rem] border overflow-hidden"
            style={{ borderColor: `rgba(${ACCENT}, 0.25)` }}
          >
            <div
              className="p-6 md:p-9"
              style={{
                background: `linear-gradient(160deg, rgba(${ACCENT}, 0.10), transparent 60%)`,
              }}
            >
              <AnimatePresence mode="wait">
                {!calc ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center min-h-[280px] gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `rgba(${ACCENT}, 0.10)`, color: `rgb(${ACCENT})` }}
                    >
                      <Scale className="w-6 h-6" />
                    </div>
                    <p className="text-muted-foreground font-display text-sm">
                      مبلغ اصل بدهی را وارد کنید تا
                      <br /> خسارت محاسبه شود.
                    </p>
                  </motion.div>
                ) : 'error' in calc ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center min-h-[280px] gap-3 text-destructive"
                  >
                    <AlertTriangle className="w-8 h-8" />
                    <span className="font-bold text-sm">{calc.error}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-7"
                  >
                    {/* headline — TOTAL payable */}
                    <div className="text-center space-y-1.5">
                      <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wide">
                        جمع کل قابل پرداخت
                      </span>
                      <p
                        className="text-3xl md:text-5xl font-black font-display leading-tight break-words"
                        style={{ color: `rgb(${ACCENT})` }}
                      >
                        {fmt(calc.updated)}
                        <span className="text-sm md:text-base text-muted-foreground font-bold mr-2">
                          {unitLabel}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 font-display px-2">
                        {numToPersian(String(calc.updated))} {unitLabel}
                      </p>
                    </div>

                    {/* breakdown: principal + penalty = total */}
                    <div className="space-y-2.5">
                      <Row label="اصل بدهی" value={`${fmt(cleanNumber)} ${unitLabel}`} />
                      <Row
                        label="خسارت تأخیر تأدیه"
                        value={
                          <span style={{ color: `rgb(${ACCENT})` }}>
                            {'+ '}
                            {fmt(calc.penalty)} {unitLabel}
                          </span>
                        }
                        strong
                      />
                      <div className="h-px bg-border/60 my-1" />
                      <Row
                        label="جمع کل قابل پرداخت"
                        value={`${fmt(calc.updated)} ${unitLabel}`}
                        strong
                      />
                    </div>

                    {/* details: everything */}
                    <div className="space-y-2.5 pt-4 border-t border-border/60">
                      <Row
                        label="رشد شاخص قیمت"
                        value={
                          <span className="inline-flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> {fmtPct(calc.growthPct)}
                          </span>
                        }
                      />
                      <Row
                        label="مدت تأخیر"
                        value={
                          calc.years > 0
                            ? `${toPersianDigits(calc.years)} سال`
                            : 'کمتر از یک سال'
                        }
                      />
                      <Row label="شاخص سال سررسید" value={fmtIndex(calc.indexDue)} />
                      <Row label="شاخص سال پرداخت" value={fmtIndex(calc.indexPay)} />
                      <Row
                        label="ضریب روزآمدسازی"
                        value={`× ${toPersianDigits((calc.indexPay / calc.indexDue).toFixed(2))}`}
                      />
                    </div>

                    {/* provisional warning */}
                    {calc.provisional && (
                      <div
                        className="flex items-start gap-2 text-[11px] font-display rounded-xl p-3 leading-relaxed"
                        style={{
                          background: `rgba(${ACCENT}, 0.08)`,
                          color: `rgb(${ACCENT})`,
                        }}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          شاخص سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است (بر پایهٔ آخرین نرخ
                          تورم نقطه‌به‌نقطه)؛ متوسط سالانهٔ قطعی آن هنوز منتشر نشده است.
                        </span>
                      </div>
                    )}

                    {/* share */}
                    <button
                      onClick={handleShare}
                      aria-label="اشتراک‌گذاری نتیجه"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display transition-all"
                      style={{
                        background: copied ? `rgba(${ACCENT}, 0.15)` : `rgba(${ACCENT}, 0.10)`,
                        color: `rgb(${ACCENT})`,
                        border: `1px solid rgba(${ACCENT}, 0.25)`,
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Legal / educational cards */}
        <div className="w-full flex items-center gap-2 mt-12 mb-5">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-black font-display text-foreground">
            قوانین و اطلاعات بیشتر
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoCard icon={<BookOpen className="w-4 h-4" />} title="مبنای قانونی (ماده ۵۲۲)">
            بر اساس ماده ۵۲۲ قانون آیین دادرسی مدنی، چنانچه طلب از نوع وجه رایج باشد و با مطالبهٔ
            داین و تمکن مدیون پرداخت نشود، خسارت تأخیر بر اساس تغییر شاخص قیمت بانک مرکزی محاسبه
            می‌شود.
          </InfoCard>
          <InfoCard icon={<Gavel className="w-4 h-4" />} title="رأی وحدت رویه شماره ۸۵۰">
            طبق رأی وحدت رویه شماره ۸۵۰ هیأت عمومی دیوان عالی کشور (۱۴۰۳/۵/۳۱)، ملاک محاسبهٔ خسارت
            تأخیر تأدیه «متوسط شاخص سالانه» است؛ همان مبنایی که این ابزار به‌کار می‌برد.
          </InfoCard>
          <InfoCard icon={<TrendingUp className="w-4 h-4" />} title="فرمول محاسبه">
            مبلغ روزآمدشده = اصل بدهی × (شاخص سال پرداخت ÷ شاخص سال سررسید). خسارت تأخیر تأدیه برابر
            است با تفاوت مبلغ روزآمدشده و اصل بدهی.
          </InfoCard>
          <InfoCard icon={<Info className="w-4 h-4" />} title="منبع داده‌ها">
            شاخص سالانه از زنجیرهٔ «نرخ تورم سالانهٔ» رسمی {CPI_SOURCE} بازسازی شده است (سال پایه{' '}
            {toPersianDigits(CPI_BASE_YEAR)}=۱۰۰). آخرین نرخ تورم نقطه‌به‌نقطهٔ منتشرشده:{' '}
            {latest.month} {toPersianDigits(latest.year)} برابر {fmtPct(latest.rate)}.
          </InfoCard>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 text-muted-foreground text-xs font-medium bg-muted/40 border border-border rounded-2xl p-5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            این محاسبه صرفاً جنبهٔ راهنما و تخمینی دارد. مبنای قطعی خسارت، نظر کارشناس رسمی و حکم
            دادگاه است. در دعاوی واقعی حتماً با وکیل یا کارشناس رسمی دادگستری مشورت کنید.
          </span>
        </div>

        {/* Offline + back */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="inline-flex items-center gap-2 text-muted-foreground font-medium">
            <Info className="w-4 h-4 text-primary" />
            تمامی محاسبات آفلاین در مرورگر شما انجام می‌شود.
          </span>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-display"
          >
            <ChevronLeft className="w-4 h-4" /> سایر ابزارها
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center min-h-[28px]">
        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {action && <div className="absolute left-0 top-1/2 -translate-y-1/2">{action}</div>}
      </div>
      {children}
    </div>
  );
}

function YearField({
  icon,
  label,
  hint,
  year,
  onYear,
  years,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  year: number;
  onYear: (y: number) => void;
  years: number[];
}) {
  return (
    <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-foreground font-bold font-display text-sm">
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      {hint && (
        <p className="text-[10px] text-muted-foreground/70 font-display leading-relaxed">
          {hint}
        </p>
      )}
      <SelectBox value={year} onChange={onYear} ariaLabel={label}>
        {[...years].reverse().map((y) => (
          <option key={y} value={y}>
            {toPersianDigits(y)}
            {isProvisionalYear(y) ? ' (جاری)' : ''}
          </option>
        ))}
      </SelectBox>
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="w-full bg-background border-2 border-border rounded-xl py-2.5 pr-3 pl-8 font-display text-sm focus:border-primary outline-none transition-all text-foreground appearance-none cursor-pointer text-center"
      >
        {children}
      </select>
      <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground font-display">{label}</span>
      <span
        className={`font-display ${
          strong ? 'text-primary font-black text-sm' : 'text-foreground font-bold text-xs'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-[1.75rem] bg-card border border-border space-y-3 text-right">
      <div className="flex items-center justify-start gap-3 text-primary font-bold font-display text-sm">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <span>{title}</span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    </div>
  );
}
