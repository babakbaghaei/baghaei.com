'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Stamp, Scale, Percent, Layers, Info } from 'lucide-react';
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

const ACCENT = '79, 70, 229'; // indigo-600 (حقوقی)

type Stage = 'badvi' | 'tajdid' | 'farjam';

const STAGES: { value: Stage; label: string }[] = [
  { value: 'badvi', label: 'مرحلهٔ بدوی' },
  { value: 'tajdid', label: 'تجدیدنظر' },
  { value: 'farjam', label: 'فرجام (دیوان عالی)' },
];

// نرخ‌های پیش‌فرض «نمونه و قابل ویرایش» — مطابق قانون بودجهٔ سالانه تغییر می‌کند.
const DEFAULT_RATES: Record<Stage, string> = {
  badvi: '3.5',
  tajdid: '4.5',
  farjam: '5.5',
};

const STAGE_HINT: Record<Stage, string> = {
  badvi: 'نرخ نمونهٔ دعاوی مالی بدوی ۳٫۵٪ بهای خواسته است',
  tajdid: 'نرخ نمونهٔ مرحلهٔ تجدیدنظر ۴٫۵٪ بهای خواسته است',
  farjam: 'نرخ نمونهٔ مرحلهٔ فرجام ۵٫۵٪ بهای خواسته است',
};

const stageLabel = (s: Stage) => STAGES.find((x) => x.value === s)!.label;

export default function HazinehDadrasi() {
  const [claim, setClaim] = useState('');
  const [stage, setStage] = useState<Stage>('badvi');
  const [rate, setRate] = useState(DEFAULT_RATES.badvi); // ← نرخ قابل ویرایش (نمونه)
  const [rateTouched, setRateTouched] = useState(false);
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get('claim');
    if (c && /^\d+$/.test(c)) setClaim(Number(c).toLocaleString('en-US'));
    const st = p.get('stage');
    if (st === 'badvi' || st === 'tajdid' || st === 'farjam') setStage(st);
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) {
      setRate(rt);
      setRateTouched(true);
    } else if (st === 'tajdid' || st === 'farjam') {
      setRate(DEFAULT_RATES[st]);
    }
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // تغییر مرحله، نرخ پیش‌فرض همان مرحله را جایگزین می‌کند مگر کاربر نرخ را دستی ویرایش کرده باشد.
  const onStageChange = (next: Stage) => {
    setStage(next);
    if (!rateTouched) setRate(DEFAULT_RATES[next]);
  };

  const onRateChange = (raw: string) => {
    setRateTouched(true);
    setRate(normalizeDigits(raw).replace(/[^\d.]/g, ''));
  };

  const claimNum = cleanNum(claim);
  const ratePct = Math.max(0, Number(normalizeDigits(rate)) || 0);

  const calc = useMemo(() => {
    if (claimNum <= 0 || ratePct <= 0) return null;
    const fee = (claimNum * ratePct) / 100;
    return { fee: Math.round(fee) };
  }, [claimNum, ratePct]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'هزینهٔ دادرسی و تمبر دادخواست',
      text: `بهای خواسته ${fmtMoney(claimNum)} ${u} — ${stageLabel(stage)} با نرخ ${faNum(String(ratePct))}٪ — هزینهٔ دادرسی: ${fmtMoney(calc.fee)} ${u}`,
      params: {
        claim: String(claimNum),
        stage,
        rate: String(ratePct),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="هزینهٔ دادرسی و تمبر دادخواست"
      subtitle="برآورد هزینهٔ دادرسی دعاوی مالی بر اساس بهای خواسته و مرحلهٔ رسیدگی"
      icon={Stamp}
      accent={ACCENT}
      info={[
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'دعاوی مالی',
          body: 'در دعاوی مالی، هزینهٔ دادرسی درصدی از «بهای خواسته» است؛ یعنی همان مبلغی که خواهان مطالبه می‌کند. این ماشین‌حساب همان درصد را روی بهای خواسته اعمال می‌کند تا برآوردی از تمبر و هزینهٔ دادرسی به دست دهد.',
        },
        {
          icon: <Layers className="w-4 h-4" />,
          title: 'مرحلهٔ رسیدگی',
          body: 'نرخ هزینهٔ دادرسی در مرحلهٔ بدوی، تجدیدنظر و فرجام متفاوت است و معمولاً در مراحل بالاتر بیشتر می‌شود. با تغییر مرحله، نرخ نمونهٔ همان مرحله به‌صورت پیش‌فرض جایگزین می‌شود؛ این نرخ کاملاً قابل ویرایش است.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ قابل ویرایش',
          body: 'نرخ‌های پیش‌فرض صرفاً «نمونه» هستند و باید با نرخ مصوب همان سال جایگزین شوند. نرخ دقیق هزینهٔ دادرسی هر سال در قانون بودجهٔ کل کشور تعیین و منتشر می‌شود؛ پیش از اقدام، نرخ روز را از منبع رسمی بگیرید و در همین کادر وارد کنید.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'موارد لحاظ‌نشده',
          body: 'این برآورد فقط هزینهٔ دادرسی دعاوی مالی را پوشش می‌دهد. هزینهٔ دعاوی غیرمالی، حق‌الوکاله، هزینهٔ کارشناسی، واخواهی، اعتراض ثالث و سایر مخارج دادرسی در آن لحاظ نشده و باید جداگانه محاسبه شود.',
        },
      ]}
      disclaimer={
        <span>
          این رقم یک «برآورد» است. نرخ‌ها مطابق قانون بودجهٔ سالانه تغییر می‌کند و نرخ پیش‌فرض قابل ویرایش است؛
          پیش از پرداخت، نرخ روز را از منبع رسمی بررسی و وارد کنید.
        </span>
      }
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="بهای خواسته"
            amount={claim}
            setAmount={setClaim}
            unit={unit}
            setUnit={setUnit}
          />

          <SelectField
            icon={<Layers className="w-4 h-4" />}
            label="مرحلهٔ رسیدگی"
            hint="نرخ نمونهٔ همان مرحله به‌صورت پیش‌فرض اعمال می‌شود"
            value={stage}
            onChange={(v) => onStageChange(v as Stage)}
          >
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>

          <Field label="نرخ هزینهٔ دادرسی" hint={STAGE_HINT[stage] + ' — قابل ویرایش'}>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => onRateChange(e.target.value)}
                dir="ltr"
                aria-label="نرخ هزینهٔ دادرسی به درصد بهای خواسته"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Stamp className="w-6 h-6" />}>
                بهای خواسته و نرخ مرحلهٔ رسیدگی را وارد کنید تا هزینهٔ دادرسی برآورد شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="هزینهٔ دادرسی (برآورد)"
                  value={fmtMoney(calc.fee)}
                  suffix={u}
                  sub={`${toWords(calc.fee)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="بهای خواسته" value={`${fmtMoney(claimNum)} ${u}`} />
                  <Row label="مرحلهٔ رسیدگی" value={stageLabel(stage)} />
                  <Row label="نرخ اعمال‌شده" value={fmtPct(ratePct)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="هزینهٔ دادرسی" value={`${fmtMoney(calc.fee)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  نرخ پیش‌فرض نمونه است و مطابق قانون بودجهٔ سالانه تغییر می‌کند؛ نرخ روز را از منبع رسمی بررسی و وارد کنید.
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
