'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, CalendarClock, BookOpen, Info, Moon, Scale } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  SelectField,
  Toggle,
  Stepper,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
  fmtMoney,
  fmtNum,
  toWords,
} from '@/components/tools/shell';
import {
  DIYEH_FULL_RIAL,
  DIYEH_LATEST_YEAR,
  DIYEH_HARAM_FACTOR,
  HARAM_MONTHS,
} from '@/lib/data/legal-rates';

const ACCENT = '190, 18, 60'; // crimson

const DIYEH_YEARS = Object.keys(DIYEH_FULL_RIAL)
  .map(Number)
  .sort((a, b) => b - a);

/** کسر هر عضو/جراحت نسبت به دیهٔ کامل (فقه و قانون مجازات اسلامی). */
const PARTS: { key: string; label: string; frac: number | null }[] = [
  { key: 'full', label: 'دیهٔ کامل (نفس)', frac: 1 },
  { key: 'eye', label: 'یک چشم', frac: 1 / 2 },
  { key: 'hand', label: 'یک دست', frac: 1 / 2 },
  { key: 'foot', label: 'یک پا', frac: 1 / 2 },
  { key: 'ear', label: 'یک گوش', frac: 1 / 2 },
  { key: 'lip', label: 'یک لب', frac: 1 / 2 },
  { key: 'finger', label: 'یک انگشت دست یا پا', frac: 1 / 10 },
  { key: 'custom', label: 'درصد دلخواه (ارش/جراحت)', frac: null },
];

export default function Diyeh() {
  const [year, setYear] = useState(DIYEH_LATEST_YEAR);
  const [haram, setHaram] = useState(false);
  const [part, setPart] = useState('full');
  const [qty, setQty] = useState(1);
  const [pct, setPct] = useState('100');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const y = Number(p.get('year'));
    if (y && DIYEH_FULL_RIAL[y]) setYear(y);
    if (p.get('haram') === '1') setHaram(true);
    const pt = p.get('part');
    if (pt && PARTS.some((x) => x.key === pt)) setPart(pt);
    const q = Number(p.get('qty'));
    if (q) setQty(q);
    const pc = p.get('pct');
    if (pc) setPct(pc);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const calc = useMemo(() => {
    const fullRial = DIYEH_FULL_RIAL[year];
    if (!fullRial) return null;
    const base = haram && part === 'full' ? fullRial * DIYEH_HARAM_FACTOR : fullRial;
    const selected = PARTS.find((p) => p.key === part)!;
    const frac = selected.frac ?? Math.max(0, Math.min(100, Number(pct) || 0)) / 100;
    if (frac <= 0) return null;
    const totalRial = base * frac * qty;
    return {
      baseToman: base / 10,
      frac,
      qty,
      totalToman: Math.round(totalRial / 10),
      label: selected.label,
    };
  }, [year, haram, part, qty, pct]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبهٔ دیه',
      text: `دیه (${calc.label}) سال ${faNum(year)}${haram ? ' - ماه حرام' : ''}: ${fmtMoney(calc.totalToman)} تومان`,
      params: { year: String(year), haram: haram ? '1' : '0', part, qty: String(qty), pct },
    });
  };

  return (
    <ToolShell
      title="ماشین‌حساب دیه"
      subtitle="محاسبهٔ دیهٔ کامل و دیهٔ اعضا و جراحات بر اساس نرخ رسمی قوهٔ قضاییه (مادهٔ ۵۴۹ قانون مجازات اسلامی)"
      icon={HeartPulse}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی (مادهٔ ۵۴۹)',
          body: 'نرخ دیهٔ کامل هر سال با بخشنامهٔ رئیس قوهٔ قضاییه تعیین و ابلاغ می‌شود؛ دیهٔ اعضا و منافع به‌صورت کسری از دیهٔ کامل محاسبه می‌گردد.',
        },
        {
          icon: <Moon className="w-4 h-4" />,
          title: 'تغلیظ دیه در ماه‌های حرام',
          body: `در ماه‌های حرام (${HARAM_MONTHS.join('، ')}) برای قتل، دیه یک‌سوم افزایش می‌یابد (تغلیظ). این ضریب فقط بر دیهٔ نفس اعمال می‌شود.`,
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'کسر اعضا',
          body: 'نمونه: دیهٔ دو چشم، دو دست یا دو پا «دیهٔ کامل» و هر کدام به‌تنهایی «نصف» است؛ دیهٔ هر انگشت یک‌دهم دیهٔ کامل است. برای جراحات و آسیب‌های دیگر، درصد ارش را وارد کنید.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'منبع داده‌ها',
          body: `نرخ دیهٔ کامل سال ${faNum(DIYEH_LATEST_YEAR)} برابر ${fmtMoney(DIYEH_FULL_RIAL[DIYEH_LATEST_YEAR] / 10)} تومان (ماه عادی)، بر پایهٔ بخشنامهٔ قوهٔ قضاییه.`,
        },
      ]}
      disclaimer="نرخ‌های دیه سالانه و گاه میان‌سال تغییر می‌کنند. ملاک قطعی، آخرین بخشنامهٔ قوهٔ قضاییه و نظر مرجع قضایی است."
    >
      <TwoPane>
        <Panel className="space-y-6">
          <SelectField
            icon={<CalendarClock className="w-4 h-4" />}
            label="سال وقوع"
            hint="سالی که حادثه/جنایت واقع شده است"
            value={year}
            onChange={(v) => setYear(Number(v))}
          >
            {DIYEH_YEARS.map((y) => (
              <option key={y} value={y}>
                {faNum(y)}
              </option>
            ))}
          </SelectField>

          {part === 'full' && (
            <Toggle
              label="در ماه‌های حرام (تغلیظ دیه)"
              hint="افزایش یک‌سوم دیهٔ نفس در ماه‌های حرام"
              checked={haram}
              onChange={setHaram}
            />
          )}

          <SelectField
            label="عضو / نوع آسیب"
            value={part}
            onChange={(v) => {
              setPart(v);
              if (v !== 'full') setHaram(false);
            }}
          >
            {PARTS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
                {p.frac != null && p.key !== 'full' ? ` (${fmtNum(p.frac * 100, 1)}٪)` : ''}
              </option>
            ))}
          </SelectField>

          {part === 'custom' && (
            <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
              <span className="text-foreground font-bold font-display text-sm">درصد ارش / جراحت</span>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={faNum(pct)}
                  onChange={(e) =>
                    setPct(
                      e.target.value
                        .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
                        .replace(/[^\d.]/g, ''),
                    )
                  }
                  dir="ltr"
                  aria-label="درصد ارش"
                  className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                  ٪
                </span>
              </div>
            </div>
          )}

          <Stepper label="تعداد" hint="مثلاً ۲ انگشت" value={qty} onChange={setQty} min={1} max={20} />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<HeartPulse className="w-6 h-6" />}>
                سال و نوع آسیب را انتخاب کنید تا دیه محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="مبلغ دیه"
                  value={fmtMoney(calc.totalToman)}
                  suffix="تومان"
                  sub={`${toWords(calc.totalToman)} تومان`}
                />
                <div className="space-y-2.5">
                  <Row label="سال وقوع" value={faNum(year)} />
                  <Row label="نوع ماه" value={haram ? 'حرام (تغلیظ)' : 'عادی'} />
                  <Row label="دیهٔ کامل مبنا" value={`${fmtMoney(calc.baseToman)} تومان`} />
                  <Row label="عضو / آسیب" value={calc.label} />
                  <Row label="کسر دیه" value={fmtPctFrac(calc.frac)} />
                  <Row label="تعداد" value={faNum(calc.qty)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع دیه" value={`${fmtMoney(calc.totalToman)} تومان`} strong />
                </div>
                {haram && (
                  <Notice accent={ACCENT}>
                    تغلیظ دیه در ماه‌های حرام صرفاً نسبت به دیهٔ نفس (قتل) اعمال می‌شود؛ برای اعضا و جراحات ضریب حرام لحاظ نکنید.
                  </Notice>
                )}
                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}

const fmtPctFrac = (frac: number) => faNum((Math.round(frac * 10000) / 100).toString()) + '٪';
