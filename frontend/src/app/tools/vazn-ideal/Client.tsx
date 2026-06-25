'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Scale, Ruler, Activity, Info } from 'lucide-react';
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
  PrintButton,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '5, 150, 105'; // emerald-600 — must equal the `accent` in tools.ts

type Sex = 'male' | 'female';

const SEXES: { value: Sex; label: string }[] = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
];

// محدودهٔ سالم بر پایهٔ شاخص تودهٔ بدنی (BMI ۱۸٫۵ تا ۲۴٫۹).
const BMI_MIN = 18.5;
const BMI_MAX = 24.9;
// نقطهٔ هدف میانهٔ محدودهٔ سالم (BMI ۲۲).
const BMI_MID = 22;

export default function VaznIdeal() {
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const hv = p.get('h');
    if (hv) setHeight(hv);
    const sv = p.get('sex');
    if (sv === 'male' || sv === 'female') setSex(sv);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const h = Number(normalizeDigits(height).replace(/[^\d.]/g, '')) || 0;

  const calc = useMemo(() => {
    if (h <= 0) return null;
    const m = h / 100;
    if (m <= 0 || !isFinite(m)) return null;

    // محدودهٔ وزن سالم (شاخص تودهٔ بدنی)
    const minW = BMI_MIN * m * m;
    const maxW = BMI_MAX * m * m;
    const midW = BMI_MID * m * m;

    // فرمول مرجع Devine: پایه + ۲٫۳ کیلوگرم به‌ازای هر اینچ بالاتر از ۱۵۲٫۴ سانتی‌متر
    const base = sex === 'male' ? 50 : 45.5;
    const inchesOver = Math.max(0, (h - 152.4) / 2.54);
    const devine = base + 2.3 * inchesOver;

    return { minW, maxW, midW, devine };
  }, [h, sex]);

  const sexLabel = SEXES.find((s) => s.value === sex)?.label ?? '';

  const sentence =
    calc &&
    `محدودهٔ وزن سالم برای قد ${faNum(fmtNum(h, 0))} سانتی‌متر، ${faNum(fmtNum(calc.minW, 1))} تا ${faNum(fmtNum(calc.maxW, 1))} کیلوگرم است.`;

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'وزن ایده‌آل',
      text: sentence ?? '',
      params: { h: String(h), sex },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="وزن ایده‌آل"
      subtitle="محدودهٔ وزن سالم خود را بر پایهٔ قد و فرمول‌های مرجع بیابید"
      icon={Scale}
      accent={ACCENT}
      info={[
        {
          icon: <Activity className="w-4 h-4" />,
          title: 'محدودهٔ وزن سالم',
          body: 'این محدوده از شاخص تودهٔ بدنی (BMI) به‌دست می‌آید: وزنی که BMI آن بین ۱۸٫۵ تا ۲۴٫۹ قرار می‌گیرد، برای قد شما سالم در نظر گرفته می‌شود.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'فرمول دواین (Devine)',
          body: 'فرمولی مرجع و پرکاربرد در پزشکی برای برآورد وزن ایده‌آل: پایهٔ ۵۰ کیلوگرم برای مردان و ۴۵٫۵ کیلوگرم برای زنان، به‌علاوهٔ ۲٫۳ کیلوگرم به‌ازای هر اینچ قد بالاتر از ۱۵۲ سانتی‌متر.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'این برآوردها ترکیب بدن (عضله و چربی)، سن و ساختار استخوانی را در نظر نمی‌گیرند و جایگزین نظر پزشک نیستند. تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
      disclaimer="وزن ایده‌آل یک عدد قطعی نیست؛ بازه‌ای سالم است که به سن، جنسیت، ترکیب بدن و فعالیت بستگی دارد. برای تصمیم‌گیری دقیق با پزشک یا متخصص تغذیه مشورت کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="قد (سانتی‌متر)" hint="مثلاً ۱۷۵">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(height)}
              onChange={(e) => setHeight(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="قد به سانتی‌متر"
              className={inputClass}
            />
          </Field>

          <SelectField label="جنسیت" value={sex} onChange={(v) => setSex(v as Sex)}>
            {SEXES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Ruler className="w-6 h-6" />}>
                قد خود را وارد و جنسیت را انتخاب کنید تا وزن ایده‌آل محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="محدودهٔ وزن سالم"
                  value={`${faNum(fmtNum(calc.minW, 1))} تا ${faNum(fmtNum(calc.maxW, 1))}`}
                  suffix="کیلوگرم"
                  sub={`برای قد ${faNum(fmtNum(h, 0))} سانتی‌متر (${sexLabel})`}
                />
                <div className="space-y-2.5">
                  <Row label="کمترین وزن سالم (BMI ۱۸٫۵)" value={`${faNum(fmtNum(calc.minW, 1))} کیلوگرم`} />
                  <Row label="بیشترین وزن سالم (BMI ۲۴٫۹)" value={`${faNum(fmtNum(calc.maxW, 1))} کیلوگرم`} />
                  <Row label="میانهٔ محدودهٔ سالم (BMI ۲۲)" value={`${faNum(fmtNum(calc.midW, 1))} کیلوگرم`} />
                  <Row label="وزن ایده‌آل (فرمول دواین)" value={`${faNum(fmtNum(calc.devine, 1))} کیلوگرم`} strong />
                </div>
                <Notice accent={ACCENT}>
                  محدودهٔ سالم بر پایهٔ شاخص تودهٔ بدنی و وزن ایده‌آل بر پایهٔ فرمول مرجع دواین محاسبه می‌شود.
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
