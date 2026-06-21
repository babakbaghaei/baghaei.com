'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Cake, CalendarHeart, Gift, Hourglass, Info } from 'lucide-react';
import { toGregorian, toJalaali, jalaaliMonthLength } from 'jalaali-js';
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
  SelectField,
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

const ACCENT = '244, 63, 94'; // rose — matches the «سرگرمی» category

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];
// getDay(): 0=Sunday … 6=Saturday
const WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

const todayJ = toJalaali(new Date());
const YEARS = Array.from({ length: todayJ.jy - 1299 }, (_, i) => todayJ.jy - i); // current → 1300

export default function MohasebeSen() {
  const [jy, setJy] = useState(String(todayJ.jy - 30));
  const [jm, setJm] = useState('1');
  const [jd, setJd] = useState('1');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = p.get('y');
    const m = p.get('m');
    const d = p.get('d');
    if (y && /^\d+$/.test(y)) setJy(y);
    if (m && /^\d+$/.test(m)) setJm(m);
    if (d && /^\d+$/.test(d)) setJd(d);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const yNum = Number(jy);
  const mNum = Number(jm);
  // Clamp the day to the selected month's length (handles 31/30/29).
  const monthLen = jalaaliMonthLength(yNum, mNum) || 31;
  const dNum = Math.min(Number(jd), monthLen);

  const birth = useMemo(() => {
    const g = toGregorian(yNum, mNum, dNum);
    return new Date(g.gy, g.gm - 1, g.gd, 12, 0, 0);
  }, [yNum, mNum, dNum]);

  const calc = useMemo(() => {
    const now = new Date();
    if (birth.getTime() > now.getTime()) return { future: true } as const;

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

  const valid = !calc.future;

  const onShare = () => {
    if (!valid) return;
    share({
      title: 'محاسبه‌گر سن',
      text: `سن من ${faNum(String(calc.years))} سال و ${faNum(String(calc.months))} ماه و ${faNum(String(calc.days))} روز است.`,
      params: { y: String(yNum), m: String(mNum), d: String(dNum) },
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
          <SelectField label="سال تولد" value={jy} onChange={setJy}>
            {YEARS.map((y) => (
              <option key={y} value={y}>{faNum(String(y))}</option>
            ))}
          </SelectField>
          <SelectField label="ماه تولد" value={jm} onChange={setJm}>
            {MONTHS.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </SelectField>
          <SelectField label="روز تولد" value={jd} onChange={setJd}>
            {Array.from({ length: monthLen }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{faNum(String(d))}</option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {calc.future ? (
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
