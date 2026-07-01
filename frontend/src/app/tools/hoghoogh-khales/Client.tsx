'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, ShieldCheck, Percent, Layers, Info, Users, Baby } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Field,
  SelectField,
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
  fmtPct,
  toWords,
  cleanNum,
  normalizeDigits,
  groupThousands,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { MIN_WAGE, MIN_WAGE_LATEST_YEAR } from '@/lib/data/legal-rates';

const ACCENT = '5, 150, 105'; // emerald-600

// حق اولاد ماهانهٔ هر فرزند (ریال) از جدید‌ترین سال حداقل دستمزد — معاف از مالیات و بیمه.
const CHILD_RATE_RIAL = MIN_WAGE[MIN_WAGE_LATEST_YEAR].childPerKid;

/**
 * پلکان نمونهٔ مالیات حقوق (قابل ویرایش). هر ردیف سقف ماهانهٔ پلکان و نرخ آن را
 * نگه می‌دارد؛ سقف خالی یا صفر یعنی «بدون سقف» (تا بی‌نهایت). مقادیر پیش‌فرض
 * صرفاً نمونه‌اند و باید با جدول مصوب قانون بودجهٔ سال جاری جایگزین شوند.
 */
interface Bracket {
  /** سقف ماهانهٔ این پلکان به تومان؛ خالی = بدون سقف (آخرین پله). */
  cap: string;
  /** نرخ مالیات این پلکان به درصد. */
  rate: string;
}

const DEFAULT_EXEMPTION = '12,000,000'; // معافیت ماهانهٔ نمونه (تومان)

const DEFAULT_BRACKETS: Bracket[] = [
  { cap: '16,500,000', rate: '10' },
  { cap: '27,000,000', rate: '15' },
  { cap: '40,000,000', rate: '20' },
  { cap: '', rate: '30' }, // مازاد، بدون سقف
];

export default function HoghooghKhales() {
  const [gross, setGross] = useState('');
  const [insuranceRate, setInsuranceRate] = useState('7'); // سهم بیمهٔ کارمند (نمونه ۷٪)
  const [exemption, setExemption] = useState(DEFAULT_EXEMPTION);
  const [brackets, setBrackets] = useState<Bracket[]>(DEFAULT_BRACKETS);
  const [unit, setUnit] = useState<Unit>('toman');
  const [married, setMarried] = useState(false);
  const [childCount, setChildCount] = useState(0);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const g = p.get('gross');
    if (g && /^\d+$/.test(g)) setGross(Number(g).toLocaleString('en-US'));
    const ins = p.get('ins');
    if (ins && /^\d*\.?\d+$/.test(ins)) setInsuranceRate(ins);
    const ex = p.get('exempt');
    if (ex && /^\d+$/.test(ex)) setExemption(Number(ex).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    if (p.get('m') === '1') setMarried(true);
    const kids = p.get('kids');
    if (kids && /^\d+$/.test(kids)) setChildCount(Math.min(20, Number(kids)));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const grossNum = cleanNum(gross);
  const insRate = Math.max(0, Number(normalizeDigits(insuranceRate)) || 0);
  const exemptNum = Math.max(0, cleanNum(exemption));

  const setBracket = (idx: number, patch: Partial<Bracket>) =>
    setBrackets((b) => b.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const calc = useMemo(() => {
    if (grossNum <= 0) return null;

    // سهم بیمهٔ کارمند روی کل حقوق ناخالص.
    const insurance = grossNum * (insRate / 100);

    // مبنای مشمول مالیات = حقوق ناخالص منهای معافیت ماهانه.
    const taxable = Math.max(0, grossNum - exemptNum);

    // اعمال پلکان تصاعدی روی مبلغ مشمول.
    let tax = 0;
    let prevCap = 0; // سقف پلکان قبلی (به تومان)، نسبت به مبنای مشمول
    const tiers: { from: number; to: number; rate: number; amount: number; tax: number }[] = [];
    for (let i = 0; i < brackets.length; i++) {
      const row = brackets[i];
      const rate = Math.max(0, Number(normalizeDigits(row.rate)) || 0);
      const rawCap = cleanNum(row.cap);
      // سقف خالی/صفر یا آخرین ردیف => بدون سقف (تا بی‌نهایت).
      const hasCap = rawCap > 0 && i < brackets.length - 1;
      const upper = hasCap ? rawCap : Infinity;
      if (taxable <= prevCap) break;
      const sliceTop = Math.min(taxable, upper);
      const amount = sliceTop - prevCap;
      if (amount > 0) {
        const tierTax = amount * (rate / 100);
        tax += tierTax;
        tiers.push({ from: prevCap, to: sliceTop, rate, amount, tax: tierTax });
      }
      prevCap = upper;
      if (!hasCap) break;
    }

    // حق اولاد معاف از مالیات و بیمه است؛ روی خالص افزوده می‌شود (نه کسر).
    const childRateUnit = unit === 'toman' ? CHILD_RATE_RIAL / 10 : CHILD_RATE_RIAL;
    const childAllowance = married ? childCount * childRateUnit : 0;
    const baseNet = Math.max(0, grossNum - insurance - tax);
    const net = baseNet + childAllowance;
    return {
      insurance: Math.round(insurance),
      taxable: Math.round(taxable),
      tax: Math.round(tax),
      childAllowance: Math.round(childAllowance),
      baseNet: Math.round(baseNet),
      net: Math.round(net),
      tiers,
    };
  }, [grossNum, insRate, exemptNum, brackets, married, childCount, unit]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبهٔ حقوق خالص',
      text: `حقوق ناخالص ${fmtMoney(grossNum)} ${u} — خالص دریافتی: ${fmtMoney(calc.net)} ${u} (بیمه ${fmtMoney(calc.insurance)}، مالیات ${fmtMoney(calc.tax)}${calc.childAllowance > 0 ? `، حق اولاد ${fmtMoney(calc.childAllowance)}` : ''})`,
      params: {
        gross: String(grossNum),
        ins: String(insRate),
        exempt: String(exemptNum),
        unit,
        m: married ? '1' : '0',
        kids: String(childCount),
      },
    });
  };

  // ورودی عددی پلکان (سقف/مبلغ) با جداکنندهٔ هزارگان و ارقام فارسی.
  const onCapChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
    if (v.length <= 15) setBracket(idx, { cap: groupThousands(v) });
  };
  const onRateChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBracket(idx, { rate: normalizeDigits(e.target.value).replace(/[^\d.]/g, '') });
  };
  const onExemptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
    if (v.length <= 15) setExemption(groupThousands(v));
  };

  return (
    <ToolShell
      title="حقوق خالص (خالص دریافتی)"
      subtitle="محاسبهٔ خالص دریافتی از حقوق ناخالص با کسر سهم بیمه و مالیات حقوق پلکانی"
      icon={Wallet}
      accent={ACCENT}
      info={[
        {
          icon: <ShieldCheck className="w-4 h-4" />,
          title: 'سهم بیمهٔ کارمند',
          body: 'سهم بیمهٔ تأمین اجتماعی کارمند درصدی از حقوق ناخالص است که از دریافتی کسر می‌شود. نرخ پیش‌فرض ۷٪ صرفاً نمونه است؛ نرخ دقیق را مطابق قرارداد و بخشنامهٔ سال جاری وارد کنید.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'معافیت مالیاتی ماهانه',
          body: 'بخشی از حقوق تا سقف معافیت ماهانه از مالیات معاف است و مالیات فقط بر مازاد آن (مبلغ مشمول) محاسبه می‌شود. سقف معافیت هر سال در قانون بودجه تعیین می‌شود؛ مقدار پیش‌فرض نمونه و قابل ویرایش است.',
        },
        {
          icon: <Layers className="w-4 h-4" />,
          title: 'پلکان مالیات حقوق',
          body: 'مالیات حقوق به‌صورت تصاعدی پلکانی محاسبه می‌شود: هر بخش از مبلغ مشمول با نرخ پلکان خود مالیات می‌خورد. سقف هر پله و نرخ آن قابل ویرایش است و آخرین ردیف بدون سقف (مازاد) در نظر گرفته می‌شود.',
        },
        {
          icon: <Baby className="w-4 h-4" />,
          title: 'حق اولاد',
          body: 'حق اولاد کمک‌هزینه‌ای است که به کارمند بیمه‌شدهٔ دارای فرزند پرداخت می‌شود و از مالیات و بیمه معاف است. مبلغ هر فرزند بر پایهٔ حداقل دستمزد مصوب سال جاری محاسبه و به خالص دریافتی افزوده می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'موارد لحاظ‌نشده',
          body: 'حق اولاد (برای کارمند متأهل) به‌صورت معاف در محاسبه افزوده می‌شود؛ اما سایر مزایای معاف مانند بن، خواروبار، مسکن، عیدی و سنوات در سقف معاف و کسورات اختیاری مثل وام جداگانه لحاظ نمی‌شوند. رقم فیش حقوقی ممکن است اندکی متفاوت باشد.',
        },
      ]}
      disclaimer="نرخ معافیت و پلکان مالیات حقوق هر سال در قانون بودجه تغییر می‌کند؛ مقادیر پیش‌فرض این ابزار صرفاً نمونه و قابل ویرایش‌اند. این یک برآورد است؛ ارقام دقیق را با جدول مصوب سال جاری و واحد حقوق و دستمزد بررسی کنید."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <MoneyField
            label="حقوق ناخالص ماهانه"
            amount={gross}
            setAmount={setGross}
            unit={unit}
            setUnit={setUnit}
          />

          <SelectField
            icon={<Users className="w-4 h-4" />}
            label="وضعیت تأهل"
            hint="برای محاسبهٔ حق اولاد (کمک‌هزینهٔ عائله‌مندی)"
            value={married ? 'married' : 'single'}
            onChange={(v) => setMarried(v === 'married')}
          >
            <option value="single">مجرد</option>
            <option value="married">متأهل</option>
          </SelectField>

          {married && (
            <Stepper
              label="تعداد فرزندان"
              hint={`حق اولاد هر فرزند ${fmtMoney(unit === 'toman' ? CHILD_RATE_RIAL / 10 : CHILD_RATE_RIAL)} ${u}/ماه — معاف از مالیات و بیمه`}
              value={childCount}
              onChange={setChildCount}
              min={0}
              max={20}
            />
          )}

          <Field label="سهم بیمهٔ کارمند" hint="نمونه ۷٪ — قابل ویرایش؛ مطابق بخشنامهٔ سال جاری">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(insuranceRate)}
                onChange={(e) =>
                  setInsuranceRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))
                }
                dir="ltr"
                aria-label="سهم بیمهٔ کارمند به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>

          <Field
            label={`معافیت مالیاتی ماهانه (${u})`}
            hint="قابل ویرایش — مطابق قانون بودجهٔ سال جاری؛ مقدار پیش‌فرض نمونه است"
          >
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={faNum(exemption)}
                onChange={onExemptChange}
                placeholder="۰"
                dir="ltr"
                aria-label="معافیت مالیاتی ماهانه"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-12 font-bold font-display text-center focus:border-primary transition-all outline-none text-lg placeholder:text-muted/30"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40">
                {u}
              </span>
            </div>
            {exemptNum > 0 && (
              <p className="text-xs text-muted-foreground/70 font-display text-center mt-2">
                {toWords(exemptNum)} {u}
              </p>
            )}
          </Field>

          <Field
            label="پلکان مالیات حقوق"
            hint="قابل ویرایش / نمونه — مطابق قانون بودجه؛ آخرین ردیف بدون سقف (مازاد) است"
          >
            <div className="space-y-3">
              {brackets.map((row, i) => {
                const last = i === brackets.length - 1;
                return (
                  <div
                    key={i}
                    className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-foreground font-bold font-display text-sm">
                        {`پلکان ${faNum(i + 1)}`}
                      </span>
                      <span
                        className="text-xs font-black font-display shrink-0 px-2 py-0.5 rounded-md"
                        style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
                      >
                        {last ? 'مازاد' : `تا ${u}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-2.5">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={last ? '' : faNum(row.cap)}
                          onChange={onCapChange(i)}
                          disabled={last}
                          placeholder={last ? 'بدون سقف' : '۰'}
                          dir="ltr"
                          aria-label={`سقف پلکان ${i + 1} به ${u}`}
                          className="w-full bg-background border-2 border-border rounded-xl py-2.5 px-3 pl-10 font-display text-sm text-center focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground/40"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40">
                          {last ? '∞' : u}
                        </span>
                      </div>
                      <div className="relative w-24">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={faNum(row.rate)}
                          onChange={onRateChange(i)}
                          dir="ltr"
                          aria-label={`نرخ پلکان ${i + 1} به درصد`}
                          className="w-full bg-background border-2 border-border rounded-xl py-2.5 px-3 pl-7 font-display text-sm text-center focus:border-primary outline-none transition-all"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/50">
                          ٪
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Wallet className="w-6 h-6" />}>
                حقوق ناخالص ماهانه را وارد کنید تا خالص دریافتی پس از کسر بیمه و مالیات محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline
                  accent={ACCENT}
                  label="خالص دریافتی"
                  value={fmtMoney(calc.net)}
                  suffix={u}
                  sub={`${toWords(calc.net)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="حقوق ناخالص" value={`${fmtMoney(grossNum)} ${u}`} />
                  <Row label={`سهم بیمه (${fmtPct(insRate)})`} value={`${fmtMoney(calc.insurance)} ${u}`} />
                  <Row label="معافیت مالیاتی" value={`${fmtMoney(exemptNum)} ${u}`} />
                  <Row label="مبلغ مشمول مالیات" value={`${fmtMoney(calc.taxable)} ${u}`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="سهم بیمه" value={`${fmtMoney(calc.insurance)} ${u}`} strong />
                  <Row label="مالیات حقوق" value={`${fmtMoney(calc.tax)} ${u}`} strong />
                  {calc.childAllowance > 0 && (
                    <Row
                      label={`حق اولاد (${faNum(childCount)} فرزند، معاف)`}
                      value={`+${fmtMoney(calc.childAllowance)} ${u}`}
                      strong
                    />
                  )}
                  <Row label="خالص دریافتی" value={`${fmtMoney(calc.net)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  نرخ بیمه، سقف معافیت و پلکان مالیات قابل ویرایش‌اند؛ نتیجه یک برآورد است و ارقام دقیق را با فیش حقوقی و جدول مصوب سال جاری بسنجید.
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
