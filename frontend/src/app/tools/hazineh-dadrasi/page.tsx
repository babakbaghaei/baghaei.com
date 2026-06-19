'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Receipt, Scale, BookOpen, Info, Layers } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Row,
  Headline,
  EmptyState,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  fmtMoney,
  fmtPct,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import {
  COURT_FEE_FINANCIAL,
  COURT_FEE_THRESHOLD_RIAL,
} from '@/lib/data/legal-rates';

const ACCENT = '14, 116, 144'; // cyan-700

const STAGES: { key: string; label: string; rate: number | 'tiered'; note: string }[] = [
  { key: 'first', label: 'بدوی (نخستین)', rate: 'tiered', note: 'تا سقف آستانه ۲.۵٪ و بیش از آن ۳.۵٪' },
  { key: 'appeal', label: 'واخواهی / تجدیدنظر', rate: COURT_FEE_FINANCIAL.appeal, note: '۴.۵٪ محکومٌ‌به' },
  { key: 'cassation', label: 'فرجام / اعادهٔ دادرسی / اعتراض ثالث', rate: COURT_FEE_FINANCIAL.cassation, note: '۵.۵٪ محکومٌ‌به' },
];

export default function HazinehDadrasi() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [stage, setStage] = useState('first');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) setAmount(Number(a).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const s = p.get('stage');
    if (s && STAGES.some((x) => x.key === s)) setStage(s);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const clean = cleanNum(amount);
  // مبلغ خواسته به ریال (مبنای آستانهٔ قانونی)
  const claimRial = unit === 'toman' ? clean * 10 : clean;

  const calc = useMemo(() => {
    if (clean <= 0) return null;
    const st = STAGES.find((s) => s.key === stage)!;
    let feeRial: number;
    let detail: { label: string; value: string }[] = [];
    if (st.rate === 'tiered') {
      if (claimRial <= COURT_FEE_THRESHOLD_RIAL) {
        feeRial = claimRial * COURT_FEE_FINANCIAL.firstBelow;
        detail = [{ label: 'نرخ اعمال‌شده', value: '۲.۵٪ کل بهای خواسته' }];
      } else {
        feeRial = claimRial * COURT_FEE_FINANCIAL.firstAbove;
        detail = [{ label: 'نرخ اعمال‌شده', value: '۳.۵٪ کل بهای خواسته' }];
      }
    } else {
      feeRial = claimRial * st.rate;
      detail = [{ label: 'نرخ اعمال‌شده', value: fmtPct(st.rate * 100) + ' محکومٌ‌به' }];
    }
    // خروجی هم‌واحد با ورودی
    const feeOut = unit === 'toman' ? feeRial / 10 : feeRial;
    return { feeOut: Math.round(feeOut), stageLabel: st.label, detail };
  }, [clean, claimRial, stage, unit]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'هزینهٔ دادرسی',
      text: `هزینهٔ دادرسی (${calc.stageLabel}) برای خواستهٔ ${fmtMoney(clean)} ${unitLabel(unit)}: ${fmtMoney(calc.feeOut)} ${unitLabel(unit)}`,
      params: { amount: String(clean), unit, stage },
    });
  };

  const u = unitLabel(unit);

  return (
    <ToolShell
      title="هزینهٔ دادرسی و تمبر"
      subtitle="محاسبهٔ هزینهٔ دادرسی دعاوی مالی در مراحل بدوی، تجدیدنظر و فرجام، بر اساس تعرفهٔ خدمات قضایی"
      icon={Receipt}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی',
          body: 'هزینهٔ دادرسی دعاوی مالی طبق بند ۱۲ مادهٔ ۳ قانون وصول برخی از درآمدهای دولت و بخشنامهٔ تعرفهٔ خدمات قضایی محاسبه می‌شود.',
        },
        {
          icon: <Layers className="w-4 h-4" />,
          title: 'درصد هر مرحله',
          body: 'بدوی: تا ۲۰ میلیون تومان ۲.۵٪ و بیش از آن ۳.۵٪ بهای خواسته. واخواهی و تجدیدنظر ۴.۵٪ و فرجام/اعادهٔ دادرسی/اعتراض ثالث ۵.۵٪ محکومٌ‌به.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'دعاوی غیرمالی',
          body: 'برای دعاوی غیرمالی، تأمین دلیل، تأمین خواسته و دستور موقت، مبلغ مقطوع طبق جدول سالانه تعیین می‌شود و درصدی نیست؛ این ابزار مخصوص دعاوی مالی است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکتهٔ سال ۱۴۰۴',
          body: 'نرخ‌های هزینهٔ دادرسی سال ۱۴۰۴ نسبت به ۱۴۰۳ تغییری نکرده است. ملاک، آخرین بخشنامهٔ رئیس قوهٔ قضاییه است.',
        },
      ]}
      disclaimer="این محاسبه راهنماست. هزینهٔ دقیق را دفتر خدمات قضایی الکترونیک (ثنا) و واحد ابطال تمبر تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-8">
          <MoneyField label="بهای خواسته (محکومٌ‌به)" amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} />
          <SelectField
            icon={<Layers className="w-4 h-4" />}
            label="مرحلهٔ رسیدگی"
            value={stage}
            onChange={setStage}
          >
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Receipt className="w-6 h-6" />}>
                بهای خواسته و مرحله را وارد کنید تا هزینهٔ دادرسی محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="هزینهٔ دادرسی"
                  value={fmtMoney(calc.feeOut)}
                  suffix={u}
                  sub={`${toWords(calc.feeOut)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="بهای خواسته" value={`${fmtMoney(clean)} ${u}`} />
                  <Row label="مرحله" value={calc.stageLabel} />
                  {calc.detail.map((d, i) => (
                    <Row key={i} label={d.label} value={d.value} />
                  ))}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="هزینهٔ دادرسی" value={`${fmtMoney(calc.feeOut)} ${u}`} strong />
                </div>
                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
