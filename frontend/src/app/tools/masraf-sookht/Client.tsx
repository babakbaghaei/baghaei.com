'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Fuel, Gauge, Route, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Field,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '146, 64, 14'; // amber-800

// keep only digits and a single decimal point
const sanitizeDecimal = (s: string) => {
  const cleaned = normalizeDigits(s).replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
};

const parse = (s: string) => {
  const v = sanitizeDecimal(s);
  if (v === '' || v === '.') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function MasrafSookht() {
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [price, setPrice] = useState('');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get('d');
    if (d) setDistance(d);
    const f = p.get('f');
    if (f) setFuel(f);
    const pr = p.get('p');
    if (pr) setPrice(pr);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const numDistance = parse(distance);
  const numFuel = parse(fuel);
  const numPrice = parse(price);

  const calc = useMemo(() => {
    if (numDistance === null || numFuel === null) return null;
    if (numDistance <= 0) return { error: 'مسافت باید بزرگ‌تر از صفر باشد.' };
    if (numFuel <= 0) return { error: 'مقدار سوخت مصرف‌شده باید بزرگ‌تر از صفر باشد.' };

    const per100 = (numFuel / numDistance) * 100; // لیتر در ۱۰۰ کیلومتر
    const kmPerL = numDistance / numFuel; // کیلومتر با هر لیتر
    const hasPrice = numPrice !== null && numPrice > 0;
    const tripCost = hasPrice ? numFuel * (numPrice as number) : null;

    const rows: { label: string; value: string; strong?: boolean }[] = [
      { label: 'مسافت', value: `${fmtNum(numDistance)} کیلومتر` },
      { label: 'سوخت مصرف‌شده', value: `${fmtNum(numFuel)} لیتر` },
      { label: 'مصرف', value: `${fmtNum(per100)} لیتر در ۱۰۰ کیلومتر`, strong: true },
      { label: 'پیمایش', value: `${fmtNum(kmPerL)} کیلومتر با هر لیتر` },
    ];

    if (tripCost !== null) {
      rows.push({ label: 'قیمت هر لیتر', value: `${fmtNum(numPrice as number)} تومان` });
      rows.push({ label: 'هزینهٔ سفر', value: `${fmtNum(tripCost)} تومان`, strong: true });
    }

    const sentence =
      tripCost !== null
        ? `مصرف ${fmtNum(per100)} لیتر در ۱۰۰ کیلومتر؛ هزینهٔ این سفر ${fmtNum(tripCost)} تومان است`
        : `مصرف ${fmtNum(per100)} لیتر در ۱۰۰ کیلومتر (${fmtNum(kmPerL)} کیلومتر با هر لیتر)`;

    return {
      headline: fmtNum(per100),
      sentence,
      rows,
    };
  }, [numDistance, numFuel, numPrice]);

  const onShare = () => {
    if (!calc || calc.error) return;
    share({
      title: 'محاسبهٔ مصرف سوخت خودرو',
      text: calc.sentence ?? '',
      params: {
        d: String(numDistance),
        f: String(numFuel),
        ...(numPrice !== null && numPrice > 0 ? { p: String(numPrice) } : {}),
      },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="محاسبهٔ مصرف سوخت خودرو"
      subtitle="مصرف سوخت بر حسب لیتر در ۱۰۰ کیلومتر و هزینهٔ سفر"
      icon={Fuel}
      accent={ACCENT}
      info={[
        {
          icon: <Gauge className="w-4 h-4" />,
          title: 'لیتر در ۱۰۰ کیلومتر',
          body: 'رایج‌ترین معیار مصرف سوخت؛ یعنی خودرو برای پیمودن ۱۰۰ کیلومتر چند لیتر سوخت می‌خورد. هرچه این عدد کمتر باشد، خودرو کم‌مصرف‌تر است.',
        },
        {
          icon: <Route className="w-4 h-4" />,
          title: 'کیلومتر با هر لیتر',
          body: 'نمای دیگری از همان مصرف؛ مسافتی که خودرو با یک لیتر سوخت می‌پیماید. برای برآورد هزینه و فاصلهٔ سوخت‌گیری مفید است.',
        },
        {
          icon: <Fuel className="w-4 h-4" />,
          title: 'هزینهٔ سفر',
          body: 'با وارد کردن قیمت هر لیتر سوخت، هزینهٔ تقریبی این مسیر بر اساس سوخت مصرف‌شده محاسبه می‌شود. وارد کردن قیمت اختیاری است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'قیمت سوخت توسط شما وارد می‌شود و نرخ بیرونی دریافت نمی‌شود. تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="مسافت طی‌شده (کیلومتر)" hint="مثلاً ۴۲۰">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(distance)}
              onChange={(e) => setDistance(sanitizeDecimal(e.target.value))}
              dir="ltr"
              aria-label="مسافت طی‌شده بر حسب کیلومتر"
              className={inputClass}
            />
          </Field>

          <Field label="سوخت مصرف‌شده (لیتر)" hint="مثلاً ۳۵">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(fuel)}
              onChange={(e) => setFuel(sanitizeDecimal(e.target.value))}
              dir="ltr"
              aria-label="سوخت مصرف‌شده بر حسب لیتر"
              className={inputClass}
            />
          </Field>

          <Field label="قیمت هر لیتر (تومان) — اختیاری" hint="برای محاسبهٔ هزینهٔ سفر">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(price)}
              onChange={(e) => setPrice(sanitizeDecimal(e.target.value))}
              dir="ltr"
              aria-label="قیمت هر لیتر سوخت بر حسب تومان"
              className={inputClass}
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Fuel className="w-6 h-6" />}>
                مسافت و مقدار سوخت مصرف‌شده را وارد کنید.
              </EmptyState>
            ) : calc.error ? (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{calc.error}</p>
              </motion.div>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline accent={ACCENT} label="مصرف" value={calc.headline ?? ''} suffix="لیتر / ۱۰۰ کیلومتر" sub={calc.sentence} />
                <div className="space-y-2.5">
                  {calc.rows?.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  قیمت سوخت را خودتان وارد می‌کنید؛ هزینه فقط در صورت وارد کردن قیمت نمایش داده می‌شود. ارقام فارسی و اعشاری پذیرفته می‌شوند.
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
