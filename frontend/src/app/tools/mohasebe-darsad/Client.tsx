'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Percent, Calculator, TrendingUp, Divide, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
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
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet-500

type Mode = 'of' | 'ratio' | 'change';

const MODES: { value: Mode; label: string }[] = [
  { value: 'of', label: 'درصدی از یک عدد' },
  { value: 'ratio', label: 'نسبت دو عدد' },
  { value: 'change', label: 'تغییر درصدی' },
];

const LABELS: Record<Mode, { a: string; b: string; aHint?: string; bHint?: string }> = {
  of: { a: 'درصد', b: 'عدد پایه', aHint: 'مثلاً ۲۵', bHint: 'مثلاً ۸۰۰٬۰۰۰' },
  ratio: { a: 'عدد', b: 'از کل', aHint: 'صورت کسر', bHint: 'مخرج کسر' },
  change: { a: 'مقدار اولیه', b: 'مقدار نهایی', aHint: 'مقدار قبل', bHint: 'مقدار بعد' },
};

const parse = (s: string) => {
  const v = normalizeDigits(s).replace(/[^\d.-]/g, '');
  if (v === '' || v === '-' || v === '.') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function MohasebeDarsad() {
  const [mode, setMode] = useState<Mode>('of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const md = p.get('mode');
    if (md && MODES.some((m) => m.value === md)) setMode(md as Mode);
    const av = p.get('a');
    if (av) setA(av);
    const bv = p.get('b');
    if (bv) setB(bv);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const numA = parse(a);
  const numB = parse(b);

  const calc = useMemo(() => {
    if (numA === null || numB === null) return null;
    if (mode === 'of') {
      const result = (numA / 100) * numB;
      return {
        headline: fmtNum(result),
        sentence: `${faNum(String(numA))}٪ از ${fmtNum(numB)} برابر است با ${fmtNum(result)}`,
        rows: [
          { label: 'درصد', value: `${faNum(String(numA))}٪` },
          { label: 'عدد پایه', value: fmtNum(numB) },
          { label: 'نتیجه', value: fmtNum(result), strong: true },
        ],
      };
    }
    if (mode === 'ratio') {
      if (numB === 0) return { error: 'مخرج نمی‌تواند صفر باشد.' };
      const result = (numA / numB) * 100;
      return {
        headline: `${fmtNum(result)}٪`,
        sentence: `${fmtNum(numA)} معادل ${fmtNum(result)}٪ از ${fmtNum(numB)} است`,
        rows: [
          { label: 'عدد', value: fmtNum(numA) },
          { label: 'از کل', value: fmtNum(numB) },
          { label: 'نسبت', value: `${fmtNum(result)}٪`, strong: true },
        ],
      };
    }
    // change
    if (numA === 0) return { error: 'مقدار اولیه نمی‌تواند صفر باشد.' };
    const diff = numB - numA;
    const result = (diff / numA) * 100;
    const dir = diff > 0 ? 'افزایش' : diff < 0 ? 'کاهش' : 'بدون تغییر';
    return {
      headline: `${fmtNum(Math.abs(result))}٪`,
      sentence: `از ${fmtNum(numA)} به ${fmtNum(numB)} — ${fmtNum(Math.abs(result))}٪ ${dir}`,
      rows: [
        { label: 'مقدار اولیه', value: fmtNum(numA) },
        { label: 'مقدار نهایی', value: fmtNum(numB) },
        { label: 'مقدار تغییر', value: fmtNum(diff) },
        { label: dir, value: `${fmtNum(Math.abs(result))}٪`, strong: true },
      ],
    };
  }, [mode, numA, numB]);

  const lbl = LABELS[mode];

  const onShare = () => {
    if (!calc || calc.error) return;
    share({
      title: 'محاسبه‌گر درصد',
      text: calc.sentence ?? '',
      params: { mode, a: String(numA), b: String(numB) },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="محاسبه‌گر درصد"
      subtitle="محاسبهٔ سریع درصدی از یک عدد، نسبت دو عدد و تغییر درصدی"
      icon={Percent}
      accent={ACCENT}
      info={[
        {
          icon: <Calculator className="w-4 h-4" />,
          title: 'درصدی از یک عدد',
          body: 'برای یافتن «درصد مشخصی از یک عدد»؛ مثلاً ۲۵٪ از ۸۰۰٬۰۰۰ تومان. کاربرد روزمره: محاسبهٔ تخفیف، مالیات، پورسانت و انعام.',
        },
        {
          icon: <Divide className="w-4 h-4" />,
          title: 'نسبت دو عدد',
          body: 'برای پاسخ به «یک عدد چند درصد از عدد دیگر است»؛ مثلاً ۳۰ نفر چند درصد از ۱۲۰ نفر هستند. کاربرد: سهم بازار، نرخ موفقیت و سهم هر بخش.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'تغییر درصدی',
          body: 'برای محاسبهٔ «درصد افزایش یا کاهش» میان دو مقدار؛ مثلاً تغییر قیمت از ۱۰۰ به ۱۳۰ یعنی ۳۰٪ افزایش. کاربرد: رشد قیمت، درصد سود یا زیان و نرخ تورم.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'اعداد می‌توانند اعشاری یا منفی باشند و ارقام فارسی نیز پذیرفته می‌شوند. تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField label="نوع محاسبه" value={mode} onChange={(v) => setMode(v as Mode)}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </SelectField>

          <Field label={lbl.a} hint={lbl.aHint}>
            <input
              type="text"
              inputMode="decimal"
              value={faNum(a)}
              onChange={(e) => setA(normalizeDigits(e.target.value).replace(/[^\d.-]/g, ''))}
              dir="ltr"
              aria-label={lbl.a}
              className={inputClass}
            />
          </Field>

          <Field label={lbl.b} hint={lbl.bHint}>
            <input
              type="text"
              inputMode="decimal"
              value={faNum(b)}
              onChange={(e) => setB(normalizeDigits(e.target.value).replace(/[^\d.-]/g, ''))}
              dir="ltr"
              aria-label={lbl.b}
              className={inputClass}
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Percent className="w-6 h-6" />}>
                نوع محاسبه را انتخاب و هر دو عدد را وارد کنید.
              </EmptyState>
            ) : calc.error ? (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{calc.error}</p>
              </motion.div>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline accent={ACCENT} label="نتیجه" value={calc.headline ?? ''} sub={calc.sentence} />
                <div className="space-y-2.5">
                  {calc.rows?.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  ارقام فارسی، اعشاری و منفی پذیرفته می‌شوند؛ نتیجه به‌صورت زنده محاسبه می‌شود.
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
