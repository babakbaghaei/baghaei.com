'use client';

import React, { useState, useMemo } from 'react';
import { Star, Sparkles, Heart, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Field,
  Select,
  EmptyState,
  Row,
  Notice,
  AnimatePresence,
  motion,
} from '@/components/tools/shell';
import { PersianDatePicker, type PDate } from '@/components/tools/DatePicker';

const ACCENT = '124, 58, 237'; // violet

type Element = 'آتش' | 'خاک' | 'باد' | 'آب';

interface Sign {
  key: string;
  name: string;
  emoji: string;
  element: Element;
  // بازهٔ میلادی: [ماه، روزِ شروع] تا روز پایان در ماه بعد.
  from: [number, number];
  to: [number, number];
  traits: string;
}

// دوازده برج فلکی با بازهٔ میلادی و عنصر.
const SIGNS: Sign[] = [
  { key: 'aries', name: 'حمل (قوچ)', emoji: '♈', element: 'آتش', from: [3, 21], to: [4, 19], traits: 'پرشور، پیشگام و جسور؛ رهبر طبیعی با انرژی بالا.' },
  { key: 'taurus', name: 'ثور (گاو)', emoji: '♉', element: 'خاک', from: [4, 20], to: [5, 20], traits: 'پایدار، عمل‌گرا و وفادار؛ عاشق آرامش و زیبایی.' },
  { key: 'gemini', name: 'جوزا (دوپیکر)', emoji: '♊', element: 'باد', from: [5, 21], to: [6, 20], traits: 'کنجکاو، خوش‌صحبت و انعطاف‌پذیر؛ ذهنی پویا و اجتماعی.' },
  { key: 'cancer', name: 'سرطان (خرچنگ)', emoji: '♋', element: 'آب', from: [6, 21], to: [7, 22], traits: 'احساساتی، حمایت‌گر و خانواده‌دوست؛ شهودی و مهربان.' },
  { key: 'leo', name: 'اسد (شیر)', emoji: '♌', element: 'آتش', from: [7, 23], to: [8, 22], traits: 'باکاریزما، سخاوتمند و مطمئن؛ عاشق درخشیدن و رهبری.' },
  { key: 'virgo', name: 'سنبله (خوشه)', emoji: '♍', element: 'خاک', from: [8, 23], to: [9, 22], traits: 'دقیق، منطقی و نظم‌گرا؛ به جزئیات و کمال اهمیت می‌دهد.' },
  { key: 'libra', name: 'میزان (ترازو)', emoji: '♎', element: 'باد', from: [9, 23], to: [10, 22], traits: 'متعادل، دیپلمات و زیبایی‌دوست؛ به‌دنبال عدالت و هماهنگی.' },
  { key: 'scorpio', name: 'عقرب (کژدم)', emoji: '♏', element: 'آب', from: [10, 23], to: [11, 21], traits: 'ژرف، پرشور و بااراده؛ شهودی و رازنگه‌دار.' },
  { key: 'sagittarius', name: 'قوس (کمان)', emoji: '♐', element: 'آتش', from: [11, 22], to: [12, 21], traits: 'آزاد، ماجراجو و خوش‌بین؛ عاشق سفر و دانش.' },
  { key: 'capricorn', name: 'جدی (بز)', emoji: '♑', element: 'خاک', from: [12, 22], to: [1, 19], traits: 'جاه‌طلب، منضبط و مسئول؛ با پشتکار به قله می‌رسد.' },
  { key: 'aquarius', name: 'دلو (آبریز)', emoji: '♒', element: 'باد', from: [1, 20], to: [2, 18], traits: 'نوآور، مستقل و انسان‌دوست؛ ایده‌های پیشرو دارد.' },
  { key: 'pisces', name: 'حوت (ماهی)', emoji: '♓', element: 'آب', from: [2, 19], to: [3, 20], traits: 'خیال‌پرداز، هنرمند و دلسوز؛ حساس و ژرف‌اندیش.' },
];

function signForDate(gm: number, gd: number): Sign {
  for (const s of SIGNS) {
    const [fm, fd] = s.from;
    const [tm, td] = s.to;
    if (fm === gm && gd >= fd) return s;
    if (tm === gm && gd <= td) return s;
  }
  return SIGNS[9]; // جدی (بازهٔ گذر از سال)
}

// سازگاری بر پایهٔ عنصر: هم‌عنصر و عناصر مکمل (آتش↔باد، خاک↔آب) سازگارترند.
function compatibility(a: Element, b: Element): { score: number; text: string } {
  const complement: Record<Element, Element> = { آتش: 'باد', باد: 'آتش', خاک: 'آب', آب: 'خاک' };
  if (a === b) return { score: 90, text: 'هم‌عنصر و بسیار هماهنگ؛ درک متقابل بالایی دارید.' };
  if (complement[a] === b) return { score: 80, text: 'عناصر مکمل؛ یکدیگر را تقویت می‌کنید و رابطه‌ای پویا دارید.' };
  return { score: 55, text: 'عناصر متفاوت؛ نیاز به گفت‌وگو و درک بیشتر، اما جذابیت تضادها برقرار است.' };
}

export default function BorjTavalod() {
  const [date, setDate] = useState<PDate | null>(null);
  const [partner, setPartner] = useState<string>('');

  const sign = useMemo(() => (date ? signForDate(date.gm, date.gd) : null), [date]);
  const partnerSign = useMemo(() => SIGNS.find((s) => s.key === partner) ?? null, [partner]);

  const compat = useMemo(() => {
    if (!sign || !partnerSign) return null;
    return compatibility(sign.element, partnerSign.element);
  }, [sign, partnerSign]);

  return (
    <ToolShell
      title="طالع‌بینی برج تولد"
      subtitle="برج فلکی خود را از روی تاریخ تولد بیابید و سازگاری‌اش را با برج‌های دیگر بسنجید"
      icon={Star}
      accent={ACCENT}
      info={[
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'برج فلکی چیست؟',
          body: 'برج فلکی (طالع خورشیدی) بر اساس موقعیت خورشید در منطقةالبروج هنگام تولد تعیین می‌شود و هر برج به یکی از چهار عنصر آتش، خاک، باد یا آب نسبت داده می‌شود.',
        },
        {
          icon: <Heart className="w-4 h-4" />,
          title: 'سازگاری برج‌ها',
          body: 'در طالع‌بینی رایج، برج‌های هم‌عنصر و عناصر مکمل (آتش با باد، خاک با آب) سازگارتر در نظر گرفته می‌شوند. این صرفاً یک سنّت فرهنگی برای سرگرمی است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'سرگرمی، نه علم',
          body: 'طالع‌بینی مبنای علمی ندارد و این ابزار تنها برای آشنایی و تفریح طراحی شده است.',
        },
      ]}
      disclaimer="طالع‌بینی جنبهٔ سرگرمی و فرهنگی دارد و مبنای علمی ندارد. نتایج این ابزار را جدی و قطعی تلقی نکنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="تاریخ تولد" hint="تاریخ تولد خود را به شمسی انتخاب کنید">
            <PersianDatePicker
              value={date}
              onChange={setDate}
              placeholder="انتخاب تاریخ تولد"
              ariaLabel="تاریخ تولد"
              clearable
              onClear={() => setDate(null)}
            />
          </Field>

          <Field label="سازگاری با برج (اختیاری)" hint="برای سنجش سازگاری، برج طرف مقابل را انتخاب کنید">
            <Select value={partner} onChange={setPartner} ariaLabel="برج طرف مقابل">
              <option value="">— انتخاب برج —</option>
              {SIGNS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!sign ? (
              <EmptyState accent={ACCENT} icon={<Star className="w-6 h-6" />}>
                تاریخ تولد خود را انتخاب کنید تا برج فلکی شما مشخص شود.
              </EmptyState>
            ) : (
              <motion.div
                key={sign.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="text-7xl">{sign.emoji}</div>
                <div>
                  <p className="font-display text-sm text-muted-foreground">برج فلکی شما</p>
                  <p className="font-display text-3xl font-black" style={{ color: `rgb(${ACCENT})` }}>
                    {sign.name}
                  </p>
                </div>
                <div className="space-y-2.5 text-right">
                  <Row label="عنصر" value={sign.element} strong />
                </div>
                <p className="font-sans text-sm leading-relaxed text-foreground/80 text-right">
                  {sign.traits}
                </p>

                {compat && partnerSign && (
                  <div className="rounded-2xl border border-border bg-background/40 p-4 text-right">
                    <p className="mb-2 flex items-center gap-2 font-display text-sm font-black text-foreground">
                      <Heart className="h-4 w-4" style={{ color: `rgb(${ACCENT})` }} />
                      سازگاری با {partnerSign.name}
                    </p>
                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${compat.score}%`, background: `rgb(${ACCENT})` }}
                      />
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-muted-foreground">{compat.text}</p>
                  </div>
                )}

                <Notice accent={ACCENT}>طالع‌بینی صرفاً جنبهٔ سرگرمی دارد.</Notice>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
