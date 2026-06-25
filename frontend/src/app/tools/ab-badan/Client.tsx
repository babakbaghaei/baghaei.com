'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Droplets, Activity, GlassWater, Info } from 'lucide-react';
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

const ACCENT = '2, 132, 199'; // sky-600

type Activity = 'low' | 'moderate' | 'high';

// base ml per kg of body weight + extra ml of water for each activity level
const ACTIVITIES: { value: Activity; label: string; perKg: number; bonus: number; hint: string }[] = [
  { value: 'low', label: 'کم‌تحرک (بیشتر نشسته)', perKg: 30, bonus: 0, hint: 'کار اداری، فعالیت بدنی محدود' },
  { value: 'moderate', label: 'فعالیت متوسط (ورزش سبک)', perKg: 33, bonus: 350, hint: 'پیاده‌روی روزانه یا ورزش چند بار در هفته' },
  { value: 'high', label: 'پرتحرک (ورزش شدید)', perKg: 35, bonus: 700, hint: 'تمرین سنگین یا کار بدنی روزانه' },
];

const GLASS_ML = 200; // یک لیوان استاندارد ≈ ۲۰۰ میلی‌لیتر

const parse = (s: string) => {
  const v = normalizeDigits(s).replace(/[^\d.]/g, '');
  return v === '' || v === '.' ? null : Number(v);
};

export default function AbBadanTool() {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<Activity>('low');
  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get('w');
    if (w) setWeight(w);
    const ac = p.get('activity');
    if (ac && ACTIVITIES.some((a) => a.value === ac)) setActivity(ac as Activity);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const w = parse(weight);

  const calc = useMemo(() => {
    if (w === null || w <= 0) return null;
    const act = ACTIVITIES.find((a) => a.value === activity) ?? ACTIVITIES[0];
    const baseMl = w * act.perKg;
    const totalMl = baseMl + act.bonus;
    const liters = totalMl / 1000;
    const glasses = totalMl / GLASS_ML;
    return { act, baseMl, totalMl, liters, glasses };
  }, [w, activity]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'آب موردنیاز بدن',
      text: `با وزن ${faNum(String(w))} کیلوگرم و سطح فعالیت «${calc.act.label}»، روزانه حدود ${faNum(fmtNum(calc.liters, 1))} لیتر آب نیاز دارید.`,
      params: { w: String(w), activity },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="آب موردنیاز بدن"
      subtitle="برآورد میزان آب روزانهٔ موردنیاز بدن بر اساس وزن و سطح فعالیت"
      icon={Droplets}
      accent={ACCENT}
      info={[
        {
          icon: <Info className="w-4 h-4" />,
          title: 'این برآورد چگونه به‌دست می‌آید؟',
          body: 'به‌طور تقریبی برای هر کیلوگرم وزن بدن ۳۰ تا ۳۵ میلی‌لیتر آب در روز در نظر گرفته می‌شود؛ با بالا رفتن سطح فعالیت، مقدار پایه افزایش یافته و مقداری آب جبرانی نیز اضافه می‌شود.',
        },
        {
          icon: <Activity className="w-4 h-4" />,
          title: 'نقش فعالیت بدنی',
          body: 'هرچه فعالیت بدنی بیشتر باشد، آب بیشتری از طریق تعریق از دست می‌رود؛ بنابراین افراد پرتحرک به آب بیشتری نیاز دارند.',
        },
        {
          icon: <GlassWater className="w-4 h-4" />,
          title: 'لیوان استاندارد',
          body: 'در این محاسبه هر لیوان حدود ۲۰۰ میلی‌لیتر در نظر گرفته شده است؛ پس می‌توانید نیاز روزانه را به تعداد لیوان هم ببینید.',
        },
      ]}
      disclaimer="این عدد یک برآورد عمومی است و شرایط ویژه (بارداری، تب، گرمای هوا یا بیماری) را در نظر نمی‌گیرد و جایگزین نظر پزشک نیست."
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
              className={inputClass}
            />
          </Field>

          <SelectField
            label="سطح فعالیت روزانه"
            value={activity}
            onChange={(v) => setActivity(v as Activity)}
            icon={<Activity className="w-4 h-4" />}
            hint={ACTIVITIES.find((a) => a.value === activity)?.hint}
          >
            {ACTIVITIES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </SelectField>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Droplets className="w-6 h-6" />}>
                وزن خود را وارد و سطح فعالیت را انتخاب کنید.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="آب موردنیاز روزانه"
                  value={faNum(fmtNum(calc.liters, 1))}
                  suffix="لیتر"
                  sub={`حدود ${faNum(String(Math.round(calc.glasses)))} لیوان در روز`}
                />
                <div className="space-y-2.5">
                  <Row label="وزن" value={`${faNum(String(w))} کیلوگرم`} />
                  <Row label="سطح فعالیت" value={calc.act.label} />
                  <Row label="مقدار به میلی‌لیتر" value={`${faNum(fmtNum(calc.totalMl, 0))} میلی‌لیتر`} />
                  <Row label="معادل لیوان (۲۰۰ml)" value={`${faNum(String(Math.round(calc.glasses)))} لیوان`} />
                  <Row label="نیاز روزانه" value={`${faNum(fmtNum(calc.liters, 1))} لیتر`} strong />
                </div>
                <Notice accent={ACCENT}>
                  بهتر است این مقدار را در طول روز و به‌تدریج بنوشید؛ بخشی از آب موردنیاز بدن از طریق غذا و نوشیدنی‌های دیگر نیز تأمین می‌شود.
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
