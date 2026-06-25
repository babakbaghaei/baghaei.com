'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CalendarClock, Gavel, Plane, BookOpen, Info, CalendarSync, ArrowLeftRight } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  SelectField,
  Field,
  Toggle,
  Row,
  Headline,
  Notice,
  EmptyState,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
} from '@/components/tools/shell';
import {
  PersianDatePicker,
  type PDate,
  pdateToDate,
  pdateFromDate,
  pdateFromJalali,
  formatPDate,
  todayPDate,
} from '@/components/tools/DatePicker';
import { LEGAL_DEADLINES } from '@/lib/data/legal-rates';

const ACCENT = '124, 58, 237'; // violet-600

const WEEKDAYS = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

const weekdayFa = (d: Date) => WEEKDAYS[d.getDay()];

const fmtJalaali = (d: Date) => formatPDate(pdateFromDate(d));

const fmtGregorian = (d: Date) =>
  new Intl.DateTimeFormat('fa-IR-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

const fmtHijri = (d: Date) =>
  new Intl.DateTimeFormat('fa-IR-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000);

export default function MohlatGhanuni() {
  const [mode, setMode] = useState<'deadline' | 'convert'>('deadline');

  // deadline mode
  const [deadlineKey, setDeadlineKey] = useState(LEGAL_DEADLINES[0].key);
  const [abroad, setAbroad] = useState(false);
  const [ablagh, setAblagh] = useState<PDate | null>(null);
  // convert mode
  const [conv, setConv] = useState<PDate | null>(null);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('mode') === 'convert') setMode('convert');
    const dk = p.get('key');
    if (dk && LEGAL_DEADLINES.some((x) => x.key === dk)) setDeadlineKey(dk);
    if (p.get('abroad') === '1') setAbroad(true);
    const ab = p.get('ablagh');
    if (ab && /^\d{1,4}-\d{1,2}-\d{1,2}$/.test(ab)) {
      const [jy, jm, jd] = ab.split('-').map(Number);
      setAblagh(pdateFromJalali(jy, jm, jd));
    }
    const cv = p.get('date');
    if (cv && /^\d{1,4}-\d{1,2}-\d{1,2}$/.test(cv)) {
      const [jy, jm, jd] = cv.split('-').map(Number);
      setConv(pdateFromJalali(jy, jm, jd));
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const deadline = useMemo(() => {
    if (!ablagh) return null;
    const def = LEGAL_DEADLINES.find((d) => d.key === deadlineKey)!;
    const days = abroad && def.abroadDays ? def.abroadDays : def.days;
    const start = pdateToDate(ablagh);
    // روز ابلاغ جزو مهلت محاسبه نمی‌شود (مادهٔ ۴۴۵ ق.آ.د.م).
    let last = addDays(start, days);
    let shifted = false;
    if (last.getDay() === 5) {
      // جمعه → نخستین روز کاری بعد
      last = addDays(last, 1);
      shifted = true;
    }
    const now = pdateToDate(todayPDate());
    const remaining = daysBetween(now, last);
    return { def, days, start, last, shifted, remaining };
  }, [deadlineKey, abroad, ablagh]);

  const convert = useMemo(() => (conv ? pdateToDate(conv) : null), [conv]);

  const onShareDeadline = () => {
    if (!deadline || !ablagh) return;
    share({
      title: 'محاسبهٔ مهلت قانونی',
      text: `${deadline.def.label} — آخرین مهلت: ${fmtJalaali(deadline.last)} (${weekdayFa(deadline.last)})`,
      params: {
        mode: 'deadline',
        key: deadlineKey,
        abroad: abroad ? '1' : '0',
        ablagh: `${ablagh.jy}-${ablagh.jm}-${ablagh.jd}`,
      },
    });
  };

  const onShareConvert = () => {
    if (!convert || !conv) return;
    share({
      title: 'مبدل تاریخ',
      text: `${fmtJalaali(convert)} برابر است با ${fmtGregorian(convert)} میلادی و ${fmtHijri(convert)} قمری`,
      params: { mode: 'convert', date: `${conv.jy}-${conv.jm}-${conv.jd}` },
    });
  };

  return (
    <ToolShell
      title="مهلت‌های قانونی و مبدل تاریخ"
      subtitle="محاسبهٔ آخرین مهلت اعتراض و تجدیدنظر بر مبنای تاریخ ابلاغ، و تبدیل تاریخ شمسی، میلادی و قمری"
      icon={CalendarClock}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای احتساب مهلت',
          body: 'بر اساس مادهٔ ۴۴۵ قانون آیین دادرسی مدنی، روز ابلاغ و روز اقدام جزو مهلت محسوب نمی‌شود؛ از همین رو شمارش از فردای ابلاغ آغاز می‌شود.',
        },
        {
          icon: <Plane className="w-4 h-4" />,
          title: 'مقیمان خارج از کشور',
          body: 'مهلت تجدیدنظر و فرجام برای اشخاص مقیم خارج از کشور دو ماه (۶۰ روز) است؛ گزینهٔ «مقیم خارج» این مهلت را اعمال می‌کند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'روزهای تعطیل',
          body: 'چنانچه آخرین روز مهلت مصادف با روز تعطیل رسمی باشد، مهلت به نخستین روز کاری بعد منتقل می‌شود. این ابزار فقط جمعه را تشخیص می‌دهد؛ سایر تعطیلات رسمی را خودتان لحاظ کنید.',
        },
        {
          icon: <CalendarSync className="w-4 h-4" />,
          title: 'تبدیل تاریخ',
          body: 'تبدیل میان تقویم هجری شمسی، میلادی و هجری قمری (ام‌القری) با دقت بالا انجام می‌شود؛ تاریخ قمری رسمی ایران ممکن است یک روز اختلاف داشته باشد.',
        },
      ]}
      disclaimer="این محاسبه راهنماست. ملاک قطعیِ مهلت‌ها، تاریخ ابلاغ واقعی/قانونی در سامانهٔ ثنا و تشخیص مرجع قضایی است."
    >
      <TwoPane>
        <Panel className="space-y-6">
          <div className="flex bg-muted p-1 rounded-2xl border border-border">
            {([
              ['deadline', 'محاسبهٔ مهلت', Gavel],
              ['convert', 'مبدل تاریخ', ArrowLeftRight],
            ] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black font-display transition-all ${
                  mode === key ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
                style={mode === key ? { color: `rgb(${ACCENT})` } : undefined}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {mode === 'deadline' ? (
            <>
              <SelectField
                icon={<Gavel className="w-4 h-4" />}
                label="نوع اقدام قضایی"
                value={deadlineKey}
                onChange={setDeadlineKey}
              >
                {LEGAL_DEADLINES.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </SelectField>
              <Field label="تاریخ ابلاغ">
                <PersianDatePicker
                  value={ablagh}
                  onChange={setAblagh}
                  placeholder="تاریخ ابلاغ را انتخاب کنید"
                  clearable
                  onClear={() => setAblagh(null)}
                  ariaLabel="تاریخ ابلاغ"
                />
              </Field>
              {LEGAL_DEADLINES.find((d) => d.key === deadlineKey)?.abroadDays && (
                <Toggle
                  label="مخاطب مقیم خارج از کشور است"
                  hint="مهلت ۲ ماه (۶۰ روز) اعمال می‌شود"
                  checked={abroad}
                  onChange={setAbroad}
                />
              )}
            </>
          ) : (
            <Field label="تاریخ شمسی">
              <PersianDatePicker
                value={conv}
                onChange={setConv}
                placeholder="تاریخ شمسی را انتخاب کنید"
                clearable
                onClear={() => setConv(null)}
                ariaLabel="تاریخ شمسی"
              />
            </Field>
          )}
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {mode === 'deadline' ? (
              deadline ? (
                <motion.div
                  key="deadline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-7"
                >
                  <Headline
                    accent={ACCENT}
                    label="آخرین مهلت قانونی"
                    value={fmtJalaali(deadline.last)}
                    sub={weekdayFa(deadline.last)}
                  />
                  <div className="space-y-2.5">
                    <Row label="نوع اقدام" value={deadline.def.label} />
                    <Row label="مهلت قانونی" value={`${faNum(deadline.days)} روز`} />
                    <Row label="تاریخ ابلاغ" value={`${fmtJalaali(deadline.start)} (${weekdayFa(deadline.start)})`} />
                    <Row label="معادل میلادی" value={fmtGregorian(deadline.last)} />
                    <div className="h-px bg-border/60 my-1" />
                    <Row
                      label={deadline.remaining >= 0 ? 'روزهای باقی‌مانده' : 'روزهای گذشته از مهلت'}
                      value={`${faNum(Math.abs(deadline.remaining))} روز`}
                      strong
                    />
                  </div>
                  {deadline.remaining < 0 && (
                    <Notice accent={ACCENT}>مهلت قانونی سپری شده است؛ امکان اعتراض ممکن است منوط به عذر موجه باشد.</Notice>
                  )}
                  {deadline.shifted && (
                    <Notice accent={ACCENT}>روز پایانی مصادف با جمعه بود و به شنبه (نخستین روز کاری) منتقل شد.</Notice>
                  )}
                  <p className="text-xs text-muted-foreground/70 font-display leading-relaxed">
                    {deadline.def.note}
                  </p>
                  <ShareButton accent={ACCENT} copied={copied} onClick={onShareDeadline} />
                </motion.div>
              ) : (
                <EmptyState key="deadline-empty" accent={ACCENT} icon={<CalendarClock className="w-6 h-6" />}>
                  برای محاسبهٔ آخرین مهلت قانونی، تاریخ ابلاغ را انتخاب کنید.
                </EmptyState>
              )
            ) : convert ? (
              <motion.div
                key="convert"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline
                  accent={ACCENT}
                  label="معادل تاریخ"
                  value={weekdayFa(convert)}
                  sub={fmtJalaali(convert)}
                />
                <div className="space-y-2.5">
                  <Row label="هجری شمسی" value={fmtJalaali(convert)} />
                  <Row label="میلادی" value={fmtGregorian(convert)} />
                  <Row label="هجری قمری" value={fmtHijri(convert)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="روز هفته" value={weekdayFa(convert)} strong />
                </div>
                <ShareButton accent={ACCENT} copied={copied} onClick={onShareConvert} />
              </motion.div>
            ) : (
              <EmptyState key="convert-empty" accent={ACCENT} icon={<CalendarSync className="w-6 h-6" />}>
                برای دیدن معادل میلادی و قمری، یک تاریخ شمسی انتخاب کنید.
              </EmptyState>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
