'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CarFront, Landmark, Percent, CalendarClock, Info } from 'lucide-react';
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

export default function LeasingKhodro() {
  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('30'); // نرخ سود نمونه — قابل ویرایش
  const [months, setMonths] = useState('36');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pc = p.get('price');
    if (pc && /^\d+$/.test(pc)) setPrice(Number(pc).toLocaleString('en-US'));
    const dp = p.get('down');
    if (dp && /^\d+$/.test(dp)) setDown(Number(dp).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const mo = p.get('months');
    if (mo && /^\d+$/.test(mo)) setMonths(mo);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const priceNum = cleanNum(price);
  const downNum = cleanNum(down);
  const annualRate = Math.max(0, Number(normalizeDigits(rate)) || 0);
  const n = Math.max(0, Math.floor(Number(normalizeDigits(months)) || 0));

  // مبلغ تأمین‌مالی‌شده = قیمت کل منهای پیش‌پرداخت (پیش‌پرداخت حداکثر به اندازهٔ قیمت).
  const financed = Math.max(0, priceNum - Math.min(downNum, priceNum));

  const calc = useMemo(() => {
    if (financed <= 0 || n <= 0) return null;
    const i = annualRate / 100 / 12;
    let installment: number;
    if (i === 0) {
      installment = financed / n;
    } else {
      const pow = Math.pow(1 + i, n);
      installment = (financed * i * pow) / (pow - 1);
    }
    const totalInstallments = installment * n;
    const totalInterest = totalInstallments - financed;
    const totalPayment = totalInstallments + Math.min(downNum, priceNum);
    return {
      installment: Math.round(installment),
      totalInstallments: Math.round(totalInstallments),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  }, [financed, annualRate, n, downNum, priceNum]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبه‌گر اقساط لیزینگ',
      text: `خرید اقساطی ${fmtMoney(priceNum)} ${u} با پیش‌پرداخت ${fmtMoney(Math.min(downNum, priceNum))} ${u} و نرخ ${faNum(String(annualRate))}٪ در ${faNum(String(n))} ماه — قسط ماهانه: ${fmtMoney(calc.installment)} ${u}`,
      params: {
        price: String(priceNum),
        down: String(Math.min(downNum, priceNum)),
        rate: String(annualRate),
        months: String(n),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="محاسبه‌گر اقساط لیزینگ"
      subtitle="محاسبهٔ قسط ماهانه و سود کل خرید اقساطی/لیزینگ بر پایهٔ مبلغ، پیش‌پرداخت و نرخ سود"
      icon={CarFront}
      accent={ACCENT}
      info={[
        {
          icon: <Landmark className="w-4 h-4" />,
          title: 'مبلغ تأمین‌مالی‌شده',
          body: 'قسط بر اساس «مبلغ تأمین‌مالی‌شده» محاسبه می‌شود؛ یعنی قیمت کل خودرو منهای پیش‌پرداخت. هرچه پیش‌پرداخت بیشتر باشد، مبلغ تسهیلات و در نتیجه قسط ماهانه و سود کل کمتر می‌شود.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ سود سالانه',
          body: 'نرخ سود را به‌صورت «سالانه» وارد کنید؛ این نرخ به‌صورت داخلی بر ۱۲ تقسیم می‌شود تا نرخ ماهانه به دست آید. نرخ پیش‌فرض صرفاً نمونه و قابل ویرایش است و باید با نرخ واقعی قرارداد شرکت لیزینگ جایگزین شود.',
        },
        {
          icon: <CalendarClock className="w-4 h-4" />,
          title: 'تعداد اقساط',
          body: 'تعداد اقساط را برحسب «ماه» وارد کنید؛ مثلاً ۳۶ برای سه سال یا ۶۰ برای پنج سال. هرچه دورهٔ بازپرداخت بلندتر باشد، قسط ماهانه کمتر اما مجموع سود پرداختی بیشتر می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'هزینه‌های جانبی',
          body: 'این محاسبه فقط اصل و سود را پوشش می‌دهد. کارمزد، بیمهٔ بدنه و شخص ثالث، مالیات، هزینهٔ کارشناسی و جریمهٔ تأخیر در آن لحاظ نشده و رقم نهایی قرارداد لیزینگ ممکن است متفاوت باشد.',
        },
      ]}
      disclaimer="این برآورد بر پایهٔ فرمول استاندارد اقساط مساوی است و یک تخمین محسوب می‌شود؛ نرخ سود واردشده صرفاً نمونه است. رقم قطعی هر قسط را قرارداد شرکت لیزینگ با احتساب کارمزد و بیمه تعیین می‌کند و باید نرخ روز را راستی‌آزمایی کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="قیمت کل خودرو"
            amount={price}
            setAmount={setPrice}
            unit={unit}
            setUnit={setUnit}
          />

          <MoneyField
            label="پیش‌پرداخت"
            amount={down}
            setAmount={setDown}
            unit={unit}
          />

          <Field label="نرخ سود سالانه" hint="نرخ نمونه و قابل ویرایش — نرخ مصوب قرارداد لیزینگ را وارد کنید">
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
              <EmptyState accent={ACCENT} icon={<CarFront className="w-6 h-6" />}>
                قیمت خودرو، پیش‌پرداخت و تعداد اقساط را وارد کنید تا قسط ماهانه محاسبه شود.
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
                  <Row label="قیمت کل خودرو" value={`${fmtMoney(priceNum)} ${u}`} />
                  <Row label="پیش‌پرداخت" value={`${fmtMoney(Math.min(downNum, priceNum))} ${u}`} />
                  <Row label="مبلغ تأمین‌مالی‌شده" value={`${fmtMoney(financed)} ${u}`} />
                  <Row label="نرخ سود سالانه" value={fmtPct(annualRate)} />
                  <Row label="تعداد اقساط" value={`${faNum(String(n))} ماه`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="قسط ماهانه" value={`${fmtMoney(calc.installment)} ${u}`} strong />
                  <Row label="مجموع اقساط" value={`${fmtMoney(calc.totalInstallments)} ${u}`} strong />
                  <Row label="کل سود پرداختی" value={`${fmtMoney(calc.totalInterest)} ${u}`} strong />
                  <Row label="مبلغ کل بازپرداخت" value={`${fmtMoney(calc.totalPayment)} ${u}`} strong />
                </div>

                {/* جدول بازپرداخت */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted/40 text-[0.7rem] font-black font-display text-muted-foreground">
                    <span className="px-3 py-2.5 text-right">شرح</span>
                    <span className="px-3 py-2.5 text-center">تعداد</span>
                    <span className="px-3 py-2.5 text-left">مبلغ ({u})</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs font-display border-t border-border/60">
                    <span className="px-3 py-2.5 text-right text-muted-foreground">پیش‌پرداخت</span>
                    <span className="px-3 py-2.5 text-center text-muted-foreground">{faNum('1')}</span>
                    <span className="px-3 py-2.5 text-left font-bold tabular-nums">{fmtMoney(Math.min(downNum, priceNum))}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs font-display border-t border-border/60">
                    <span className="px-3 py-2.5 text-right text-muted-foreground">قسط ماهانه</span>
                    <span className="px-3 py-2.5 text-center text-muted-foreground">{faNum(String(n))}</span>
                    <span className="px-3 py-2.5 text-left font-bold tabular-nums">{fmtMoney(calc.installment)}</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs font-display border-t border-border bg-muted/20">
                    <span className="px-3 py-2.5 text-right font-black text-primary">مبلغ کل بازپرداخت</span>
                    <span className="px-3 py-2.5 text-center text-muted-foreground">—</span>
                    <span className="px-3 py-2.5 text-left font-black text-primary tabular-nums">{fmtMoney(calc.totalPayment)}</span>
                  </div>
                </div>

                <Notice accent={ACCENT}>
                  افزایش پیش‌پرداخت یا کاهش تعداد اقساط، مجموع سود پرداختی را کم می‌کند. نرخ سود واردشده نمونه است؛ نرخ روز را راستی‌آزمایی کنید.
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
