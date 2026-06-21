'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PiggyBank, TrendingUp, Percent, CalendarClock, Info } from 'lucide-react';
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
  useToolHistory,
  HistoryPanel,
  type ToolHistoryEntry,
  AnimatePresence,
  motion,
  faNum,
  fmtMoney,
  fmtPct,
  toWords,
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '5, 150, 105'; // emerald-600

const FREQUENCIES: { value: string; label: string; m: number }[] = [
  { value: 'monthly', label: 'ماهانه', m: 12 },
  { value: 'yearly', label: 'سالانه', m: 1 },
  { value: 'daily', label: 'روزانه', m: 365 },
];

export default function SoodSepordeh() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('20');
  const [years, setYears] = useState('1');
  const [freq, setFreq] = useState('monthly');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();
  const { entries, add: addHistory, clear: clearHistory } = useToolHistory('sood-sepordeh');

  const applyParams = (params?: Record<string, string>) => {
    if (!params) return;
    if (params.principal && /^\d+$/.test(params.principal)) setPrincipal(Number(params.principal).toLocaleString('en-US'));
    if (params.rate && /^\d*\.?\d+$/.test(params.rate)) setRate(params.rate);
    if (params.years && /^\d*\.?\d+$/.test(params.years)) setYears(params.years);
    if (params.freq && FREQUENCIES.some((f) => f.value === params.freq)) setFreq(params.freq);
    if (params.unit === 'rial' || params.unit === 'toman') setUnit(params.unit);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pr = p.get('principal');
    if (pr && /^\d+$/.test(pr)) setPrincipal(Number(pr).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const yr = p.get('years');
    if (yr && /^\d*\.?\d+$/.test(yr)) setYears(yr);
    const fr = p.get('freq');
    if (fr && FREQUENCIES.some((f) => f.value === fr)) setFreq(fr);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const principalNum = cleanNum(principal);
  const annualRate = Math.max(0, Number(normalizeDigits(rate)) || 0);
  const t = Math.max(0, Number(normalizeDigits(years)) || 0);
  const m = FREQUENCIES.find((f) => f.value === freq)?.m ?? 12;

  const calc = useMemo(() => {
    if (principalNum <= 0 || t <= 0) return null;
    const r = annualRate / 100;
    // سود ساده
    const simpleInterest = principalNum * r * t;
    const simpleTotal = principalNum + simpleInterest;
    // سود مرکب
    const compoundTotal = principalNum * Math.pow(1 + r / m, m * t);
    const compoundInterest = compoundTotal - principalNum;
    return {
      simpleInterest: Math.round(simpleInterest),
      simpleTotal: Math.round(simpleTotal),
      compoundInterest: Math.round(compoundInterest),
      compoundTotal: Math.round(compoundTotal),
    };
  }, [principalNum, annualRate, t, m]);

  const u = unitLabel(unit);
  const freqLabel = FREQUENCIES.find((f) => f.value === freq)?.label ?? '';

  const buildParams = (): Record<string, string> => ({
    principal: String(principalNum),
    rate: String(annualRate),
    years: String(t),
    freq,
    unit,
  });

  const onShare = () => {
    if (!calc) return;
    const params = buildParams();
    share({
      title: 'سود سپرده و سرمایه‌گذاری',
      text: `سپردهٔ ${fmtMoney(principalNum)} ${u} با نرخ ${faNum(String(annualRate))}٪ در ${faNum(String(t))} سال — ارزش نهایی (مرکب): ${fmtMoney(calc.compoundTotal)} ${u}`,
      params,
    });
    // Record this calculation so the user can revisit it later.
    addHistory({
      label: `${fmtMoney(principalNum)} ${u} · ${faNum(String(annualRate))}٪ · ${faNum(String(t))} سال`,
      result: `${fmtMoney(calc.compoundTotal)} ${u}`,
      params,
    });
  };

  const onSelectHistory = (entry: ToolHistoryEntry) => applyParams(entry.params);

  return (
    <ToolShell
      title="سود سپرده و سرمایه‌گذاری"
      subtitle="برآورد سود ساده و مرکب سپردهٔ بانکی و رشد سرمایه در طول زمان"
      icon={PiggyBank}
      accent={ACCENT}
      info={[
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'سود ساده و سود مرکب',
          body: 'در سود ساده، سود فقط روی اصل سرمایه محاسبه می‌شود؛ اما در سود مرکب، سودِ هر دوره به اصل افزوده شده و در دورهٔ بعد خودش هم سود می‌سازد. به همین دلیل سود مرکب در بلندمدت رشد چشمگیری دارد.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ سود سالانه',
          body: 'نرخ سود را سالانه وارد کنید. این نرخ بسته به دورهٔ ترکیب (ماهانه، سالانه یا روزانه) به‌صورت داخلی تقسیم می‌شود. هرچه دورهٔ ترکیب کوتاه‌تر باشد، سود مرکب اندکی بیشتر می‌شود.',
        },
        {
          icon: <CalendarClock className="w-4 h-4" />,
          title: 'دورهٔ ترکیب سود',
          body: 'دورهٔ پرداخت/ترکیب سود را انتخاب کنید. سپرده‌های بانکی معمولاً سود را به‌صورت ماهانه پرداخت یا اضافه می‌کنند؛ برای مقایسهٔ گزینه‌ها می‌توانید دورهٔ سالانه یا روزانه را نیز بسنجید.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'مالیات و تورم',
          body: 'این برآورد سود اسمی است و اثر تورم و مالیات احتمالی را در نظر نمی‌گیرد. قدرت خرید واقعی سرمایه به نرخ تورم دوره بستگی دارد.',
        },
      ]}
      disclaimer="این محاسبه راهنماست؛ سود واقعی به شرایط قرارداد بانک، دورهٔ پرداخت و کسر مالیات احتمالی بستگی دارد."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="مبلغ سپرده / سرمایهٔ اولیه"
            amount={principal}
            setAmount={setPrincipal}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="نرخ سود سالانه" hint="نرخ سود مصوب سپرده را وارد کنید">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ سود سالانه به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>

          <Field label="مدت (سال)" hint="می‌توانید اعشار وارد کنید؛ مثلاً ۰٫۵ برای شش ماه">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(years)}
              onChange={(e) => setYears(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="مدت به سال"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>

          <SelectField label="دورهٔ ترکیب سود" value={freq} onChange={setFreq}>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<PiggyBank className="w-6 h-6" />}>
                مبلغ سپرده و مدت را وارد کنید تا سود و ارزش نهایی محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="ارزش نهایی (سود مرکب)"
                  value={fmtMoney(calc.compoundTotal)}
                  suffix={u}
                  sub={`${toWords(calc.compoundTotal)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="سرمایهٔ اولیه" value={`${fmtMoney(principalNum)} ${u}`} />
                  <Row label="نرخ سود سالانه" value={fmtPct(annualRate)} />
                  <Row label="مدت" value={`${faNum(String(t))} سال`} />
                  <Row label="دورهٔ ترکیب" value={freqLabel} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="سود ساده" value={`${fmtMoney(calc.simpleInterest)} ${u}`} />
                  <Row label="ارزش نهایی با سود ساده" value={`${fmtMoney(calc.simpleTotal)} ${u}`} />
                  <Row label="سود مرکب" value={`${fmtMoney(calc.compoundInterest)} ${u}`} strong />
                  <Row label="ارزش نهایی با سود مرکب" value={`${fmtMoney(calc.compoundTotal)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  تفاوت سود مرکب و ساده هرچه مدت طولانی‌تر باشد بیشتر می‌شود؛ این قدرت بهره‌مرکب است.
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

      <HistoryPanel entries={entries} onClear={clearHistory} onSelect={onSelectHistory} />
    </ToolShell>
  );
}
