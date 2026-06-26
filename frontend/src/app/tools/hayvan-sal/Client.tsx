'use client';

import React, { useState, useMemo } from 'react';
import { Rabbit, Info, CalendarDays } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Field,
  EmptyState,
  Notice,
  AnimatePresence,
  motion,
  faNum,
  normalizeDigits,
} from '@/components/tools/shell';
import { toGregorian } from 'jalaali-js';

const ACCENT = '236, 72, 153'; // pink

// چرخهٔ دوازده‌حیوانی (گاه‌شماری ترکی-مغولی رایج در ایران). لنگر: سال میلادی ۲۰۲۰ = موش.
const ANIMALS = [
  { name: 'موش', emoji: '🐀', traits: 'باهوش، زیرک، سازگار و صرفه‌جو؛ در یافتن فرصت‌ها چابک است.' },
  { name: 'گاو', emoji: '🐂', traits: 'صبور، سخت‌کوش و قابل‌اعتماد؛ با پشتکار به هدف می‌رسد.' },
  { name: 'پلنگ', emoji: '🐆', traits: 'شجاع، پرانرژی و رهبر؛ برابر چالش‌ها نمی‌هراسد.' },
  { name: 'خرگوش', emoji: '🐇', traits: 'مهربان، محتاط و هنردوست؛ آرامش و ظرافت را دوست دارد.' },
  { name: 'نهنگ', emoji: '🐋', traits: 'پرشور، با‌نفوذ و خوش‌اقبال؛ کاریزما و اعتمادبه‌نفس بالایی دارد.' },
  { name: 'مار', emoji: '🐍', traits: 'خردمند، رازدار و ژرف‌اندیش؛ با شهود قوی تصمیم می‌گیرد.' },
  { name: 'اسب', emoji: '🐎', traits: 'آزاد، پرتحرک و پرشور؛ عاشق سفر و استقلال است.' },
  { name: 'گوسفند', emoji: '🐑', traits: 'مهربان، خلاق و صلح‌جو؛ حس زیبایی‌شناسی لطیفی دارد.' },
  { name: 'میمون', emoji: '🐒', traits: 'باهوش، شوخ‌طبع و نوآور؛ راه‌حل‌های خلاقانه پیدا می‌کند.' },
  { name: 'مرغ', emoji: '🐓', traits: 'دقیق، منظم و رک؛ به جزئیات و نظم اهمیت می‌دهد.' },
  { name: 'سگ', emoji: '🐕', traits: 'وفادار، صادق و عدالت‌خواه؛ پشتیبان دوستان خود است.' },
  { name: 'خوک', emoji: '🐖', traits: 'سخاوتمند، صمیمی و خوش‌بین؛ از زندگی و دوستی لذت می‌برد.' },
];

// حیوان سال از روی سال میلادی (۲۰۲۰ → اندیس ۰ = موش).
function animalForGregorianYear(gy: number) {
  const idx = ((((gy - 2020) % 12) + 12) % 12);
  return ANIMALS[idx];
}

export default function HayvanSal() {
  const [jYear, setJYear] = useState('');

  const result = useMemo(() => {
    const jy = Number(normalizeDigits(jYear));
    if (!jy || jy < 1200 || jy > 1500) return null;
    // سال شمسی معمولاً روی دو سال میلادی می‌افتد؛ مبنا را ابتدای سال (فروردین) می‌گیریم.
    const g = toGregorian(jy, 1, 1);
    const animal = animalForGregorianYear(g.gy);
    return { animal, gy: g.gy };
  }, [jYear]);

  return (
    <ToolShell
      title="حیوان سال تولد"
      subtitle="حیوان سال تولد شما در گاه‌شماری دوازده‌حیوانی و ویژگی‌های منسوب به آن"
      icon={Rabbit}
      accent={ACCENT}
      info={[
        {
          icon: <CalendarDays className="w-4 h-4" />,
          title: 'گاه‌شماری دوازده‌حیوانی',
          body: 'این تقویم که در فرهنگ ترکی-مغولی ریشه دارد و در ایران نیز رواج یافته، هر سال را به یکی از دوازده حیوان نسبت می‌دهد و این چرخه هر ۱۲ سال تکرار می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'سرگرمی، نه پیش‌گویی',
          body: 'ویژگی‌های شخصیتی منسوب به هر حیوان جنبهٔ فرهنگی و سرگرمی دارد و مبنای علمی ندارد؛ این ابزار صرفاً برای آشنایی و تفریح است.',
        },
      ]}
      disclaimer="حیوان سال بر مبنای ابتدای سال شمسی محاسبه می‌شود. این ابزار جنبهٔ سرگرمی دارد و پیش‌گویی محسوب نمی‌شود."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="سال تولد (شمسی)" hint="سال تولد خود را به شمسی وارد کنید، مثلاً ۱۳۷۵">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(jYear)}
              onChange={(e) => setJYear(normalizeDigits(e.target.value).replace(/[^\d]/g, '').slice(0, 4))}
              dir="ltr"
              aria-label="سال تولد شمسی"
              placeholder="۱۳۷۵"
              className="w-full bg-background border-2 border-border rounded-2xl py-5 px-5 font-bold font-display text-center focus:border-foreground/40 transition-all outline-none text-2xl md:text-4xl placeholder:text-muted/30"
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!result ? (
              <EmptyState accent={ACCENT} icon={<Rabbit className="w-6 h-6" />}>
                سال تولد شمسی خود را وارد کنید تا حیوان سال شما مشخص شود.
              </EmptyState>
            ) : (
              <motion.div
                key={result.animal.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="text-7xl">{result.animal.emoji}</div>
                <div>
                  <p className="font-display text-sm text-muted-foreground">سال تولد شما، سالِ</p>
                  <p className="font-display text-4xl font-black" style={{ color: `rgb(${ACCENT})` }}>
                    {result.animal.name}
                  </p>
                </div>
                <p className="font-sans text-sm leading-relaxed text-foreground/80">
                  {result.animal.traits}
                </p>
                <Notice accent={ACCENT}>
                  این ویژگی‌ها جنبهٔ فرهنگی و سرگرمی دارند.
                </Notice>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
