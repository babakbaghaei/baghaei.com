'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HardHat, CalendarClock, Gift, Palmtree, BookOpen, Info, Wallet } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Stepper,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
  fmtMoney,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { MIN_WAGE, MIN_WAGE_LATEST_YEAR } from '@/lib/data/legal-rates';

const ACCENT = '13, 148, 136'; // teal-600

const MIN_WAGE_YEARS = Object.keys(MIN_WAGE)
  .map(Number)
  .sort((a, b) => b - a);

export default function PayanKar() {
  const [wage, setWage] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [leaveDays, setLeaveDays] = useState(0);
  const [year, setYear] = useState(MIN_WAGE_LATEST_YEAR);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get('wage');
    if (w && /^\d+$/.test(w)) setWage(Number(w).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const y = p.get('years');
    if (y != null && /^\d+$/.test(y)) setYears(Number(y));
    const m = p.get('months');
    if (m != null && /^\d+$/.test(m)) setMonths(Number(m));
    const l = p.get('leave');
    if (l != null && /^\d+$/.test(l)) setLeaveDays(Number(l));
    const yr = Number(p.get('year'));
    if (yr && MIN_WAGE[yr]) setYear(yr);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const clean = cleanNum(wage);
  // حقوق ماهانه به تومان (مبنای محاسبه).
  const monthlyToman = unit === 'toman' ? clean : clean / 10;

  const calc = useMemo(() => {
    if (monthlyToman <= 0) return null;
    const dailyToman = monthlyToman / 30;
    const duration = years + months / 12; // سابقه به سال
    const seniority = monthlyToman * duration; // یک ماه به ازای هر سال

    const minMonthlyToman = MIN_WAGE[year].monthlyBase / 10;
    const annualEidi = Math.min(2 * monthlyToman, 3 * minMonthlyToman);
    const eidiCapped = 2 * monthlyToman > 3 * minMonthlyToman;

    const leavePay = dailyToman * leaveDays;
    const total = seniority + annualEidi + leavePay;

    const out = (n: number) => Math.round(unit === 'toman' ? n : n * 10);
    return {
      seniority: out(seniority),
      annualEidi: out(annualEidi),
      leavePay: out(leavePay),
      total: out(total),
      dailyOut: out(dailyToman),
      duration,
      eidiCapped,
    };
  }, [monthlyToman, years, months, leaveDays, year, unit]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'حقوق و مزایای پایان کار',
      text: `مزایای پایان کار (سنوات + عیدی + مرخصی): ${fmtMoney(calc.total)} ${u}`,
      params: {
        wage: String(clean),
        unit,
        years: String(years),
        months: String(months),
        leave: String(leaveDays),
        year: String(year),
      },
    });
  };

  return (
    <ToolShell
      title="ماشین‌حساب حقوق پایان کار"
      subtitle="محاسبهٔ سنوات (مزایای پایان کار)، عیدی و پاداش و حق مرخصی استفاده‌نشده طبق قانون کار"
      icon={HardHat}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'سنوات (مادهٔ ۲۴ قانون کار)',
          body: 'در پایان کار، کارفرما باید به ازای هر سال سابقه، معادل یک ماه آخرین حقوق را به‌عنوان مزایای پایان کار (سنوات) بپردازد؛ برای کسری از سال نیز به‌نسبت محاسبه می‌شود.',
        },
        {
          icon: <Gift className="w-4 h-4" />,
          title: 'عیدی و پاداش سالانه',
          body: 'طبق قانون، عیدی معادل ۶۰ روز (دو ماه) آخرین مزد است، مشروط بر آنکه از ۹۰ روز (سه برابر) حداقل مزد بیشتر نشود. سقف عیدی سالانه با حداقل مزد همان سال تعیین می‌شود.',
        },
        {
          icon: <Palmtree className="w-4 h-4" />,
          title: 'حق مرخصی استفاده‌نشده',
          body: 'مرخصی استحقاقی سالانهٔ کارگر ۲۶ روز کاری است. روزهای استفاده‌نشده در پایان کار به مأخذ مزد روزانه پرداخت می‌شود (مادهٔ ۷۱ قانون کار).',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'مبنای مزد',
          body: 'مبنای محاسبه «آخرین حقوق/مزد ماهانه» است. بن خواربار، حق مسکن و حق اولاد جزو مزد ثابت محسوب نمی‌شوند مگر در موارد مقرر؛ در صورت لزوم آن‌ها را به مزد بیفزایید.',
        },
      ]}
      disclaimer="این محاسبه راهنماست. مبلغ قطعی تابع قرارداد، عرف کارگاه، آخرین بخشنامهٔ مزد و رأی مراجع حل اختلاف کار است. عیدی برای یک سال کامل محاسبه شده است."
    >
      <TwoPane>
        <Panel className="space-y-6">
          <MoneyField label="آخرین حقوق/مزد ماهانه" amount={wage} setAmount={setWage} unit={unit} setUnit={setUnit} />

          <div className="grid grid-cols-2 gap-3">
            <Stepper label="سابقه (سال)" value={years} onChange={setYears} min={0} max={50} />
            <Stepper label="سابقه (ماه)" value={months} onChange={setMonths} min={0} max={11} />
          </div>

          <Stepper
            label="مرخصی استفاده‌نشده (روز)"
            hint="روزهای مرخصی استحقاقی ذخیره‌شده"
            value={leaveDays}
            onChange={setLeaveDays}
            min={0}
            max={120}
          />

          <SelectField
            icon={<CalendarClock className="w-4 h-4" />}
            label="سال محاسبه (برای سقف عیدی)"
            value={year}
            onChange={(v) => setYear(Number(v))}
          >
            {MIN_WAGE_YEARS.map((y) => (
              <option key={y} value={y}>
                {faNum(y)}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Wallet className="w-6 h-6" />}>
                حقوق ماهانه و سابقهٔ کار را وارد کنید تا مزایای پایان کار محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="جمع مزایای پایان کار"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row
                    label={`سنوات (${faNum(years)} سال و ${faNum(months)} ماه)`}
                    value={`${fmtMoney(calc.seniority)} ${u}`}
                  />
                  <Row label="عیدی و پاداش (یک سال)" value={`${fmtMoney(calc.annualEidi)} ${u}`} />
                  {leaveDays > 0 && (
                    <Row label={`حق مرخصی (${faNum(leaveDays)} روز)`} value={`${fmtMoney(calc.leavePay)} ${u}`} />
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع کل" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                {calc.eidiCapped && (
                  <Notice accent={ACCENT}>
                    عیدی به سقف قانونی (سه برابر حداقل مزد سال {faNum(year)}) محدود شده است.
                  </Notice>
                )}
                <Notice accent={ACCENT}>
                  عیدی برای یک سال کامل محاسبه شده؛ برای کسری از سال به‌نسبت مدت کارکرد کاهش می‌یابد. مزد روزانهٔ مبنا {fmtMoney(calc.dailyOut)} {u} است.
                </Notice>
                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
