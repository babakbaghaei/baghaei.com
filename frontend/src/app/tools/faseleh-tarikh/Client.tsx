'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { CalendarRange, CalendarDays, Clock, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Field,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  useShareResult,
  PrintButton,
  AnimatePresence,
  motion,
  faNum,
} from '@/components/tools/shell';
import {
  PersianDatePicker,
  type PDate,
  pdateFromGregorian,
  pdateToDate,
  formatPDate,
} from '@/components/tools/DatePicker';

const ACCENT = '124, 58, 237'; // violet — matches the «تاریخ و زمان» accent

const MS_PER_DAY = 86400000;

// calendar-correct years/months/days breakdown between two shamsi dates.
// always non-negative: caller passes the earlier date as `a`.
const breakdown = (a: PDate, b: PDate) => {
  let years = b.jy - a.jy;
  let months = b.jm - a.jm;
  let days = b.jd - a.jd;

  if (days < 0) {
    months -= 1;
    // borrow the length of the month preceding b's month.
    let pm = b.jm - 1;
    let py = b.jy;
    if (pm < 1) {
      pm = 12;
      py -= 1;
    }
    // jalaali month lengths: months 1-6 = 31, 7-11 = 30, 12 = 29/30.
    const isLeap = (jy: number) => {
      // approximate via gregorian round-trip length using the picker's own dates is overkill;
      // use the standard 33-year jalaali leap cycle remainder rule.
      const breaks = [
        -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
        2192, 2262, 2324, 2394, 2456, 3178,
      ];
      let jp = breaks[0];
      let jump = 0;
      for (let i = 1; i < breaks.length; i++) {
        const jm = breaks[i];
        jump = jm - jp;
        if (jy < jm) break;
        jp = jm;
      }
      let n = jy - jp;
      if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
      let leap = ((((n + 1) % 33) - 1) % 4);
      if (leap === -1) leap = 4;
      return leap === 0;
    };
    const monthLen = pm <= 6 ? 31 : pm <= 11 ? 30 : isLeap(py) ? 30 : 29;
    days += monthLen;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

export default function FaselehTarikh() {
  const [date1, setDate1] = useState<PDate | null>(null);
  const [date2, setDate2] = useState<PDate | null>(null);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const readDate = (gk: string): PDate | null => {
      const raw = p.get(gk);
      if (!raw) return null;
      const m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!m) return null;
      const gy = Number(m[1]);
      const gm = Number(m[2]);
      const gd = Number(m[3]);
      if (gm < 1 || gm > 12 || gd < 1 || gd > 31) return null;
      try {
        return pdateFromGregorian(gy, gm, gd);
      } catch {
        return null;
      }
    };
    const a = readDate('g1');
    const b = readDate('g2');
    if (a) setDate1(a);
    if (b) setDate2(b);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const calc = useMemo(() => {
    if (!date1 || !date2) return null;
    const t1 = pdateToDate(date1).getTime();
    const t2 = pdateToDate(date2).getTime();
    // order the pair so the breakdown is always non-negative.
    const [a, b] = t1 <= t2 ? [date1, date2] : [date2, date1];
    const totalDays = Math.round((Math.max(t1, t2) - Math.min(t1, t2)) / MS_PER_DAY);
    const { years, months, days } = breakdown(a, b);
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    return { totalDays, years, months, days, weeks, remDays, same: totalDays === 0 };
  }, [date1, date2]);

  const yearsLabel = () => {
    if (!calc) return 'صفر روز';
    return (
      [
        calc.years ? `${faNum(String(calc.years))} سال` : '',
        calc.months ? `${faNum(String(calc.months))} ماه` : '',
        calc.days ? `${faNum(String(calc.days))} روز` : '',
      ]
        .filter(Boolean)
        .join(' و ') || 'صفر روز'
    );
  };

  const gParam = (p: PDate) =>
    `${p.gy}-${String(p.gm).padStart(2, '0')}-${String(p.gd).padStart(2, '0')}`;

  const onShare = () => {
    if (!calc || !date1 || !date2) return;
    share({
      title: 'فاصلهٔ بین دو تاریخ',
      text: `فاصلهٔ بین این دو تاریخ ${faNum(calc.totalDays.toLocaleString('en-US'))} روز (${yearsLabel()}) است.`,
      params: {
        g1: gParam(date1),
        g2: gParam(date2),
      },
    });
  };

  return (
    <ToolShell
      title="فاصلهٔ بین دو تاریخ"
      subtitle="تعداد روز، هفته، ماه و سال میان دو تاریخ شمسی را محاسبه کنید"
      icon={CalendarRange}
      accent={ACCENT}
      info={[
        {
          icon: <CalendarDays className="w-4 h-4" />,
          title: 'تقویم شمسی',
          body: 'تاریخ‌ها را با تقویم شمسی انتخاب کنید؛ فاصلهٔ زمانی مستقل از نوع تقویم است و دقیق محاسبه می‌شود.',
        },
        {
          icon: <Clock className="w-4 h-4" />,
          title: 'تفکیک سال، ماه و روز',
          body: 'علاوه بر مجموع روزها، فاصله به‌صورت سال، ماه و روز و نیز تعداد هفته‌ها نمایش داده می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'محاسبهٔ آفلاین',
          body: 'تمام محاسبات روی دستگاه شما و بدون ارسال داده انجام می‌شود؛ ترتیب دو تاریخ مهم نیست.',
        },
      ]}
      disclaimer="مجموع روزها مستقل از نوع تقویم است؛ سال کبیسه‌ها به‌صورت خودکار در نظر گرفته می‌شوند."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <div className="space-y-3">
            <p className="text-foreground font-bold font-display text-sm">تاریخ اول</p>
            <Field label="تاریخ">
              <PersianDatePicker
                value={date1}
                onChange={(p) => setDate1(p)}
                placeholder="تاریخ اول را انتخاب کنید"
                clearable
                onClear={() => setDate1(null)}
                ariaLabel="تاریخ اول"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <p className="text-foreground font-bold font-display text-sm">تاریخ دوم</p>
            <Field label="تاریخ">
              <PersianDatePicker
                value={date2}
                onChange={(p) => setDate2(p)}
                placeholder="تاریخ دوم را انتخاب کنید"
                clearable
                onClear={() => setDate2(null)}
                ariaLabel="تاریخ دوم"
              />
            </Field>
          </div>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<CalendarRange className="w-6 h-6" />}>
                هر دو تاریخ را انتخاب کنید تا فاصلهٔ میان آن‌ها محاسبه شود.
              </EmptyState>
            ) : calc.same ? (
              <EmptyState accent={ACCENT} icon={<CalendarRange className="w-6 h-6" />}>
                دو تاریخ یکسان هستند. تاریخ‌های متفاوتی انتخاب کنید تا فاصله محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="مجموع فاصله"
                  value={`${faNum(calc.totalDays.toLocaleString('en-US'))} روز`}
                  sub={yearsLabel()}
                />
                <div className="space-y-2.5">
                  <Row label="از تاریخ" value={formatPDate(date1)} />
                  <Row label="تا تاریخ" value={formatPDate(date2)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="سال، ماه و روز" value={yearsLabel()} />
                  <Row
                    label="بر حسب هفته"
                    value={
                      calc.remDays
                        ? `${faNum(calc.weeks.toLocaleString('en-US'))} هفته و ${faNum(String(calc.remDays))} روز`
                        : `${faNum(calc.weeks.toLocaleString('en-US'))} هفته`
                    }
                  />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="مجموع روزها" value={`${faNum(calc.totalDays.toLocaleString('en-US'))} روز`} strong />
                </div>
                <Notice accent={ACCENT}>
                  ترتیب وارد کردن تاریخ‌ها اهمیتی ندارد؛ فاصله همیشه به‌صورت مثبت محاسبه می‌شود و سال‌های کبیسه لحاظ می‌شوند.
                </Notice>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
                  <PrintButton accent={ACCENT} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
