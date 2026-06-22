'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, ArrowDownUp, Ruler, Info } from 'lucide-react';
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
  ShareButton,
  useShareResult,
  PrintButton,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet

// Linear categories: factor = value of 1 unit in the base unit.
const LINEAR: Record<string, { unit: string; factor: number }[]> = {
  طول: [
    { unit: 'کیلومتر', factor: 1000 },
    { unit: 'متر', factor: 1 },
    { unit: 'سانتی‌متر', factor: 0.01 },
    { unit: 'میلی‌متر', factor: 0.001 },
    { unit: 'مایل', factor: 1609.344 },
    { unit: 'یارد', factor: 0.9144 },
    { unit: 'فوت', factor: 0.3048 },
    { unit: 'اینچ', factor: 0.0254 },
  ],
  وزن: [
    { unit: 'تن', factor: 1_000_000 },
    { unit: 'کیلوگرم', factor: 1000 },
    { unit: 'گرم', factor: 1 },
    { unit: 'میلی‌گرم', factor: 0.001 },
    { unit: 'پوند', factor: 453.59237 },
    { unit: 'اونس', factor: 28.349523 },
  ],
  مساحت: [
    { unit: 'کیلومتر مربع', factor: 1_000_000 },
    { unit: 'هکتار', factor: 10_000 },
    { unit: 'متر مربع', factor: 1 },
    { unit: 'سانتی‌متر مربع', factor: 0.0001 },
    { unit: 'جریب (۱۰۰۰m²)', factor: 1000 },
    { unit: 'ایکر', factor: 4046.8564 },
  ],
};

const CATEGORIES = [...Object.keys(LINEAR), 'دما'];

const convertTemp = (v: number, from: string, to: string): number => {
  // to Celsius first
  let c = v;
  if (from === 'فارنهایت') c = (v - 32) * (5 / 9);
  else if (from === 'کلوین') c = v - 273.15;
  // from Celsius to target
  if (to === 'فارنهایت') return c * (9 / 5) + 32;
  if (to === 'کلوین') return c + 273.15;
  return c;
};
const TEMP_UNITS = ['سلسیوس', 'فارنهایت', 'کلوین'];

export default function TabdilVahed() {
  const [category, setCategory] = useState('طول');
  const [from, setFrom] = useState('کیلومتر');
  const [to, setTo] = useState('متر');
  const [value, setValue] = useState('1');
  const { share, copied } = useShareResult();

  const onCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'دما') {
      setFrom('سلسیوس');
      setTo('فارنهایت');
    } else {
      setFrom(LINEAR[cat][0].unit);
      setTo(LINEAR[cat][1].unit);
    }
  };

  const swapUnits = () => {
    setFrom(to);
    setTo(from);
  };

  const units = category === 'دما' ? TEMP_UNITS : LINEAR[category].map((u) => u.unit);
  const v = Number(normalizeDigits(value).replace(/[^\d.-]/g, ''));

  const result = useMemo(() => {
    if (!isFinite(v) || value.trim() === '') return null;
    if (category === 'دما') return convertTemp(v, from, to);
    const f = LINEAR[category].find((u) => u.unit === from)?.factor ?? 1;
    const t = LINEAR[category].find((u) => u.unit === to)?.factor ?? 1;
    return (v * f) / t;
  }, [v, value, category, from, to]);

  const onShare = () => {
    if (result === null) return;
    share({
      title: 'مبدل واحدها',
      text: `${faNum(fmtNum(v, 4))} ${from} = ${faNum(fmtNum(result, 4))} ${to}`,
    });
  };

  return (
    <ToolShell
      title="مبدل واحدها"
      subtitle="تبدیل سریع واحدهای طول، وزن، مساحت و دما"
      icon={ArrowRightLeft}
      accent={ACCENT}
      info={[
        {
          icon: <Ruler className="w-4 h-4" />,
          title: 'دسته‌بندی واحدها',
          body: 'ابتدا نوع کمیت (طول، وزن، مساحت یا دما) را انتخاب کنید، سپس واحد مبدأ و مقصد را برگزینید.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'دقت محاسبه',
          body: 'تبدیل‌ها بر پایهٔ ضرایب استاندارد بین‌المللی انجام می‌شوند و نتیجه تا چهار رقم اعشار نمایش داده می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField label="نوع کمیت" value={category} onChange={onCategoryChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </SelectField>

          <Field label="مقدار" hint="عدد موردنظر برای تبدیل">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(value)}
              onChange={(e) => setValue(normalizeDigits(e.target.value).replace(/[^\d.-]/g, ''))}
              dir="ltr"
              aria-label="مقدار"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>

          <SelectField label="از واحد" value={from} onChange={setFrom}>
            {units.map((un) => (
              <option key={un} value={un}>{un}</option>
            ))}
          </SelectField>

          <div className="flex justify-center -my-2">
            <button
              type="button"
              onClick={swapUnits}
              aria-label="جابه‌جایی واحد مبدأ و مقصد"
              className="w-10 h-10 rounded-full bg-background border-2 border-border text-muted-foreground hover:text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 outline-none flex items-center justify-center transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          <SelectField label="به واحد" value={to} onChange={setTo}>
            {units.map((un) => (
              <option key={un} value={un}>{un}</option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {result === null ? (
              <EmptyState accent={ACCENT} icon={<ArrowRightLeft className="w-6 h-6" />}>
                مقدار و واحدها را انتخاب کنید تا تبدیل انجام شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline accent={ACCENT} label="نتیجهٔ تبدیل" value={faNum(fmtNum(result, 4))} suffix={to} />
                <div className="space-y-2.5">
                  <Row label="مقدار ورودی" value={`${faNum(fmtNum(v, 4))} ${from}`} />
                  <Row label="معادل" value={`${faNum(fmtNum(result, 4))} ${to}`} strong />
                </div>
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
