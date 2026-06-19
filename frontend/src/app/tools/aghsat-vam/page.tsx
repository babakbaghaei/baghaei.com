'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, Landmark, Percent, CalendarClock, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
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
  fmtMoney,
  fmtPct,
  toWords,
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '217, 119, 6'; // amber-600

export default function AghsatVam() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('23');
  const [months, setMonths] = useState('36');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pr = p.get('principal');
    if (pr && /^\d+$/.test(pr)) setPrincipal(Number(pr).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const mo = p.get('months');
    if (mo && /^\d+$/.test(mo)) setMonths(mo);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const principalNum = cleanNum(principal);
  const annualRate = Math.max(0, Number(normalizeDigits(rate)) || 0);
  const n = Math.max(0, Math.floor(Number(normalizeDigits(months)) || 0));

  const calc = useMemo(() => {
    if (principalNum <= 0 || n <= 0) return null;
    const i = annualRate / 100 / 12;
    let installment: number;
    if (i === 0) {
      installment = principalNum / n;
    } else {
      const pow = Math.pow(1 + i, n);
      installment = (principalNum * i * pow) / (pow - 1);
    }
    const totalPayment = installment * n;
    const totalInterest = totalPayment - principalNum;
    return {
      installment: Math.round(installment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [principalNum, annualRate, n]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبه‌گر اقساط وام',
      text: `وام ${fmtMoney(principalNum)} ${u} با نرخ ${faNum(String(annualRate))}٪ در ${faNum(String(n))} ماه — قسط ماهانه: ${fmtMoney(calc.installment)} ${u}`,
      params: {
        principal: String(principalNum),
        rate: String(annualRate),
        months: String(n),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="محاسبه‌گر اقساط وام"
      subtitle="محاسبهٔ قسط ماهانه، سود کل و بازپرداخت وام بانکی بر پایهٔ فرمول اقساط مساوی"
      icon={Wallet}
      accent={ACCENT}
      info={[
        {
          icon: <Landmark className="w-4 h-4" />,
          title: 'روش اقساط مساوی',
          body: 'این ماشین‌حساب وام را به روش «اقساط مساوی» (Annuity) محاسبه می‌کند؛ یعنی مبلغ هر قسط در تمام دوره ثابت است و بخشی از آن بابت سود و بخشی بابت اصل وام است. بیشتر تسهیلات بانکی ایران به همین روش بازپرداخت می‌شوند.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ سود سالانه',
          body: 'نرخ سود را به‌صورت «سالانه» وارد کنید (نرخ مصوب تسهیلات بانکی)؛ این نرخ به‌صورت داخلی بر ۱۲ تقسیم می‌شود تا نرخ ماهانه به دست آید. نرخ پیش‌فرض صرفاً نمونه است و باید با نرخ قرارداد شما جایگزین شود.',
        },
        {
          icon: <CalendarClock className="w-4 h-4" />,
          title: 'تعداد اقساط',
          body: 'تعداد اقساط را برحسب «ماه» وارد کنید؛ برای وام پنج‌ساله ۶۰، برای سه‌ساله ۳۶. هرچه دورهٔ بازپرداخت بلندتر باشد، قسط ماهانه کمتر اما مجموع سود پرداختی بیشتر می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'هزینه‌های جانبی',
          body: 'این محاسبه فقط اصل و سود را پوشش می‌دهد. کارمزدها، بیمهٔ تسهیلات، جریمهٔ تأخیر و مدت تنفس احتمالی در آن لحاظ نشده و رقم نهایی قرارداد ممکن است اندکی متفاوت باشد.',
        },
      ]}
      disclaimer="این برآورد بر پایهٔ فرمول استاندارد اقساط مساوی است؛ رقم قطعی هر قسط را قرارداد بانک با احتساب کارمزد و بیمه تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="مبلغ وام"
            amount={principal}
            setAmount={setPrincipal}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="نرخ سود سالانه" hint="نرخ مصوب تسهیلات را وارد کنید">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ سود سالانه به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>

          <Field label="تعداد اقساط (ماه)" hint="مثلاً ۳۶ برای سه سال، ۶۰ برای پنج سال">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(months)}
              onChange={(e) => setMonths(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="تعداد اقساط به ماه"
              className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all"
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Wallet className="w-6 h-6" />}>
                مبلغ وام و تعداد اقساط را وارد کنید تا قسط ماهانه محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="قسط ماهانه"
                  value={fmtMoney(calc.installment)}
                  suffix={u}
                  sub={`${toWords(calc.installment)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="مبلغ وام" value={`${fmtMoney(principalNum)} ${u}`} />
                  <Row label="نرخ سود سالانه" value={fmtPct(annualRate)} />
                  <Row label="تعداد اقساط" value={`${faNum(String(n))} ماه`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="قسط ماهانه" value={`${fmtMoney(calc.installment)} ${u}`} strong />
                  <Row label="مجموع بازپرداخت" value={`${fmtMoney(calc.totalPayment)} ${u}`} strong />
                  <Row label="کل سود پرداختی" value={`${fmtMoney(calc.totalInterest)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  افزایش تعداد اقساط، قسط ماهانه را کم اما مجموع سود پرداختی را زیاد می‌کند.
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
