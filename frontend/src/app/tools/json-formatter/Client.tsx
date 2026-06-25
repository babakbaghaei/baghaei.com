'use client';

import React, { useState, useMemo } from 'react';
import { Braces, Sparkles, Minimize2, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Row,
  Headline,
  EmptyState,
  Notice,
  CopyButton,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
} from '@/components/tools/shell';

const ACCENT = '99, 102, 241'; // indigo-500

type Action = 'beautify' | 'minify' | 'validate';

interface ParsedOk {
  ok: true;
  action: Action;
  output: string;
  size: number; // characters of output
  chars: number; // characters of input
  lines: number; // lines of input
}

interface ParsedErr {
  ok: false;
  message: string; // raw error message from JSON.parse
}

type Result = ParsedOk | ParsedErr;

/**
 * تلاش برای استخراج موقعیت خطا (position) از پیام مرورگر و تبدیل آن به شماره
 * خط/ستون تا کاربر سریع‌تر محل ایراد را در متن پیدا کند. اگر موقعیت قابل
 * استخراج نبود، فقط پیام خام بازگردانده می‌شود.
 */
const describeError = (raw: string, source: string): string => {
  const m = raw.match(/position\s+(\d+)/i);
  if (!m) return raw;
  const pos = Number(m[1]);
  const upto = source.slice(0, pos);
  const line = upto.split('\n').length;
  const col = pos - upto.lastIndexOf('\n');
  return `${raw} — خط ${faNum(String(line))}، ستون ${faNum(String(col))}`;
};

export default function JsonFormatter() {
  const [text, setText] = useState('');
  const [action, setAction] = useState<Action | null>(null);

  const result = useMemo<Result | null>(() => {
    if (!action) return null;
    const src = text.trim();
    if (!src) return null;
    let value: unknown;
    try {
      value = JSON.parse(src);
    } catch (e) {
      return { ok: false, message: describeError((e as Error).message, src) };
    }
    const output =
      action === 'minify'
        ? JSON.stringify(value)
        : action === 'beautify'
          ? JSON.stringify(value, null, 2)
          : src;
    return {
      ok: true,
      action,
      output,
      size: output.length,
      chars: text.length,
      lines: text.split(/\n/).length,
    };
  }, [action, text]);

  const actionLabel: Record<Action, string> = {
    beautify: 'مرتب‌سازی',
    minify: 'فشرده‌سازی',
    validate: 'اعتبارسنجی',
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-2xl p-4 font-mono text-sm leading-relaxed focus:border-primary outline-none transition-all resize-y min-h-[300px] text-foreground placeholder:text-muted-foreground/50';

  const outputClass =
    'w-full bg-background border-2 border-border rounded-2xl p-4 font-mono text-xs leading-relaxed text-foreground overflow-auto max-h-[260px] whitespace-pre';

  return (
    <ToolShell
      title="فرمت و اعتبارسنجی JSON"
      subtitle="مرتب‌سازی، فشرده‌سازی و بررسی صحت JSON با نمایش خطای دقیق"
      icon={Braces}
      accent={ACCENT}
      info={[
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'مرتب‌سازی (Beautify)',
          body: 'ساختار JSON را با تورفتگی دو فاصله بازنویسی می‌کند تا خوانایی کد بالا رود؛ مناسب بررسی پاسخ APIها و فایل‌های پیکربندی.',
        },
        {
          icon: <Minimize2 className="w-4 h-4" />,
          title: 'فشرده‌سازی (Minify)',
          body: 'تمام فاصله‌ها و خطوط اضافه را حذف می‌کند تا حجم خروجی کمینه شود؛ مناسب ذخیره یا انتقال داده.',
        },
        {
          icon: <ShieldCheck className="w-4 h-4" />,
          title: 'اعتبارسنجی (Validate)',
          body: 'صحت ساختار JSON را بررسی و در صورت وجود ایراد، پیام خطا را به همراه شمارهٔ خط و ستون نمایش می‌دهد.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'تمام پردازش به‌صورت آفلاین و درون مرورگر شما انجام می‌شود و هیچ داده‌ای ارسال نمی‌گردد.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-4">
          <label htmlFor="json-input" className="text-sm font-bold font-display text-foreground">
            کد JSON خود را وارد کنید
          </label>
          <textarea
            id="json-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (action) setAction(null);
            }}
            dir="ltr"
            rows={14}
            spellCheck={false}
            placeholder={'{\n  "name": "باقایی",\n  "active": true\n}'}
            aria-label="ورودی JSON"
            className={inputClass}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['beautify', 'minify', 'validate'] as const).map((act) => (
              <button
                key={act}
                onClick={() => setAction(act)}
                disabled={!text.trim()}
                aria-label={actionLabel[act]}
                className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black font-display transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `rgba(${ACCENT}, ${action === act ? 0.18 : 0.1})`,
                  color: `rgb(${ACCENT})`,
                  border: `1px solid rgba(${ACCENT}, 0.25)`,
                }}
              >
                {act === 'beautify' ? (
                  <Sparkles className="w-4 h-4" />
                ) : act === 'minify' ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {actionLabel[act]}
              </button>
            ))}
          </div>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!result ? (
              <EmptyState accent={ACCENT} icon={<Braces className="w-6 h-6" />}>
                کد JSON را وارد و یکی از عملیات را انتخاب کنید.
              </EmptyState>
            ) : result.ok === false ? (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="flex flex-col items-center justify-center text-center gap-3 text-destructive min-h-[160px]">
                  <AlertTriangle className="w-8 h-8" />
                  <span className="font-black font-display text-sm">JSON نامعتبر است</span>
                  <p dir="ltr" className="text-xs text-muted-foreground font-mono leading-relaxed break-words px-2">
                    {result.message}
                  </p>
                </div>
                <Notice accent={ACCENT}>
                  محل خطا را در ورودی بررسی کنید؛ معمولاً کاما، گیومه یا آکولاد جا افتاده عامل آن است.
                </Notice>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                {result.action === 'validate' ? (
                  <div className="flex flex-col items-center justify-center text-center gap-3 min-h-[120px]" style={{ color: `rgb(${ACCENT})` }}>
                    <CheckCircle2 className="w-10 h-10" />
                    <span className="font-black font-display text-lg">JSON معتبر است</span>
                  </div>
                ) : (
                  <Headline
                    accent={ACCENT}
                    label={actionLabel[result.action]}
                    value={`${faNum(fmtNum(result.size, 0))} کاراکتر`}
                    sub="خروجی آمادهٔ کپی است"
                  />
                )}

                <div className="space-y-2.5">
                  <Row label="کاراکتر ورودی" value={faNum(fmtNum(result.chars, 0))} />
                  <Row label="تعداد خطوط" value={faNum(fmtNum(result.lines, 0))} />
                  {result.action !== 'validate' && (
                    <Row label="کاراکتر خروجی" value={faNum(fmtNum(result.size, 0))} strong />
                  )}
                </div>

                {result.action !== 'validate' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">خروجی</span>
                      <CopyButton accent={ACCENT} text={result.output} />
                    </div>
                    <pre dir="ltr" className={outputClass}>
                      {result.output}
                    </pre>
                  </div>
                )}

                <Notice accent={ACCENT}>
                  تمام پردازش آفلاین انجام می‌شود و خروجی با یک کلیک قابل کپی است.
                </Notice>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
