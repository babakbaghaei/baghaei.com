'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Cake, CalendarHeart, Gift, Hourglass } from 'lucide-react';
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
} from 'date-fns';
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
} from '@/components/tools/DatePicker';

const ACCENT = '244, 63, 94'; // rose — matches the «سرگرمی» category

// getDay(): 0=Sunday … 6=Saturday
const WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

export default function MohasebeSen() {
  const [birthP, setBirthP] = useState<PDate | null>(null);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = p.get('y');
    const m = p.get('m');
    const d = p.get('d');
    if (y && m && d && /^\d+$/.test(y) && /^\d+$/.test(m) && /^\d+$/.test(d)) {
      setBirthP(pdateFromGregorian(Number(y), Number(m), Number(d)));
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const birth = useMemo(() => {
    if (!birthP) return null;
    const d = pdateToDate(birthP);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  }, [birthP]);

  const calc = useMemo(() => {
    if (!birth) return { empty: true } as const;
    const now = new Date();
    if (birth.getTime() > now.getTime()) return { empty: false, future: true } as const;

    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, addYears(birth, years));
    const days = differenceInDays(now, addMonths(addYears(birth, years), months));
    const totalDays = differenceInDays(now, birth);

    let nextB = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(), 12, 0, 0);
    if (nextB.getTime() < now.getTime()) {
      nextB = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate(), 12, 0, 0);
    }
    const daysToNext = differenceInDays(nextB, now);

    return {
      empty: false as const,
      future: false as const,
      years,
      months,
      days,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      daysToNext,
      weekday: WEEKDAYS[birth.getDay()],
    };
  }, [birth]);

  const valid = !calc.empty && !calc.future;

  const onShare = () => {
    if (!valid || !birthP) return;
    share({
      title: 'محاسبه‌گر سن',
      text: `سن من ${faNum(String(calc.years))} سال و ${faNum(String(calc.months))} ماه و ${faNum(String(calc.days))} روز است.`,
      params: { y: String(birthP.gy), m: String(birthP.gm), d: String(birthP.gd) },
    });
  };

  return (
    <ToolShell
      title="محاسبه‌گر سن"
      subtitle="سن دقیق خود را به سال، ماه و روز بیابید و تا تولد بعدی را بشمارید"
      icon={Cake}
      accent={ACCENT}
      info={[
        {
          icon: <CalendarHeart className="w-4 h-4" />,
          title: 'محاسبه بر مبنای تقویم',
          body: 'تاریخ تولد را به شمسی وارد کنید؛ سن شما (که مستقل از نوع تقویم است) با دقت روز محاسبه می‌شود.',
        },
        {
          icon: <Gift className="w-4 h-4" />,
          title: 'تولد بعدی',
          body: 'تعداد روزهای باقی‌مانده تا تولد بعدی شما به‌صورت خودکار شمارش می‌شود.',
        },
        {
          icon: <Hourglass className="w-4 h-4" />,
          title: 'عمر به روز و هفته',
          body: 'علاوه بر سن، مجموع روزها و هفته‌هایی که زندگی کرده‌اید نیز نمایش داده می‌شود.',
        },
      ]}
      disclaimer="محاسبه بر اساس تاریخ امروز انجام می‌شود و صرفاً جنبهٔ اطلاع‌رسانی دارد."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <Field label="تاریخ تولد">
            <PersianDatePicker
              value={birthP}
              onChange={(p) => setBirthP(p)}
              placeholder="تاریخ تولد را انتخاب کنید"
              clearable
              onClear={() => setBirthP(null)}
              ariaLabel="تاریخ تولد"
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {calc.empty ? (
              <EmptyState accent={ACCENT} icon={<Cake className="w-6 h-6" />}>
                برای محاسبهٔ سن، تاریخ تولد خود را انتخاب کنید.
              </EmptyState>
            ) : calc.future ? (
              <EmptyState accent={ACCENT} icon={<Cake className="w-6 h-6" />}>
                تاریخ تولد نمی‌تواند در آینده باشد. لطفاً تاریخ معتبری انتخاب کنید.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="سن شما"
                  value={`${faNum(String(calc.years))} سال`}
                  sub={`${faNum(String(calc.months))} ماه و ${faNum(String(calc.days))} روز`}
                />
                <div className="space-y-2.5">
                  <Row label="روز هفتهٔ تولد" value={calc.weekday} />
                  <Row label="مجموع روزهای زندگی" value={`${faNum(calc.totalDays.toLocaleString('en-US'))} روز`} />
                  <Row label="مجموع هفته‌ها" value={`${faNum(calc.totalWeeks.toLocaleString('en-US'))} هفته`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="تا تولد بعدی" value={`${faNum(String(calc.daysToNext))} روز`} strong />
                </div>
                <Notice accent={ACCENT}>
                  سن یک فرد مستقل از نوع تقویم است؛ این ابزار تاریخ شمسی شما را برای محاسبه به میلادی تبدیل می‌کند.
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
