'use client';

import React, { useMemo, useState } from 'react';
import { HeartPulse, Ruler, Weight, Info } from 'lucide-react';
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
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '16, 185, 129'; // emerald

const CATEGORIES = [
  { max: 18.5, label: 'کمبود وزن', color: '59, 130, 246' },
  { max: 25, label: 'وزن نرمال', color: '16, 185, 129' },
  { max: 30, label: 'اضافه‌وزن', color: '245, 158, 11' },
  { max: 35, label: 'چاقی درجه ۱', color: '249, 115, 22' },
  { max: 40, label: 'چاقی درجه ۲', color: '239, 68, 68' },
  { max: Infinity, label: 'چاقی درجه ۳', color: '190, 18, 60' },
];

export default function BmiTool() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const { share, copied } = useShareResult();

  const w = Number(normalizeDigits(weight).replace(/[^\d.]/g, '')) || 0;
  const h = Number(normalizeDigits(height).replace(/[^\d.]/g, '')) || 0;

  const calc = useMemo(() => {
    if (w <= 0 || h <= 0) return null;
    const m = h / 100;
    const bmi = w / (m * m);
    if (!isFinite(bmi) || bmi <= 0) return null;
    const cat = CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
    // Healthy weight range for this height
    const minW = 18.5 * m * m;
    const maxW = 24.9 * m * m;
    return { bmi, cat, minW, maxW };
  }, [w, h]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبه‌گر BMI',
      text: `شاخص تودهٔ بدنی من ${faNum(fmtNum(calc.bmi, 1))} است (${calc.cat.label}).`,
      params: { w: String(w), h: String(h) },
    });
  };

  return (
    <ToolShell
      title="محاسبه‌گر شاخص تودهٔ بدنی (BMI)"
      subtitle="نسبت وزن به قد را بسنجید و محدودهٔ وزن سالم خود را بیابید"
      icon={HeartPulse}
      accent={ACCENT}
      info={[
        {
          icon: <Info className="w-4 h-4" />,
          title: 'BMI چیست؟',
          body: 'شاخص تودهٔ بدنی نسبت وزن (کیلوگرم) به مجذور قد (متر) است و معیاری ساده برای ارزیابی تناسب وزن محسوب می‌شود.',
        },
        {
          icon: <Weight className="w-4 h-4" />,
          title: 'محدودهٔ نرمال',
          body: 'BMI بین ۱۸٫۵ تا ۲۴٫۹ نرمال در نظر گرفته می‌شود. کمتر از آن کمبود وزن و بیشتر از آن اضافه‌وزن یا چاقی است.',
        },
      ]}
      disclaimer="BMI ترکیب بدن (عضله/چربی) را در نظر نمی‌گیرد و جایگزین نظر پزشک نیست."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="وزن (کیلوگرم)" hint="مثلاً ۷۲">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(weight)}
              onChange={(e) => setWeight(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="وزن به کیلوگرم"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>
          <Field label="قد (سانتی‌متر)" hint="مثلاً ۱۷۵">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(height)}
              onChange={(e) => setHeight(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="قد به سانتی‌متر"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Ruler className="w-6 h-6" />}>
                وزن و قد خود را وارد کنید تا BMI محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={calc.cat.color}
                  label="شاخص تودهٔ بدنی"
                  value={faNum(fmtNum(calc.bmi, 1))}
                  sub={calc.cat.label}
                />
                <div className="space-y-2.5">
                  <Row label="وضعیت" value={calc.cat.label} strong />
                  <Row label="محدودهٔ وزن سالم برای قد شما" value={`${faNum(fmtNum(calc.minW, 1))} تا ${faNum(fmtNum(calc.maxW, 1))} کیلوگرم`} />
                </div>
                <Notice accent={ACCENT}>
                  برای حفظ سلامت، وزن خود را در محدودهٔ نرمال (BMI ۱۸٫۵ تا ۲۴٫۹) نگه دارید.
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
