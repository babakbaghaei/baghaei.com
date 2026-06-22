'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Gift, CalendarRange, Wallet } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Field,
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
  fmtMoney,
  toWords,
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { MIN_WAGE, MIN_WAGE_LATEST_YEAR } from '@/lib/data/legal-rates';

const ACCENT = '217, 119, 6'; // amber
const YEARS = Object.keys(MIN_WAGE).map(Number).sort((a, b) => b - a);

export default function EidiSanavat() {
  const [salary, setSalary] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [months, setMonths] = useState('12');
  const [year, setYear] = useState(String(MIN_WAGE_LATEST_YEAR));

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get('salary');
    if (s && /^\d+$/.test(s)) setSalary(Number(s).toLocaleString('en-US'));
    const m = p.get('months');
    if (m && /^\d+$/.test(m)) setMonths(m);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const y = p.get('year');
    if (y && MIN_WAGE[Number(y)]) setYear(y);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const base = cleanNum(salary);
  const m = Math.min(Math.max(Number(normalizeDigits(months)) || 0, 0), 12);
  const u = unitLabel(unit);

  const calc = useMemo(() => {
    if (base <= 0 || m <= 0) return null;
    const minMonthlyRial = MIN_WAGE[Number(year)]?.monthlyBase ?? MIN_WAGE[MIN_WAGE_LATEST_YEAR].monthlyBase;
    const minMonthly = unit === 'toman' ? minMonthlyRial / 10 : minMonthlyRial;

    // عیدی: ۲ ماه مزد، با سقف ۳ برابر حداقل حقوق ماهانه؛ نسبت به ماه‌های کارکرد.
    const eidiFull = Math.min(2 * base, 3 * minMonthly);
    const eidi = Math.round((eidiFull * m) / 12);
    // سنوات/پایان کار: یک ماه مزد به ازای هر سال (نسبت به ماه‌های کارکرد).
    const sanavat = Math.round((base * m) / 12);
    const capped = 2 * base > 3 * minMonthly;
    return { eidi, sanavat, total: eidi + sanavat, capped, minMonthly: Math.round(minMonthly) };
  }, [base, m, unit, year]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبهٔ عیدی و سنوات',
      text: `عیدی: ${fmtMoney(calc.eidi)} ${u} · سنوات: ${fmtMoney(calc.sanavat)} ${u} · مجموع: ${fmtMoney(calc.total)} ${u}`,
      params: { salary: String(base), months: String(m), unit, year },
    });
  };

  return (
    <ToolShell
      title="محاسبهٔ عیدی و سنوات پایان سال"
      subtitle="برآورد عیدی و حق سنوات (پایان کار) بر اساس قانون کار و حداقل دستمزد مصوب"
      icon={Gift}
      accent={ACCENT}
      info={[
        {
          icon: <Gift className="w-4 h-4" />,
          title: 'عیدی و پاداش',
          body: 'طبق قانون، عیدی برابر ۲ ماه آخرین مزد است، مشروط بر اینکه از ۳ برابر حداقل حقوق ماهانه بیشتر نشود (سقف عیدی).',
        },
        {
          icon: <CalendarRange className="w-4 h-4" />,
          title: 'سنوات (پایان کار)',
          body: 'حق سنوات برابر یک ماه آخرین مزد به ازای هر سال کار است و برای کارکرد کمتر از یک سال، به‌نسبت محاسبه می‌شود.',
        },
        {
          icon: <Wallet className="w-4 h-4" />,
          title: 'حداقل حقوق مبنا',
          body: `سقف عیدی بر پایهٔ حداقل حقوق ماهانهٔ مصوب شورای عالی کار محاسبه می‌شود (سال ${faNum(String(MIN_WAGE_LATEST_YEAR))}).`,
        },
      ]}
      disclaimer="این برآورد بر پایهٔ مزد ثابت/مبنا است؛ مبالغ قطعی به مزایای مستمر، توافق و آخرین بخشنامه‌های وزارت کار بستگی دارد."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField label="حقوق پایهٔ ماهانه (مزد مبنا)" amount={salary} setAmount={setSalary} unit={unit} setUnit={setUnit} />

          <Field label="ماه‌های کارکرد (در یک سال)" hint="عددی بین ۱ تا ۱۲">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(months)}
              onChange={(e) => setMonths(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="ماه‌های کارکرد"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>

          <SelectField label="سال مبنا" value={year} onChange={setYear}>
            {YEARS.map((y) => (
              <option key={y} value={y}>{faNum(String(y))}</option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Gift className="w-6 h-6" />}>
                حقوق پایه و ماه‌های کارکرد را وارد کنید تا عیدی و سنوات محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="مجموع عیدی و سنوات"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="عیدی و پاداش" value={`${fmtMoney(calc.eidi)} ${u}`} strong />
                  <Row label="سنوات (پایان کار)" value={`${fmtMoney(calc.sanavat)} ${u}`} strong />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ماه‌های کارکرد" value={`${faNum(String(m))} ماه`} />
                  <Row label="حداقل حقوق ماهانهٔ مبنا" value={`${fmtMoney(calc.minMonthly)} ${u}`} />
                </div>
                <Notice accent={ACCENT}>
                  {calc.capped
                    ? 'عیدی شما به سقف قانونی (۳ برابر حداقل حقوق) رسیده است.'
                    : 'عیدی شما برابر ۲ ماه حقوق پایه (زیر سقف قانونی) محاسبه شد.'}
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
