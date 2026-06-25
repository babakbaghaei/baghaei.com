'use client';

import React, { useState, useMemo } from 'react';
import { Type, Sparkles, Hash, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Toggle,
  Row,
  EmptyState,
  Notice,
  CopyButton,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet-500

const ZWNJ = '‌'; // نیم‌فاصله

type DigitMode = 'none' | 'fa' | 'en';

const DIGIT_MODES: { value: DigitMode; label: string }[] = [
  { value: 'none', label: 'بدون تغییر اعداد' },
  { value: 'fa', label: 'تبدیل اعداد به فارسی' },
  { value: 'en', label: 'تبدیل اعداد به انگلیسی' },
];

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const toFaDigits = (s: string) =>
  s.replace(/[0-9]/g, (d) => FA_DIGITS[+d]).replace(/[٠-٩]/g, (d) => FA_DIGITS[AR_DIGITS.indexOf(d)]);

const toEnDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

// پسوندهای رایجی که با نیم‌فاصله می‌چسبند
const SUFFIXES = ['ها', 'های', 'هایی', 'تر', 'تری', 'ترین', 'ام', 'ات', 'اش', 'مان', 'تان', 'شان'];

function normalize(input: string, digitMode: DigitMode): string {
  let t = input;

  // ۱) یکدست‌سازی حروف عربی به فارسی
  t = t.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/ۀ/g, 'هٔ').replace(/ة/g, 'ه');

  // ۲) یکدست‌سازی فاصله‌ها: انواع فاصلهٔ یونیکد به فاصلهٔ ساده
  t = t.replace(/[  -   　]/g, ' ');

  // ۳) پیشوند «می» و «نمی» با نیم‌فاصله به فعل بعدی می‌چسبند
  t = t.replace(/(^|[\s(«"'])(ن?می)\s+(?=\S)/g, `$1$2${ZWNJ}`);

  // ۴) پسوندهای رایج: فاصلهٔ پیش از پسوند به نیم‌فاصله تبدیل می‌شود
  for (const suf of SUFFIXES) {
    t = t.replace(new RegExp(`(\\S)\\s+(${suf})(?=$|[\\s.,،!?؛:)»"'])`, 'g'), `$1${ZWNJ}$2`);
  }

  // ۵) حذف نیم‌فاصله‌های تکراری یا نابه‌جا (کنار فاصله/ابتدا/انتهای واژه)
  t = t.replace(new RegExp(`${ZWNJ}{2,}`, 'g'), ZWNJ);
  t = t.replace(new RegExp(`\\s${ZWNJ}|${ZWNJ}\\s`, 'g'), ' ');

  // ۶) حذف فاصلهٔ پیش از علائم نگارشی و افزودن یک فاصله پس از آن
  t = t.replace(/\s+([.,،!?؛:؟])/g, '$1');

  // ۷) جمع‌کردن فاصله‌های پیاپی و خطوط خالی اضافی
  t = t.replace(/[ \t]{2,}/g, ' ');
  t = t.replace(/ *\n */g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');

  // ۸) تبدیل اختیاری اعداد
  if (digitMode === 'fa') t = toFaDigits(t);
  else if (digitMode === 'en') t = toEnDigits(t);

  // ۹) حذف فاصله/خط خالی ابتدا و انتها
  return t.trim();
}

const countWords = (s: string) => {
  const trimmed = s.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
};

export default function NimFasele() {
  const [text, setText] = useState('');
  const [digitMode, setDigitMode] = useState<DigitMode>('none');

  const output = useMemo(() => normalize(text, digitMode), [text, digitMode]);

  const stats = useMemo(() => {
    const zwnjCount = (output.match(new RegExp(ZWNJ, 'g')) || []).length;
    return {
      words: countWords(output),
      chars: output.length,
      zwnj: zwnjCount,
    };
  }, [output]);

  const inputClass =
    'w-full bg-background border-2 border-border rounded-2xl p-4 font-sans text-base leading-relaxed text-right focus:border-primary outline-none transition-all resize-y min-h-[260px] text-foreground placeholder:text-muted-foreground/50';

  const hasOutput = output.trim() !== '';

  return (
    <ToolShell
      title="اصلاح نیم‌فاصله و متن فارسی"
      subtitle="نرمال‌سازی لحظه‌ای متن فارسی: نیم‌فاصله، حروف عربی، فاصله‌های اضافی و اعداد"
      icon={Type}
      accent={ACCENT}
      info={[
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'اصلاح خودکار',
          body: 'حروف عربی «ي» و «ك» به «ی» و «ک» تبدیل می‌شوند، پیشوند «می/نمی» و پسوندهای رایج مانند «‌ها»، «‌تر» و «‌ترین» با نیم‌فاصله به واژه می‌چسبند و فاصله‌های اضافی حذف می‌شود.',
        },
        {
          icon: <Hash className="w-4 h-4" />,
          title: 'یکدست‌سازی اعداد',
          body: 'با انتخاب حالت اعداد می‌توانید تمام ارقام متن را به فارسی یا انگلیسی یکدست کنید؛ به‌صورت پیش‌فرض اعداد بدون تغییر می‌مانند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'تمام پردازش به‌صورت آفلاین و در مرورگر شما انجام می‌شود و هیچ داده‌ای ارسال نمی‌شود. برای متن‌های تخصصی، خروجی را پیش از استفاده بازبینی کنید.',
        },
      ]}
      disclaimer="اصلاح نیم‌فاصله بر پایهٔ الگوهای پرکاربرد زبان فارسی انجام می‌شود و ممکن است در موارد نادر نیاز به ویرایش دستی داشته باشد."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <label htmlFor="nf-text" className="text-sm font-bold font-display text-foreground">
            متن فارسی خود را وارد کنید
          </label>
          <textarea
            id="nf-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="rtl"
            rows={12}
            placeholder="متن را اینجا بنویسید یا بچسبانید…"
            aria-label="متن ورودی فارسی"
            className={inputClass}
          />

          <div className="space-y-2.5">
            {DIGIT_MODES.map((m) => (
              <Toggle
                key={m.value}
                label={m.label}
                checked={digitMode === m.value}
                onChange={() => setDigitMode(m.value)}
              />
            ))}
          </div>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!hasOutput ? (
              <EmptyState accent={ACCENT} icon={<Type className="w-6 h-6" />}>
                متنی برای اصلاح وارد کنید.
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
                      متن اصلاح‌شده
                    </span>
                    <CopyButton accent={ACCENT} text={output} />
                  </div>
                  <div
                    dir="rtl"
                    className="w-full bg-background border-2 border-border rounded-2xl p-4 font-sans text-base leading-relaxed text-right whitespace-pre-wrap break-words max-h-[320px] overflow-auto text-foreground"
                  >
                    {output}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Row label="تعداد کلمات" value={faNum(fmtNum(stats.words, 0))} />
                  <Row label="تعداد کاراکتر" value={faNum(fmtNum(stats.chars, 0))} />
                  <Row label="نیم‌فاصله‌های افزوده‌شده" value={faNum(fmtNum(stats.zwnj, 0))} strong />
                </div>

                <Notice accent={ACCENT}>
                  خروجی به‌صورت زنده محاسبه می‌شود؛ با کلید «کپی» می‌توانید متن اصلاح‌شده را همراه با نیم‌فاصله‌ها بردارید.
                </Notice>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
