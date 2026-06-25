'use client';

import React, { useState } from 'react';
import { FileText, Type, Sparkles, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  SelectField,
  Stepper,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  CopyButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet — must equal the `accent` in tools.ts

type LoremUnit = 'paragraph' | 'sentence' | 'word';

const UNIT_LABEL: Record<LoremUnit, string> = {
  paragraph: 'پاراگراف',
  sentence: 'جمله',
  word: 'کلمه',
};

// بانک واژگان پرکاربرد فارسی برای تولید متن نمونه (~۶۰ واژه)
const WORDS = [
  'و', 'در', 'به', 'از', 'که', 'این', 'را', 'با', 'برای', 'یک',
  'متن', 'نمونه', 'طراحی', 'صفحه', 'گرافیک', 'چاپ', 'حروف', 'چین',
  'سطر', 'سفارش', 'زبان', 'موجود', 'شرایط', 'فعلی', 'تکنولوژی', 'مورد',
  'نیاز', 'کاربرد', 'فراوان', 'جامعه', 'فرهنگ', 'پیشرو', 'مجله', 'دنیای',
  'موجب', 'تغییرات', 'گسترده', 'فناوری', 'اطلاعات', 'دانش', 'افزایش',
  'کیفیت', 'محتوا', 'ساختار', 'مفهوم', 'ابزار', 'کاربردی', 'سادگی',
  'خوانایی', 'تجربه', 'مخاطب', 'هدف', 'پروژه', 'ایده', 'خلاقیت', 'رنگ',
  'فضا', 'تعادل', 'هماهنگی', 'نظم', 'الگو',
];

const pick = (n: number) => WORDS[Math.floor(Math.random() * n)];

function makeSentence(): string {
  const len = 6 + Math.floor(Math.random() * 9); // ۶ تا ۱۴ کلمه
  const parts: string[] = [];
  for (let i = 0; i < len; i++) parts.push(pick(WORDS.length));
  const s = parts.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

function makeParagraph(): string {
  const len = 3 + Math.floor(Math.random() * 4); // ۳ تا ۶ جمله
  const sentences: string[] = [];
  for (let i = 0; i < len; i++) sentences.push(makeSentence());
  return sentences.join(' ');
}

function generate(unit: LoremUnit, count: number): string {
  if (unit === 'word') {
    const parts: string[] = [];
    for (let i = 0; i < count; i++) parts.push(pick(WORDS.length));
    const s = parts.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  if (unit === 'sentence') {
    const parts: string[] = [];
    for (let i = 0; i < count; i++) parts.push(makeSentence());
    return parts.join(' ');
  }
  const parts: string[] = [];
  for (let i = 0; i < count; i++) parts.push(makeParagraph());
  return parts.join('\n\n');
}

export default function LoremFarsi() {
  const [unit, setUnit] = useState<LoremUnit>('paragraph');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState<string | null>(null);
  const { share, copied } = useShareResult();

  const wordCount = output
    ? output.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // تولید فقط هنگام کلیک کاربر؛ از Math.random در زمان رندر/SSR پرهیز می‌شود.
  const onGenerate = () => setOutput(generate(unit, count));

  const onShare = () => {
    if (!output) return;
    share({
      title: 'مولد لورم ایپسوم فارسی',
      text: output,
    });
  };

  return (
    <ToolShell
      title="مولد لورم ایپسوم فارسی"
      subtitle="تولید متن نمونهٔ فارسی برای طراحی و صفحه‌آرایی"
      icon={FileText}
      accent={ACCENT}
      info={[
        {
          icon: <Type className="w-4 h-4" />,
          title: 'متن جانمایی',
          body: 'متن نمونه (placeholder) جای محتوای واقعی را در طرح‌های گرافیکی و قالب‌ها پر می‌کند تا چیدمان و خوانایی بدون وابستگی به محتوا ارزیابی شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'کاملاً آفلاین',
          body: 'تمام واژگان از یک بانک کلمات داخلی انتخاب می‌شوند و هیچ داده‌ای ارسال یا دریافت نمی‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-5">
          <SelectField
            icon={<FileText className="w-4 h-4" />}
            label="واحد تولید"
            hint="متن بر اساس پاراگراف، جمله یا کلمه ساخته می‌شود."
            value={unit}
            onChange={(v) => setUnit(v as LoremUnit)}
          >
            <option value="paragraph">پاراگراف</option>
            <option value="sentence">جمله</option>
            <option value="word">کلمه</option>
          </SelectField>

          <Stepper
            label={`تعداد ${UNIT_LABEL[unit]}`}
            value={count}
            onChange={setCount}
            min={1}
            max={50}
            hint="بین ۱ تا ۵۰"
          />

          <button
            onClick={onGenerate}
            aria-label="تولید متن نمونه"
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display transition-all active:scale-[0.99]"
            style={{
              background: `rgba(${ACCENT}, 0.12)`,
              color: `rgb(${ACCENT})`,
              border: `1px solid rgba(${ACCENT}, 0.28)`,
            }}
          >
            <Sparkles className="w-4 h-4" /> تولید متن نمونه
          </button>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!output ? (
              <EmptyState accent={ACCENT} icon={<FileText className="w-6 h-6" />}>
                واحد و تعداد را انتخاب کنید و روی «تولید متن نمونه» بزنید.
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <Headline
                    accent={ACCENT}
                    label="تعداد کلمات"
                    value={faNum(fmtNum(wordCount, 0))}
                  />
                  <CopyButton accent={ACCENT} text={output} />
                </div>

                <div
                  dir="rtl"
                  className="max-h-[320px] overflow-y-auto rounded-2xl border-2 border-border bg-background p-4 font-sans text-base leading-loose text-right text-foreground whitespace-pre-wrap"
                >
                  {output}
                </div>

                <div className="space-y-2.5">
                  <Row label="واحد" value={UNIT_LABEL[unit]} />
                  <Row label="تعداد" value={faNum(fmtNum(count, 0))} strong />
                </div>

                <Notice accent={ACCENT}>
                  هر بار تولید، ترکیب تازه‌ای از واژگان فارسی می‌سازد؛ متن صرفاً برای جانمایی است و معنای مشخصی ندارد.
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
