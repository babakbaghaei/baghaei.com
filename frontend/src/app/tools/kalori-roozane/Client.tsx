'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Flame, Activity, Ruler, Info } from 'lucide-react';
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

const ACCENT = '16, 185, 129'; // emerald

type Sex = 'male' | 'female';

const SEXES: { value: Sex; label: string }[] = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
];

const ACTIVITY = [
  { value: '1.2', label: 'بی‌تحرک (کار پشت‌میزی، بدون ورزش)' },
  { value: '1.375', label: 'فعالیت کم (ورزش سبک ۱ تا ۳ روز در هفته)' },
  { value: '1.55', label: 'فعالیت متوسط (ورزش ۳ تا ۵ روز در هفته)' },
  { value: '1.725', label: 'فعالیت زیاد (ورزش سنگین ۶ تا ۷ روز در هفته)' },
  { value: '1.9', label: 'فعالیت بسیار زیاد (کار بدنی یا ورزش حرفه‌ای)' },
];

const num = (s: string) => {
  const v = normalizeDigits(s).replace(/[^\d.]/g, '');
  return v === '' || v === '.' ? 0 : Number(v);
};

const GOAL_DELTA = 500; // ~۵۰۰ کیلوکالری ≈ نیم کیلو در هفته

export default function KaloriRoozane() {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.375');
  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const sx = p.get('s');
    if (sx && SEXES.some((m) => m.value === sx)) setSex(sx as Sex);
    const ag = p.get('a');
    if (ag) setAge(ag);
    const ht = p.get('h');
    if (ht) setHeight(ht);
    const wt = p.get('w');
    if (wt) setWeight(wt);
    const ac = p.get('act');
    if (ac && ACTIVITY.some((m) => m.value === ac)) setActivity(ac);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const a = num(age);
  const h = num(height);
  const w = num(weight);
  const factor = Number(activity);

  const calc = useMemo(() => {
    if (a <= 0 || h <= 0 || w <= 0) return null;
    // Mifflin-St Jeor: BMR = 10·وزن + 6.25·قد − 5·سن + (مرد +5 / زن −161)
    const base = 10 * w + 6.25 * h - 5 * a;
    const bmr = sex === 'male' ? base + 5 : base - 161;
    if (!isFinite(bmr) || bmr <= 0) return null;
    const tdee = bmr * factor;
    const lose = tdee - GOAL_DELTA;
    const gain = tdee + GOAL_DELTA;
    const actLabel = ACTIVITY.find((x) => x.value === activity)?.label ?? '';
    return { bmr, tdee, lose, gain, actLabel };
  }, [a, h, w, sex, factor, activity]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'کالری روزانهٔ موردنیاز',
      text: `کالری پایهٔ من ${faNum(fmtNum(Math.round(calc.bmr)))} و کالری روزانهٔ موردنیازم حدود ${faNum(fmtNum(Math.round(calc.tdee)))} کیلوکالری است.`,
      params: { s: sex, a: String(a), h: String(h), w: String(w), act: activity },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="کالری روزانهٔ موردنیاز"
      subtitle="کالری پایه (BMR) و کل (TDEE) را بر پایهٔ فرمول میفلین-سنت‌جئور برآورد کنید"
      icon={Flame}
      accent={ACCENT}
      info={[
        {
          icon: <Flame className="w-4 h-4" />,
          title: 'BMR چیست؟',
          body: 'سوخت‌وساز پایه (BMR) مقدار کالری‌ای است که بدن در حالت کامل استراحت برای کارکردهای حیاتی مانند تنفس و گردش خون می‌سوزاند.',
        },
        {
          icon: <Activity className="w-4 h-4" />,
          title: 'TDEE چیست؟',
          body: 'کل انرژی مصرفی روزانه (TDEE) برابر است با BMR ضرب‌در ضریب سطح فعالیت؛ یعنی کالری واقعی موردنیاز برای حفظ وزن فعلی.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'هدف وزن',
          body: 'برای کاهش وزن حدود ۵۰۰ کیلوکالری کمتر و برای افزایش وزن حدود ۵۰۰ کیلوکالری بیشتر از TDEE مصرف کنید (تقریباً نیم کیلوگرم در هفته).',
        },
      ]}
      disclaimer="این برآورد تقریبی است و جایگزین مشاورهٔ پزشک یا متخصص تغذیه نیست."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField label="جنسیت" value={sex} onChange={(v) => setSex(v as Sex)}>
            {SEXES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>

          <Field label="سن (سال)" hint="مثلاً ۳۰">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(age)}
              onChange={(e) => setAge(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="سن به سال"
              className={inputClass}
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
              className={inputClass}
            />
          </Field>

          <Field label="وزن (کیلوگرم)" hint="مثلاً ۷۲">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(weight)}
              onChange={(e) => setWeight(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="وزن به کیلوگرم"
              className={inputClass}
            />
          </Field>

          <SelectField
            label="سطح فعالیت"
            value={activity}
            onChange={(v) => setActivity(v)}
            icon={<Activity className="w-4 h-4" />}
          >
            {ACTIVITY.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Ruler className="w-6 h-6" />}>
                سن، قد و وزن خود را وارد کنید تا کالری موردنیاز محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="کالری روزانهٔ موردنیاز (TDEE)"
                  value={faNum(fmtNum(Math.round(calc.tdee)))}
                  suffix="کیلوکالری"
                  sub={`سوخت‌وساز پایه: ${faNum(fmtNum(Math.round(calc.bmr)))} کیلوکالری`}
                />
                <div className="space-y-2.5">
                  <Row label="کالری پایه (BMR)" value={`${faNum(fmtNum(Math.round(calc.bmr)))} کیلوکالری`} />
                  <Row label="حفظ وزن فعلی (TDEE)" value={`${faNum(fmtNum(Math.round(calc.tdee)))} کیلوکالری`} strong />
                  <Row label="کاهش وزن (−۵۰۰)" value={`${faNum(fmtNum(Math.round(calc.lose)))} کیلوکالری`} />
                  <Row label="افزایش وزن (+۵۰۰)" value={`${faNum(fmtNum(Math.round(calc.gain)))} کیلوکالری`} />
                </div>
                <Notice accent={ACCENT}>
                  برای کاهش یا افزایش حدود نیم کیلوگرم در هفته، روزانه ۵۰۰ کیلوکالری کمتر یا بیشتر از TDEE مصرف کنید.
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
