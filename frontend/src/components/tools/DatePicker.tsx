'use client';

/**
 * انتخابگر تاریخ شمسی یکدست برای همهٔ ابزارها.
 *
 * چرا: پیش از این برخی ابزارها از <input type="date"> (میلادی و وابسته به مرورگر)
 * و برخی از سه فیلد دستی روز/ماه/سال استفاده می‌کردند — ناهماهنگ و غیرفارسی.
 * این مؤلفه یک تقویم شمسی (جلالی) پاپ‌اوری با ماه و ارقام فارسی، چیدمان راست‌به‌چپ
 * و ظاهر شیشه‌ای هم‌سبک بقیهٔ ابزارها ارائه می‌دهد و مقدار را به‌صورت یک شیء واحد
 * (هم شمسی، هم میلادی، هم Date) برمی‌گرداند تا هر ابزار بدون دردسر از آن استفاده کند.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toJalaali, toGregorian, jalaaliMonthLength } from 'jalaali-js';
import { toPersianDigits } from '@/lib/utils/format';

/* ───────────── انواع و کمک‌ها ───────────── */

/** تاریخ کامل با هر سه نمایش؛ jy/jm/jd شمسی و gy/gm/gd میلادی (۱-مبنا). */
export interface PDate {
  jy: number;
  jm: number;
  jd: number;
  gy: number;
  gm: number;
  gd: number;
}

export const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

// هفتهٔ ایرانی از شنبه آغاز می‌شود.
const WEEKDAYS_FA = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const faNum = toPersianDigits;

/** ساخت PDate از تاریخ شمسی. */
export function pdateFromJalali(jy: number, jm: number, jd: number): PDate {
  const g = toGregorian(jy, jm, jd);
  return { jy, jm, jd, gy: g.gy, gm: g.gm, gd: g.gd };
}

/** ساخت PDate از تاریخ میلادی. */
export function pdateFromGregorian(gy: number, gm: number, gd: number): PDate {
  const j = toJalaali(gy, gm, gd);
  return { jy: j.jy, jm: j.jm, jd: j.jd, gy, gm, gd };
}

/** PDate از یک شیء Date (بر پایهٔ تاریخ محلی). */
export function pdateFromDate(d: Date): PDate {
  return pdateFromGregorian(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** Date محلی در نیمه‌شب از یک PDate. */
export function pdateToDate(p: PDate): Date {
  return new Date(p.gy, p.gm - 1, p.gd);
}

/** «۱۵ خرداد ۱۴۰۳» */
export function formatPDate(p: PDate | null): string {
  if (!p) return '';
  return `${faNum(String(p.jd))} ${JALALI_MONTHS[p.jm - 1]} ${faNum(String(p.jy))}`;
}

/** امروز به‌صورت PDate (فقط سمت کلاینت معنا دارد). */
export function todayPDate(): PDate {
  return pdateFromDate(new Date());
}

/** اندیس هفتهٔ ایرانی (۰=شنبه) برای یک تاریخ میلادی. */
function persianWeekday(gy: number, gm: number, gd: number): number {
  return (new Date(gy, gm - 1, gd).getDay() + 1) % 7;
}

/* ───────────── مؤلفهٔ تقویم ───────────── */

export interface PersianDatePickerProps {
  value: PDate | null;
  onChange: (p: PDate) => void;
  placeholder?: string;
  /** کوچک‌ترین سال شمسی قابل انتخاب در فهرست سال (پیش‌فرض ۱۳۰۰). */
  minYear?: number;
  /** بزرگ‌ترین سال شمسی قابل انتخاب (پیش‌فرض سال جاری + ۵). */
  maxYear?: number;
  /** اجازهٔ پاک‌کردن مقدار. */
  clearable?: boolean;
  onClear?: () => void;
  ariaLabel?: string;
  id?: string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  minYear = 1300,
  maxYear,
  clearable = true,
  onClear,
  ariaLabel = 'انتخاب تاریخ شمسی',
  id,
}: PersianDatePickerProps) {
  const [open, setOpen] = useState(false);
  // ماه و سالی که گرید روی آن باز است (مستقل از مقدار انتخاب‌شده).
  const [view, setView] = useState<{ jy: number; jm: number }>(() => {
    const base = value ?? todayPDate();
    return { jy: base.jy, jm: base.jm };
  });
  const ref = useRef<HTMLDivElement>(null);

  // وقتی مقدار از بیرون عوض شد، نمای تقویم را با آن هم‌گام کن (همگام‌سازی با prop).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (value) setView({ jy: value.jy, jm: value.jm });
  }, [value?.jy, value?.jm]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  // بستن با کلیک بیرون یا Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const resolvedMaxYear = maxYear ?? todayPDate().jy + 5;

  const grid = useMemo(() => {
    const len = jalaaliMonthLength(view.jy, view.jm);
    const first = pdateFromJalali(view.jy, view.jm, 1);
    const lead = persianWeekday(first.gy, first.gm, first.gd);
    const cells: (number | null)[] = [];
    for (let i = 0; i < lead; i += 1) cells.push(null);
    for (let d = 1; d <= len; d += 1) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view.jy, view.jm]);

  const today = useMemo(() => todayPDate(), []);

  const stepMonth = (dir: 1 | -1) => {
    setView((v) => {
      let jm = v.jm + dir;
      let jy = v.jy;
      if (jm > 12) {
        jm = 1;
        jy += 1;
      } else if (jm < 1) {
        jm = 12;
        jy -= 1;
      }
      return { jy: Math.min(resolvedMaxYear, Math.max(minYear, jy)), jm };
    });
  };

  const pick = (d: number) => {
    onChange(pdateFromJalali(view.jy, view.jm, d));
    setOpen(false);
  };

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = resolvedMaxYear; y >= minYear; y -= 1) arr.push(y);
    return arr;
  }, [minYear, resolvedMaxYear]);

  const isSelected = (d: number) =>
    !!value && value.jy === view.jy && value.jm === view.jm && value.jd === d;
  const isToday = (d: number) =>
    today.jy === view.jy && today.jm === view.jm && today.jd === d;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-full flex items-center justify-between gap-2 bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-base focus:border-primary outline-none transition-all min-h-[52px]"
      >
        <span className={value ? 'text-foreground font-bold' : 'text-muted-foreground/60'}>
          {value ? formatPDate(value) : placeholder}
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          {clearable && value && (
            <span
              role="button"
              tabIndex={0}
              aria-label="پاک کردن تاریخ"
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <Calendar className="w-4 h-4 text-muted-foreground/70" aria-hidden />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          dir="rtl"
          className="absolute z-50 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl p-4 right-0"
        >
          {/* سرتیتر: ناوبری ماه + انتخاب ماه و سال */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              aria-label="ماه قبل"
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={view.jm}
                onChange={(e) => setView((v) => ({ ...v, jm: Number(e.target.value) }))}
                aria-label="ماه"
                className="bg-muted/40 border border-border rounded-lg py-1.5 px-2 text-sm font-display font-bold outline-none focus:border-primary cursor-pointer appearance-none text-center"
              >
                {JALALI_MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={view.jy}
                onChange={(e) => setView((v) => ({ ...v, jy: Number(e.target.value) }))}
                aria-label="سال"
                className="bg-muted/40 border border-border rounded-lg py-1.5 px-2 text-sm font-display font-bold outline-none focus:border-primary cursor-pointer appearance-none text-center"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {faNum(String(y))}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => stepMonth(1)}
              aria-label="ماه بعد"
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* روزهای هفته */}
          <div className="grid grid-cols-7 mb-1.5">
            {WEEKDAYS_FA.map((w, i) => (
              <span
                key={i}
                className="text-center text-[11px] font-black text-muted-foreground/70 py-1"
              >
                {w}
              </span>
            ))}
          </div>

          {/* روزها */}
          <div className="grid grid-cols-7 gap-0.5">
            {grid.map((d, i) => {
              if (d === null) return <span key={i} aria-hidden />;
              const selected = isSelected(d);
              const tdy = isToday(d);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(d)}
                  aria-label={`${faNum(String(d))} ${JALALI_MONTHS[view.jm - 1]} ${faNum(String(view.jy))}`}
                  aria-pressed={selected}
                  className={`h-9 rounded-lg text-sm font-display font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    selected
                      ? 'bg-primary text-primary-foreground'
                      : tdy
                        ? 'text-primary ring-1 ring-primary/40 hover:bg-muted'
                        : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {faNum(String(d))}
                </button>
              );
            })}
          </div>

          {/* میان‌بر امروز */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => {
                const t = todayPDate();
                onChange(t);
                setOpen(false);
              }}
              className="text-xs font-black font-display text-primary hover:underline"
            >
              امروز
            </button>
            <span className="text-[11px] text-muted-foreground/70 font-display">
              {value ? formatPDate(value) : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── ورودی ساعت (برای ابزارهای زمان‌محور) ───────────── */

/** دو فیلد ساعت و دقیقه با ارقام فارسی؛ مقدار ۲۴ساعته. */
export function TimeField({
  hour,
  minute,
  onChange,
  ariaLabel = 'ساعت',
}: {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
  ariaLabel?: string;
}) {
  const clampH = (v: number) => Math.max(0, Math.min(23, v || 0));
  const clampM = (v: number) => Math.max(0, Math.min(59, v || 0));
  const pad = (n: number) => faNum(String(n).padStart(2, '0'));
  return (
    <div
      className="flex items-center justify-center gap-2 bg-background border-2 border-border rounded-xl py-2.5 px-4"
      dir="ltr"
      aria-label={ariaLabel}
    >
      <input
        type="text"
        inputMode="numeric"
        value={pad(hour)}
        onChange={(e) => {
          const v = e.target.value.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]).replace(/[^\d]/g, '');
          onChange(clampH(Number(v.slice(-2))), minute);
        }}
        aria-label="ساعت"
        className="w-10 bg-transparent text-center font-display text-lg font-bold outline-none"
      />
      <span className="text-lg font-bold text-muted-foreground">:</span>
      <input
        type="text"
        inputMode="numeric"
        value={pad(minute)}
        onChange={(e) => {
          const v = e.target.value.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]).replace(/[^\d]/g, '');
          onChange(hour, clampM(Number(v.slice(-2))));
        }}
        aria-label="دقیقه"
        className="w-10 bg-transparent text-center font-display text-lg font-bold outline-none"
      />
    </div>
  );
}
