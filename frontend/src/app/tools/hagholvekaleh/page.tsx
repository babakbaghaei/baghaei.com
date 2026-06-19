'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Briefcase, Scale, BookOpen, Layers, Percent } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Toggle,
  Row,
  Headline,
  EmptyState,
  Notice,
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
import { ATTORNEY_FEE_TIERS, ATTORNEY_FEE_FINAL_RATE } from '@/lib/data/legal-rates';

const ACCENT = '180, 83, 9'; // amber-700

export default function Hagholvekaleh() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [finalJudgment, setFinalJudgment] = useState(false);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) setAmount(Number(a).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    if (p.get('final') === '1') setFinalJudgment(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const clean = cleanNum(amount);
  const claimRial = unit === 'toman' ? clean * 10 : clean;

  const calc = useMemo(() => {
    if (clean <= 0) return null;

    if (finalJudgment) {
      const feeRial = claimRial * ATTORNEY_FEE_FINAL_RATE;
      return {
        feeOut: Math.round(unit === 'toman' ? feeRial / 10 : feeRial),
        tiers: [] as { label: string; portionOut: number; rate: number; feeOut: number }[],
        rateLabel: fmtPct(ATTORNEY_FEE_FINAL_RATE * 100),
      };
    }

    let remaining = claimRial;
    let prevCap = 0;
    let feeRial = 0;
    const tiers: { label: string; portionOut: number; rate: number; feeOut: number }[] = [];
    for (const tier of ATTORNEY_FEE_TIERS) {
      if (remaining <= 0) break;
      const span = tier.upTo - prevCap;
      const portion = Math.min(remaining, span);
      const part = portion * tier.rate;
      feeRial += part;
      const capLabel =
        tier.upTo === Infinity
          ? `مازاد بر ${fmtMoney((prevCap / (unit === 'toman' ? 10 : 1)))} ${unitLabel(unit)}`
          : `تا ${fmtMoney(tier.upTo / (unit === 'toman' ? 10 : 1))} ${unitLabel(unit)}`;
      tiers.push({
        label: capLabel,
        portionOut: Math.round(portion / (unit === 'toman' ? 10 : 1)),
        rate: tier.rate,
        feeOut: Math.round(part / (unit === 'toman' ? 10 : 1)),
      });
      remaining -= portion;
      prevCap = tier.upTo;
    }
    return {
      feeOut: Math.round(unit === 'toman' ? feeRial / 10 : feeRial),
      tiers,
      rateLabel: '',
    };
  }, [clean, claimRial, finalJudgment, unit]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'حق‌الوکالهٔ وکیل دادگستری',
      text: `حق‌الوکالهٔ دعوای مالی به ارزش ${fmtMoney(clean)} ${u}: ${fmtMoney(calc.feeOut)} ${u}`,
      params: { amount: String(clean), unit, final: finalJudgment ? '1' : '0' },
    });
  };

  return (
    <ToolShell
      title="ماشین‌حساب حق‌الوکاله"
      subtitle="برآورد حق‌الوکالهٔ وکیل دادگستری در دعاوی مالی، بر اساس آیین‌نامهٔ تعرفهٔ حق‌الوکاله مصوب ۱۳۹۸"
      icon={Briefcase}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی',
          body: 'آیین‌نامهٔ تعرفهٔ حق‌الوکالهٔ وکلای دادگستری مصوب ۱۳۹۸/۱۲/۲۸ رئیس قوهٔ قضاییه. این تعرفه «حداقل» حق‌الوکاله را تعیین می‌کند و توافق وکیل و موکل می‌تواند بیشتر باشد.',
        },
        {
          icon: <Layers className="w-4 h-4" />,
          title: 'پلکان دعاوی مالی',
          body: 'تا ۵۰ میلیون تومان ۸٪، مازاد تا ۲۰۰ میلیون تومان ۷٪، مازاد تا یک میلیارد تومان ۵٪ و مازاد بر آن ۴٪ بهای خواسته. حق‌الوکاله به‌صورت پلکانی روی هر بازه اعمال می‌شود.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'حکم قطعی از حیث بها',
          body: 'هرگاه حکم بدوی از حیث بهای خواسته قطعی باشد (غیرقابل تجدیدنظر)، حق‌الوکاله به‌صورت مقطوع ۱۰٪ کل بهای خواسته محاسبه می‌شود.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'هر مرحله جداگانه',
          body: 'حق‌الوکالهٔ هر مرحله (بدوی، تجدیدنظر، فرجام و اجرای احکام) جداگانه محاسبه می‌شود. این ابزار حق‌الوکالهٔ یک مرحله را برآورد می‌کند.',
        },
      ]}
      disclaimer="این برآورد راهنماست. مبلغ نهایی تابع قرارداد وکالت، نوع دعوا و آخرین تعرفهٔ مصوب است. برای دعاوی غیرمالی تعرفهٔ مقطوع جداگانه‌ای وجود دارد."
    >
      <TwoPane>
        <Panel className="space-y-8">
          <MoneyField label="بهای خواسته (ارزش دعوا)" amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} />
          <Toggle
            label="حکم از حیث بها قطعی است"
            hint="در این حالت حق‌الوکاله مقطوعاً ۱۰٪ کل بهای خواسته است"
            checked={finalJudgment}
            onChange={setFinalJudgment}
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Briefcase className="w-6 h-6" />}>
                بهای خواسته را وارد کنید تا حق‌الوکاله برآورد شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="حق‌الوکالهٔ این مرحله"
                  value={fmtMoney(calc.feeOut)}
                  suffix={u}
                  sub={`${toWords(calc.feeOut)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="بهای خواسته" value={`${fmtMoney(clean)} ${u}`} />
                  {finalJudgment ? (
                    <Row label="نرخ مقطوع" value={`${calc.rateLabel} کل بها`} />
                  ) : (
                    <>
                      <div className="h-px bg-border/60 my-1" />
                      {calc.tiers.map((t, i) => (
                        <Row
                          key={i}
                          label={`${t.label} (${fmtPct(t.rate * 100)})`}
                          value={`${fmtMoney(t.feeOut)} ${u}`}
                        />
                      ))}
                    </>
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع حق‌الوکاله" value={`${fmtMoney(calc.feeOut)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  این مبلغ «حداقل» تعرفه برای یک مرحله است؛ توافق وکیل و موکل می‌تواند بیشتر باشد و حق‌الوکالهٔ مراحل بعدی جداگانه محاسبه می‌شود.
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
