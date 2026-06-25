'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Languages, Type, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Notice,
  ShareButton,
  CopyButton,
  useShareResult,
  AnimatePresence,
  motion,
} from '@/components/tools/shell';

const ACCENT = '99, 102, 241'; // ایندیگو — مطابق رنگ دستهٔ «متن و محتوا»

/**
 * نگاشت آوایی پینگلیش (فارسی با حروف لاتین) به خط فارسی.
 * ترتیب پردازش حیاتی است: ابتدا چندحرفی‌های بلندتر، سپس تک‌حرف‌ها؛
 * در غیر این صورت «kh» پیش از رسیدن به نگاشت «خ» به «ک»+«ه» شکسته می‌شود.
 * این تبدیل تقریبی و بر پایهٔ تلفظ است و املای دقیق را تضمین نمی‌کند.
 */
const DIGRAPHS: [string, string][] = [
  // خوشه‌های سه/دوحرفی پرکاربرد
  ['kh', 'خ'],
  ['gh', 'ق'],
  ['sh', 'ش'],
  ['ch', 'چ'],
  ['zh', 'ژ'],
  ['ph', 'ف'],
  ['ck', 'ک'],
  // واکه‌های کشیده
  ['aa', 'ا'],
  ['ee', 'ی'],
  ['ei', 'ی'],
  ['ey', 'ی'],
  ['oo', 'و'],
  ['ou', 'و'],
  ['ow', 'و'],
];

const SINGLES: Record<string, string> = {
  a: 'ا',
  b: 'ب',
  c: 'ک',
  d: 'د',
  e: 'ه',
  f: 'ف',
  g: 'گ',
  h: 'ه',
  i: 'ی',
  j: 'ج',
  k: 'ک',
  l: 'ل',
  m: 'م',
  n: 'ن',
  o: 'و',
  p: 'پ',
  q: 'ق',
  r: 'ر',
  s: 'س',
  t: 'ت',
  u: 'و',
  v: 'و',
  w: 'و',
  x: 'کس',
  y: 'ی',
  z: 'ز',
  "'": 'ع',
};

const transliterate = (input: string): string => {
  let out = '';
  let i = 0;
  const lower = input.toLowerCase();

  while (i < lower.length) {
    const ch = lower[i];

    // حروف غیرلاتین (فاصله، نشانه‌گذاری، ارقام، فارسی موجود) را دست‌نخورده عبور می‌دهیم
    if (!/[a-z']/.test(ch)) {
      out += input[i];
      i++;
      continue;
    }

    // تطبیق چندحرفی‌ها (طولانی‌ترین تطبیق ممکن)
    let matched = false;
    for (const [pat, rep] of DIGRAPHS) {
      if (lower.startsWith(pat, i)) {
        out += rep;
        i += pat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // تک‌حرف
    out += SINGLES[ch] ?? input[i];
    i++;
  }

  return out;
};

export default function PinglishBeFarsi() {
  const [text, setText] = useState('');
  const { share, copied } = useShareResult();

  // در صورت اشتراک‌گذاری با ?t=..، وضعیت از روی نشانی بازسازی می‌شود.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('t');
    if (t) setText(t);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const result = useMemo(() => {
    const src = text.trim();
    if (!src) return null;
    return transliterate(text);
  }, [text]);

  const onShare = () => {
    if (!result) return;
    share({
      title: 'مبدل پینگلیش به فارسی',
      text: result,
      params: { t: text },
    });
  };

  return (
    <ToolShell
      title="مبدل پینگلیش به فارسی"
      subtitle="تبدیل متن فینگلیش (فارسی با حروف لاتین) به خط فارسی بر پایهٔ نگاشت آوایی"
      icon={Languages}
      accent={ACCENT}
      info={[
        {
          icon: <Type className="w-4 h-4" />,
          title: 'نگاشت آوایی',
          body: 'هر حرف یا ترکیب لاتین بر اساس تلفظ به نزدیک‌ترین حرف فارسی نگاشت می‌شود؛ خوشه‌هایی مانند kh، gh، sh، ch و zh پیش از تک‌حرف‌ها بررسی می‌شوند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'تبدیل تقریبی',
          body: 'این تبدیل بر پایهٔ تلفظ است و املای دقیق را تضمین نمی‌کند؛ نتیجه را پیش از استفاده بازبینی کنید. تمام پردازش آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
      disclaimer="فارسی نوشتاری با حروف لاتین قاعدهٔ یکتا ندارد؛ خروجی این ابزار بهترین حدسِ آوایی است و ممکن است نیاز به ویرایش دستی داشته باشد."
    >
      <TwoPane>
        <Panel className="space-y-4">
          <label
            htmlFor="pinglish-in"
            className="text-sm font-bold font-display text-foreground"
          >
            متن فینگلیش (با حروف لاتین)
          </label>
          <textarea
            id="pinglish-in"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="ltr"
            rows={12}
            placeholder="salam khoobi? chetori?"
            aria-label="متن فینگلیش ورودی"
            className="w-full bg-background border-2 border-border rounded-2xl p-4 font-sans text-base leading-relaxed text-left focus:border-primary outline-none transition-all resize-y min-h-[260px] text-foreground placeholder:text-muted-foreground/50"
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[260px] flex flex-col items-center justify-center text-center gap-3"
              >
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
                  style={{
                    background: `rgba(${ACCENT}, 0.1)`,
                    color: `rgb(${ACCENT})`,
                  }}
                >
                  <Languages className="w-6 h-6" />
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  متن فینگلیش را در کادر سمت چپ بنویسید تا برگردان فارسی آن این‌جا نمایش داده شود.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
                    برگردان فارسی
                  </span>
                  <CopyButton accent={ACCENT} text={result} />
                </div>

                <div
                  dir="rtl"
                  className="w-full rounded-2xl p-4 font-sans text-base leading-loose text-right whitespace-pre-wrap break-words min-h-[180px] text-foreground"
                  style={{
                    background: `rgba(${ACCENT}, 0.06)`,
                    border: `1px solid rgba(${ACCENT}, 0.18)`,
                  }}
                >
                  {result}
                </div>

                <Notice accent={ACCENT}>
                  خوشه‌های kh→خ، gh/q→ق، sh→ش، ch→چ، zh→ژ، aa→ا، ee→ی و oo→و پیش از تک‌حرف‌ها نگاشت می‌شوند؛ نتیجه تقریبی است.
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
