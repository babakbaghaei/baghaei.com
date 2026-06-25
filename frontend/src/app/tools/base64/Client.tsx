'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Binary, ArrowRightLeft, ShieldCheck, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  SelectField,
  Row,
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

const ACCENT = '99, 102, 241'; // ایندیگو — مطابق رنگ دستهٔ «توسعه‌دهندگان»

type Mode = 'encode' | 'decode';

const MODES: { value: Mode; label: string }[] = [
  { value: 'encode', label: 'رمزگذاری (متن ← Base64)' },
  { value: 'decode', label: 'رمزگشایی (Base64 ← متن)' },
];

/**
 * رمزگذاری ایمن برای یونیکد: متن ابتدا با TextEncoder به بایت‌های UTF-8 تبدیل
 * می‌شود، سپس هر بایت به یک کاراکتر تک‌بایتی نگاشت می‌شود تا btoa بدون خطای
 * «character out of range» روی متن فارسی نیز کار کند.
 */
const encodeBase64 = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

/**
 * رمزگشایی ایمن برای یونیکد: atob رشتهٔ تک‌بایتی برمی‌گرداند که دوباره به آرایهٔ
 * بایت و سپس با TextDecoder به متن UTF-8 تبدیل می‌شود. فاصله و خطوط جدید پیش از
 * پردازش حذف می‌شوند. ورودی نامعتبر با خطای قابل‌فهم گزارش می‌شود.
 */
const decodeBase64 = (input: string): string => {
  const cleaned = input.replace(/\s+/g, '');
  if (cleaned === '') return '';
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new Error('ورودی یک رشتهٔ Base64 معتبر نیست؛ تنها حروف A تا Z، اعداد و نویسه‌های + / = مجازند.');
  }
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
};

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [text, setText] = useState('');
  const { share, copied } = useShareResult();

  // در صورت اشتراک‌گذاری با ?mode=..&t=..، وضعیت از روی نشانی بازسازی می‌شود.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const md = p.get('mode');
    if (md && MODES.some((m) => m.value === md)) setMode(md as Mode);
    const t = p.get('t');
    if (t) setText(t);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const result = useMemo(() => {
    const src = text.trim();
    if (!src) return null;
    try {
      const output = mode === 'encode' ? encodeBase64(text) : decodeBase64(text);
      if (output === '') return null;
      return {
        output,
        bytes: new TextEncoder().encode(mode === 'encode' ? text : output).length,
        inLen: text.length,
        outLen: output.length,
      };
    } catch (e) {
      return {
        error:
          e instanceof Error && e.message
            ? e.message
            : 'رمزگشایی ناموفق بود؛ ورودی یک رشتهٔ Base64 معتبر نیست.',
      };
    }
  }, [mode, text]);

  const onShare = () => {
    if (!result || result.error || !result.output) return;
    share({
      title: 'مبدل Base64',
      text: result.output,
      params: { mode, t: text },
    });
  };

  // متن ورودی در حالت رمزگذاری ممکن است فارسی باشد و در حالت رمزگشایی همیشه لاتین.
  const inputDir = mode === 'encode' ? 'rtl' : 'ltr';
  const inputAlign = mode === 'encode' ? 'text-right' : 'text-left';

  // خروجی رمزگذاری همیشه لاتین (Base64) و خروجی رمزگشایی می‌تواند فارسی باشد.
  const outputDir = mode === 'encode' ? 'ltr' : 'rtl';
  const outputAlign = mode === 'encode' ? 'text-left' : 'text-right';

  const inputClass = `w-full bg-background border-2 border-border rounded-2xl p-4 font-sans text-base leading-relaxed ${inputAlign} focus:border-primary outline-none transition-all resize-y min-h-[260px] text-foreground placeholder:text-muted-foreground/50`;

  return (
    <ToolShell
      title="مبدل Base64"
      subtitle="رمزگذاری و رمزگشایی متن به/از Base64 با پشتیبانی کامل از یونیکد"
      icon={Binary}
      accent={ACCENT}
      info={[
        {
          icon: <ArrowRightLeft className="w-4 h-4" />,
          title: 'رمزگذاری و رمزگشایی',
          body: 'در حالت رمزگذاری، متن به رشتهٔ Base64 تبدیل می‌شود و در حالت رمزگشایی، رشتهٔ Base64 به متن اصلی بازگردانده می‌شود. کاربرد رایج: جاسازی داده در URL، توکن‌ها و فایل‌های پیکربندی.',
        },
        {
          icon: <ShieldCheck className="w-4 h-4" />,
          title: 'پشتیبانی از یونیکد',
          body: 'پردازش بر پایهٔ UTF-8 انجام می‌شود؛ بنابراین متن فارسی، اموجی و هر نویسهٔ یونیکد بدون خطا و بدون خرابی رمزگذاری و رمزگشایی می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'Base64 رمزنگاری نیست و امنیت ایجاد نمی‌کند؛ تنها نمایشی متنی از داده است. تمام پردازش به‌صورت آفلاین و در مرورگر شما انجام می‌شود و هیچ داده‌ای ارسال نمی‌شود.',
        },
      ]}
      disclaimer="Base64 یک روش رمزگذاری (encoding) است نه رمزنگاری (encryption)؛ برای محافظت از داده‌های حساس به آن تکیه نکنید."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <SelectField
            label="حالت تبدیل"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            icon={<ArrowRightLeft className="w-4 h-4" />}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </SelectField>

          <label htmlFor="b64-in" className="text-sm font-bold font-display text-foreground">
            {mode === 'encode' ? 'متن ورودی' : 'رشتهٔ Base64'}
          </label>
          <textarea
            id="b64-in"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir={inputDir}
            rows={12}
            placeholder={mode === 'encode' ? 'متن را اینجا بنویسید یا بچسبانید…' : 'U2FsYW0g2K/Yp9mG2KfYjQ=='}
            aria-label={mode === 'encode' ? 'متن ورودی برای رمزگذاری' : 'رشتهٔ Base64 برای رمزگشایی'}
            className={inputClass}
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!result ? (
              <EmptyState accent={ACCENT} icon={<Binary className="w-6 h-6" />}>
                {mode === 'encode'
                  ? 'متنی برای رمزگذاری وارد کنید.'
                  : 'رشتهٔ Base64 را برای رمزگشایی وارد کنید.'}
              </EmptyState>
            ) : result.error ? (
              <motion.div
                key="e"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[200px] flex items-center justify-center"
              >
                <p className="text-sm text-muted-foreground text-center leading-relaxed px-4">
                  {result.error}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
                      {mode === 'encode' ? 'خروجی Base64' : 'متن رمزگشایی‌شده'}
                    </span>
                    <CopyButton accent={ACCENT} text={result.output ?? ''} />
                  </div>
                  <div
                    dir={outputDir}
                    className={`w-full rounded-2xl p-4 font-sans text-base leading-loose ${outputAlign} whitespace-pre-wrap break-all min-h-[180px] max-h-[320px] overflow-auto text-foreground`}
                    style={{
                      background: `rgba(${ACCENT}, 0.06)`,
                      border: `1px solid rgba(${ACCENT}, 0.18)`,
                    }}
                  >
                    {result.output}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Row label="طول ورودی" value={`${faNum(fmtNum(result.inLen ?? 0, 0))} نویسه`} />
                  <Row label="طول خروجی" value={`${faNum(fmtNum(result.outLen ?? 0, 0))} نویسه`} />
                  <Row label="حجم داده" value={`${faNum(fmtNum(result.bytes ?? 0, 0))} بایت`} strong />
                </div>

                <Notice accent={ACCENT}>
                  پردازش بر پایهٔ UTF-8 انجام می‌شود؛ متن فارسی و اموجی بدون خطا رمزگذاری و رمزگشایی می‌شوند. فاصله و خطوط جدید در ورودیِ رمزگشایی نادیده گرفته می‌شوند.
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
