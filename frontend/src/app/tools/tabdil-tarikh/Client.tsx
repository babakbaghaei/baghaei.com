'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Calendar, Moon, Sun, Info } from 'lucide-react';
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
  AnimatePresence,
  motion,
  faNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '124, 58, 237'; // violet-600

/* ───────────── jalaali.js (inline, no dependency) ───────────── */

function div(a: number, b: number) {
  return Math.trunc(a / b);
}

function mod(a: number, b: number) {
  return a - Math.trunc(a / b) * b;
}

/**
 * Canonical jalaali.js calendar computation. Returns the leap-offset for the
 * Jalaali year and the Gregorian day-of-March (1..21) on which it begins.
 */
function jalCal(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function isLeapJalaali(jy: number) {
  return jalCal(jy).leap === 0;
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * ((gm + 9) % 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return (
    g2d(r.gy, 3, r.march) +
    (jm - 1) * 31 -
    div(jm, 7) * (jm - 7) +
    jd -
    1
  );
}

function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let jd: number;
  let jm: number;
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    // Previous Jalaali year — r.leap is for the year being left, per jalaali.js.
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

function toJalaali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd));
}

function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd));
}

/* ───────────── calendar metadata ───────────── */

type Cal = 'jalali' | 'gregorian';

const CALS: { value: Cal; label: string }[] = [
  { value: 'jalali', label: 'شمسی (جلالی)' },
  { value: 'gregorian', label: 'میلادی' },
];

const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

const GREGORIAN_MONTHS = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر',
];

const jalaliMonthDays = (jy: number, jm: number) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaali(jy) ? 30 : 29;
};

const gregorianMonthDays = (gy: number, gm: number) => {
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][gm - 1];
};

const parseInt10 = (s: string) => {
  const v = normalizeDigits(s).replace(/[^\d]/g, '');
  return v === '' ? null : Number(v);
};

const weekdayFa = (gy: number, gm: number, gd: number) =>
  new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date(gy, gm - 1, gd));

const hijriParts = (gy: number, gm: number, gd: number) => {
  const fmt = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // Use UTC noon to avoid timezone edge shifts.
  const parts = fmt.formatToParts(new Date(Date.UTC(gy, gm - 1, gd, 12)));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const year = parseInt(get('year').replace(/[^\d]/g, ''), 10);
  const month = parseInt(get('month'), 10);
  const day = parseInt(get('day'), 10);
  return { year, month, day };
};

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذیقعده', 'ذیحجه',
];

export default function TabdilTarikh() {
  const [cal, setCal] = useState<Cal>('jalali');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get('cal');
    if (c && CALS.some((x) => x.value === c)) setCal(c as Cal);
    const y = p.get('y');
    if (y) setYear(y);
    const m = p.get('m');
    if (m) setMonth(m);
    const d = p.get('d');
    if (d) setDay(d);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const months = cal === 'jalali' ? JALALI_MONTHS : GREGORIAN_MONTHS;

  const numY = parseInt10(year);
  const numM = parseInt10(month);
  const numD = parseInt10(day);

  const calc = useMemo(() => {
    if (numY === null || numM === null || numD === null) return null;
    if (numM < 1 || numM > 12) return { error: 'ماه باید بین ۱ تا ۱۲ باشد.' };

    const maxDay =
      cal === 'jalali' ? jalaliMonthDays(numY, numM) : gregorianMonthDays(numY, numM);
    if (numD < 1 || numD > maxDay)
      return { error: `روز باید بین ۱ تا ${faNum(String(maxDay))} باشد.` };
    if (numY < 1) return { error: 'سال باید عددی مثبت باشد.' };

    // Resolve everything to a Gregorian anchor.
    let gy: number;
    let gm: number;
    let gd: number;
    let jy: number;
    let jm: number;
    let jd: number;

    if (cal === 'jalali') {
      jy = numY;
      jm = numM;
      jd = numD;
      const g = toGregorian(jy, jm, jd);
      gy = g.gy;
      gm = g.gm;
      gd = g.gd;
    } else {
      gy = numY;
      gm = numM;
      gd = numD;
      const j = toJalaali(gy, gm, gd);
      jy = j.jy;
      jm = j.jm;
      jd = j.jd;
    }

    const h = hijriParts(gy, gm, gd);
    const weekday = weekdayFa(gy, gm, gd);

    const jalaliStr = `${faNum(String(jd))} ${JALALI_MONTHS[jm - 1]} ${faNum(String(jy))}`;
    const gregorianStr = `${faNum(String(gd))} ${GREGORIAN_MONTHS[gm - 1]} ${faNum(String(gy))}`;
    const hijriStr = `${faNum(String(h.day))} ${HIJRI_MONTHS[h.month - 1]} ${faNum(String(h.year))}`;

    const headline = cal === 'jalali' ? gregorianStr : jalaliStr;
    const headlineLabel = cal === 'jalali' ? 'میلادی' : 'شمسی';

    const rows = [
      { label: 'روز هفته', value: weekday },
      { label: 'شمسی', value: jalaliStr, strong: cal === 'gregorian' },
      { label: 'میلادی', value: gregorianStr, strong: cal === 'jalali' },
      { label: 'قمری', value: hijriStr },
    ];

    const sentence = `${weekday} — شمسی: ${jalaliStr} | میلادی: ${gregorianStr} | قمری: ${hijriStr}`;

    return { headline, headlineLabel, rows, sentence };
  }, [cal, numY, numM, numD]);

  const onShare = () => {
    if (!calc || calc.error) return;
    share({
      title: 'مبدل تاریخ شمسی، میلادی و قمری',
      text: calc.sentence ?? '',
      params: { cal, y: String(numY), m: String(numM), d: String(numD) },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="مبدل تاریخ شمسی، میلادی و قمری"
      subtitle="تبدیل دقیق تاریخ میان تقویم‌های شمسی، میلادی و قمری"
      icon={CalendarDays}
      accent={ACCENT}
      info={[
        {
          icon: <Sun className="w-4 h-4" />,
          title: 'تقویم شمسی (جلالی)',
          body: 'تقویم رسمی ایران و افغانستان؛ مبدأ آن هجرت پیامبر است و سال آن با اعتدال بهاری آغاز می‌شود. تبدیل با الگوریتم دقیق جلالی انجام می‌شود.',
        },
        {
          icon: <Calendar className="w-4 h-4" />,
          title: 'تقویم میلادی',
          body: 'تقویم گریگوری که در بیشتر کشورهای جهان به‌کار می‌رود. این ابزار سال‌های کبیسه را به‌درستی در نظر می‌گیرد.',
        },
        {
          icon: <Moon className="w-4 h-4" />,
          title: 'تقویم قمری',
          body: 'هجری قمری بر پایهٔ گردش ماه؛ نمایش آن بر اساس تقویم ام‌القری محاسبه می‌شود و ممکن است با رؤیت هلال محلی یک روز تفاوت داشته باشد.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'تقویم مبدأ و تاریخ را وارد کنید تا دو تقویم دیگر و روز هفته نمایش داده شوند. تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField label="تقویم مبدأ" value={cal} onChange={(v) => setCal(v as Cal)}>
            {CALS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </SelectField>

          <Field label="روز" hint="مثلاً ۱۵">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(day)}
              onChange={(e) => setDay(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="روز"
              className={inputClass}
            />
          </Field>

          <SelectField label="ماه" value={month} onChange={(v) => setMonth(v)}>
            {months.map((m, i) => (
              <option key={i} value={String(i + 1)}>
                {faNum(String(i + 1))} — {m}
              </option>
            ))}
          </SelectField>

          <Field label="سال" hint={cal === 'jalali' ? 'مثلاً ۱۴۰۳' : 'مثلاً ۲۰۲۴'}>
            <input
              type="text"
              inputMode="numeric"
              value={faNum(year)}
              onChange={(e) => setYear(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="سال"
              className={inputClass}
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<CalendarDays className="w-6 h-6" />}>
                تقویم مبدأ و تاریخ کامل را وارد کنید.
              </EmptyState>
            ) : calc.error ? (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{calc.error}</p>
              </motion.div>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline accent={ACCENT} label={calc.headlineLabel ?? ''} value={calc.headline ?? ''} />
                <div className="space-y-2.5">
                  {calc.rows?.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  تاریخ قمری بر پایهٔ تقویم ام‌القری محاسبه می‌شود و ممکن است با رؤیت هلال محلی یک روز تفاوت داشته باشد.
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
