'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Timer, CalendarClock, Info } from 'lucide-react';
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
} from '@/components/tools/shell';
import {
  PersianDatePicker,
  TimeField,
  type PDate,
  pdateFromGregorian,
  pdateToDate,
} from '@/components/tools/DatePicker';

const ACCENT = '124, 58, 237'; // must equal the `accent` in tools.ts

// «۰۷» — صفرِ پیش‌رو برای ساعت/دقیقه/ثانیه و سپس ارقام فارسی.
const pad2 = (n: number) => faNum(String(n).padStart(2, '0'));

export default function ShomareshMakus() {
  const [pdate, setPdate] = useState<PDate | null>(null);
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [label, setLabel] = useState('');
  const [now, setNow] = useState<number | null>(null);
  const { share, copied } = useShareResult();

  // hydrate state from share URL (?t=YYYY-MM-DD&h=..&m=..&l=..)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('t');
    if (t) {
      const parts = t.split('-').map((x) => Number(x));
      if (parts.length === 3 && parts.every((x) => Number.isFinite(x))) {
        setPdate(pdateFromGregorian(parts[0], parts[1], parts[2]));
      }
    }
    const hh = Number(p.get('h'));
    if (Number.isFinite(hh) && hh >= 0 && hh <= 23) setH(hh);
    const mm = Number(p.get('m'));
    if (Number.isFinite(mm) && mm >= 0 && mm <= 59) setM(mm);
    const l = p.get('l');
    if (l) setLabel(l);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // عقربهٔ زنده: هر ثانیه «اکنون» را به‌روز می‌کند و در پاک‌سازی متوقف می‌شود.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const calc = useMemo(() => {
    if (!pdate) return null;
    const d = pdateToDate(pdate);
    d.setHours(h, m, 0, 0);
    const targetMs = d.getTime();
    if (Number.isNaN(targetMs)) return { error: 'تاریخ و زمان واردشده معتبر نیست.' };
    if (now === null) return null; // پیش از نصب کلاینت

    const event = label.trim() || 'رویداد';
    const diff = targetMs - now;

    if (diff <= 0) {
      return {
        passed: true,
        headline: 'فرارسید',
        sentence: `${event} آغاز شد یا به پایان رسید.`,
      };
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return {
      event,
      headline: faNum(String(days)),
      clock: `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`,
      sentence: `${faNum(String(days))} روز و ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)} تا «${event}» باقی مانده است.`,
      rows: [
        { label: 'روز', value: faNum(String(days)), strong: false },
        { label: 'ساعت', value: pad2(hours), strong: false },
        { label: 'دقیقه', value: pad2(minutes), strong: false },
        { label: 'ثانیه', value: pad2(seconds), strong: true },
      ],
    };
  }, [pdate, h, m, now, label]);

  const onShare = () => {
    if (!calc || calc.error || !pdate) return;
    const t = `${pdate.gy}-${pdate.gm}-${pdate.gd}`;
    share({
      title: 'شمارش معکوس رویداد',
      text: calc.sentence ?? '',
      params: { t, h: String(h), m: String(m), l: label },
    });
  };

  // کلاس استاندارد ورودی در سراسر کدبیس
  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="شمارش معکوس رویداد"
      subtitle="شمارش معکوس زنده تا یک تاریخ و زمان مشخص"
      icon={Timer}
      accent={ACCENT}
      info={[
        {
          icon: <CalendarClock className="w-4 h-4" />,
          title: 'انتخاب لحظهٔ هدف',
          body: 'تاریخ و ساعت رویداد را انتخاب کنید؛ شمارش معکوس به‌صورت زنده و هر ثانیه به‌روز می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'حریم خصوصی',
          body: 'تمام محاسبات روی مرورگر شما و به‌صورت آفلاین انجام می‌شود؛ هیچ داده‌ای ارسال نمی‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="تاریخ رویداد" hint="روزِ هدف را انتخاب کنید">
            <PersianDatePicker
              value={pdate}
              onChange={(p) => setPdate(p)}
              placeholder="تاریخ رویداد را انتخاب کنید"
              clearable
              onClear={() => setPdate(null)}
              ariaLabel="تاریخ رویداد"
            />
          </Field>

          <Field label="ساعت رویداد" hint="ساعت و دقیقهٔ هدف (۲۴ ساعته)">
            <TimeField
              hour={h}
              minute={m}
              onChange={(nh, nm) => {
                setH(nh);
                setM(nm);
              }}
            />
          </Field>

          <Field label="عنوان رویداد" hint="اختیاری، مثلاً «شروع سال نو»">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              dir="rtl"
              aria-label="عنوان رویداد"
              placeholder="رویداد"
              className={inputClass}
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Timer className="w-6 h-6" />}>
                تاریخ و زمان رویداد را انتخاب کنید.
              </EmptyState>
            ) : calc.error ? (
              <motion.div
                key="e"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[200px] flex items-center justify-center"
              >
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{calc.error}</p>
              </motion.div>
            ) : calc.passed ? (
              <motion.div
                key="p"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline accent={ACCENT} label="وضعیت رویداد" value={calc.headline ?? ''} sub={calc.sentence} />
                <Notice accent={ACCENT}>
                  لحظهٔ هدف سپری شده است؛ برای شمارش معکوس تازه، تاریخ و زمان دیگری انتخاب کنید.
                </Notice>
              </motion.div>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline accent={ACCENT} label="روز باقی‌مانده" value={calc.headline ?? ''} suffix="روز" sub={calc.sentence} />
                <div className="space-y-2.5">
                  {calc.rows?.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  شمارش معکوس زنده است و هر ثانیه به‌روز می‌شود؛ روز، ساعت، دقیقه و ثانیه تا لحظهٔ هدف.
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
