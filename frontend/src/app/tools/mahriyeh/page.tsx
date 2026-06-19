'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HeartHandshake, CalendarClock, Gavel, TrendingUp, Coins, BookOpen, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Toggle,
  Stepper,
  Row,
  Headline,
  EmptyState,
  ErrorState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  faNum,
  fmtMoney,
  fmtPct,
  fmtNum,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import {
  CPI_YEARS,
  CPI_BASE_YEAR,
  CPI_SOURCE,
  CPI_LAST_YEAR,
  CPI_LAST_COMPLETE_YEAR,
  getAnnualIndex,
  isProvisionalYear,
} from '@/lib/data/cpi-index';

const ACCENT = '236, 72, 153'; // rose

export default function Mahriyeh() {
  const [coinMode, setCoinMode] = useState(false);

  // cash mehr
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [aqdYear, setAqdYear] = useState(1390);
  const [payYear, setPayYear] = useState(CPI_LAST_YEAR);

  // coin mehr
  const [coinCount, setCoinCount] = useState(14);
  const [coinPrice, setCoinPrice] = useState('');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('mode') === 'coin') setCoinMode(true);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) setAmount(Number(a).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const aq = Number(p.get('aqd'));
    if (aq && CPI_YEARS.includes(aq)) setAqdYear(aq);
    const pa = Number(p.get('pay'));
    if (pa && CPI_YEARS.includes(pa)) setPayYear(pa);
    const c = Number(p.get('coins'));
    if (c) setCoinCount(c);
    const cp = p.get('price');
    if (cp && /^\d+$/.test(cp)) setCoinPrice(Number(cp).toLocaleString('en-US'));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cash = cleanNum(amount);
  const price = cleanNum(coinPrice);

  const calc = useMemo(() => {
    if (coinMode) {
      if (coinCount <= 0 || price <= 0) return null;
      const total = coinCount * price;
      return { kind: 'coin' as const, total };
    }
    if (cash <= 0) return null;
    const iAqd = getAnnualIndex(aqdYear);
    const iPay = getAnnualIndex(payYear);
    if (iAqd == null || iPay == null || iAqd <= 0) return { error: 'شاخص این بازه منتشر نشده است.' };
    if (payYear < aqdYear) return { error: 'سال پرداخت باید بعد از سال عقد باشد.' };
    const updated = Math.round(cash * (iPay / iAqd));
    return {
      kind: 'cash' as const,
      updated,
      growthPct: (iPay / iAqd - 1) * 100,
      factor: iPay / iAqd,
      years: payYear - aqdYear,
      provisional: isProvisionalYear(payYear) || isProvisionalYear(aqdYear),
    };
  }, [coinMode, coinCount, price, cash, aqdYear, payYear]);

  const onShare = () => {
    if (!calc || 'error' in calc) return;
    if (calc.kind === 'coin') {
      share({
        title: 'محاسبهٔ مهریه',
        text: `مهریه: ${faNum(coinCount)} سکه × ${fmtMoney(price)} تومان = ${fmtMoney(calc.total)} تومان`,
        params: { mode: 'coin', coins: String(coinCount), price: String(price) },
      });
    } else {
      share({
        title: 'محاسبهٔ مهریه به نرخ روز',
        text: `مهریه از سال ${faNum(aqdYear)} تا ${faNum(payYear)} → ارزش روز: ${fmtMoney(calc.updated)} ${unitLabel(unit)}`,
        params: { amount: String(cash), unit, aqd: String(aqdYear), pay: String(payYear) },
      });
    }
  };

  const u = unitLabel(unit);

  return (
    <ToolShell
      title="محاسبهٔ مهریه به نرخ روز"
      subtitle="به‌روزرسانی مهریهٔ وجه نقد بر اساس شاخص بانک مرکزی (تبصرهٔ مادهٔ ۱۰۸۲ قانون مدنی) و محاسبهٔ مهریهٔ سکه"
      icon={HeartHandshake}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی (تبصرهٔ مادهٔ ۱۰۸۲)',
          body: 'چنانچه مهریه وجه رایج باشد، به نسبت تغییر شاخص قیمت سالانهٔ زمان پرداخت نسبت به زمان وقوع عقد محاسبه می‌شود؛ مگر آنکه زوجین به نحو دیگری توافق کرده باشند.',
        },
        {
          icon: <Coins className="w-4 h-4" />,
          title: 'مهریهٔ سکه',
          body: 'اگر مهریه سکه (تمام‌بهار آزادی) باشد، ملاکْ نرخ روز سکه در زمان پرداخت است؛ شاخص تورم در آن دخالتی ندارد. کافی است تعداد سکه و نرخ روز را وارد کنید.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'فرمول محاسبهٔ وجه نقد',
          body: 'مهریهٔ روزآمد = مهریهٔ مندرج در عقدنامه × (شاخص سال پرداخت ÷ شاخص سال عقد).',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'منبع داده‌ها',
          body: `شاخص سالانه از نرخ تورم رسمی ${CPI_SOURCE} بازسازی شده است (پایهٔ ${faNum(CPI_BASE_YEAR)}=۱۰۰). آخرین سال قطعی ${faNum(CPI_LAST_COMPLETE_YEAR)} و سال ${faNum(CPI_LAST_YEAR)} تخمینی است.`,
        },
      ]}
      disclaimer="این محاسبه راهنماست. مبنای قطعی، نظر کارشناس رسمی و حکم دادگاه است. در تعیین مهریهٔ سکه نیز قیمت روز در زمان اجرای حکم ملاک است."
    >
      <TwoPane>
        <Panel className="space-y-8">
          <Toggle
            label="مهریه از نوع سکه است"
            hint="برای مهریهٔ سکه فعال کنید؛ در غیر این صورت محاسبهٔ وجه نقد انجام می‌شود."
            checked={coinMode}
            onChange={setCoinMode}
          />

          {coinMode ? (
            <div className="space-y-6">
              <Stepper
                label="تعداد سکهٔ تمام‌بهار آزادی"
                hint="تعداد سکهٔ مندرج در عقدنامه"
                value={coinCount}
                onChange={setCoinCount}
                min={0}
                max={9999}
              />
              <MoneyField
                label="نرخ روز هر سکه (تومان)"
                amount={coinPrice}
                setAmount={setCoinPrice}
                unit="toman"
              />
            </div>
          ) : (
            <>
              <MoneyField
                label="مهریهٔ مندرج در عقدنامه"
                amount={amount}
                setAmount={setAmount}
                unit={unit}
                setUnit={setUnit}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  icon={<Gavel className="w-4 h-4" />}
                  label="سال عقد"
                  hint="سالی که عقد نکاح واقع شده"
                  value={aqdYear}
                  onChange={(v) => setAqdYear(Number(v))}
                >
                  {[...CPI_YEARS].reverse().map((y) => (
                    <option key={y} value={y}>
                      {faNum(y)}
                      {isProvisionalYear(y) ? ' (جاری)' : ''}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  icon={<CalendarClock className="w-4 h-4" />}
                  label="سال پرداخت"
                  hint="سالی که مهریه مطالبه/پرداخت می‌شود"
                  value={payYear}
                  onChange={(v) => setPayYear(Number(v))}
                >
                  {[...CPI_YEARS].reverse().map((y) => (
                    <option key={y} value={y}>
                      {faNum(y)}
                      {isProvisionalYear(y) ? ' (جاری)' : ''}
                    </option>
                  ))}
                </SelectField>
              </div>
            </>
          )}
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<HeartHandshake className="w-6 h-6" />}>
                {coinMode ? 'تعداد سکه و نرخ روز را وارد کنید.' : 'مهریه و سال‌ها را وارد کنید تا ارزش روز محاسبه شود.'}
              </EmptyState>
            ) : 'error' in calc ? (
              <ErrorState>{calc.error}</ErrorState>
            ) : calc.kind === 'coin' ? (
              <motion.div key="coin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="ارزش کل مهریه (سکه)"
                  value={fmtMoney(calc.total)}
                  suffix="تومان"
                  sub={`${toWords(calc.total)} تومان`}
                />
                <div className="space-y-2.5">
                  <Row label="تعداد سکه" value={`${faNum(coinCount)} عدد`} />
                  <Row label="نرخ روز هر سکه" value={`${fmtMoney(price)} تومان`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ارزش کل" value={`${fmtMoney(calc.total)} تومان`} strong />
                </div>
                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            ) : (
              <motion.div key="cash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="ارزش روز مهریه"
                  value={fmtMoney(calc.updated)}
                  suffix={u}
                  sub={`${toWords(calc.updated)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="مهریهٔ عقدنامه" value={`${fmtMoney(cash)} ${u}`} />
                  <Row
                    label="افزایش ارزش"
                    value={<span style={{ color: `rgb(${ACCENT})` }}>+ {fmtMoney(calc.updated - cash)} {u}</span>}
                    strong
                  />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ارزش روز" value={`${fmtMoney(calc.updated)} ${u}`} strong />
                </div>
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  <Row label="رشد شاخص قیمت" value={<span className="inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {fmtPct(calc.growthPct)}</span>} />
                  <Row label="بازهٔ زمانی" value={calc.years > 0 ? `${faNum(calc.years)} سال` : 'کمتر از یک سال'} />
                  <Row label="ضریب روزآمدسازی" value={`× ${fmtNum(calc.factor)}`} />
                </div>
                {calc.provisional && (
                  <Notice accent={ACCENT}>
                    شاخص سال {faNum(CPI_LAST_YEAR)} تخمینی است (بر پایهٔ آخرین نرخ تورم نقطه‌به‌نقطه)؛ متوسط سالانهٔ قطعی آن هنوز منتشر نشده است.
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
