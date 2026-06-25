'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Landmark, Percent, Stamp, Info } from 'lucide-react';
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

const ACCENT = '13, 148, 136'; // teal-600 — املاک

export default function MaliyatNaghlMelk() {
  const [base, setBase] = useState(''); // ارزش معاملاتی ملک
  const [rate, setRate] = useState('5'); // نرخ مالیات نقل‌وانتقال (قابل ویرایش، نمونه)
  const [stampRate, setStampRate] = useState('0.5'); // نرخ حق تمبر (قابل ویرایش، نمونه)
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = p.get('base');
    if (b && /^\d+$/.test(b)) setBase(Number(b).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const st = p.get('stampRate');
    if (st && /^\d*\.?\d+$/.test(st)) setStampRate(st);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const baseNum = cleanNum(base);
  const transferRate = Math.max(0, Number(normalizeDigits(rate)) || 0);
  const stampPct = Math.max(0, Number(normalizeDigits(stampRate)) || 0);

  const calc = useMemo(() => {
    if (baseNum <= 0) return null;
    const transferTax = baseNum * (transferRate / 100);
    const stampDuty = baseNum * (stampPct / 100);
    const total = transferTax + stampDuty;
    return {
      transferTax: Math.round(transferTax),
      stampDuty: Math.round(stampDuty),
      total: Math.round(total),
    };
  }, [baseNum, transferRate, stampPct]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مالیات نقل‌وانتقال ملک',
      text: `ارزش معاملاتی ${fmtMoney(baseNum)} ${u} با نرخ ${faNum(String(transferRate))}٪ — مجموع مالیات و حق تمبر: ${fmtMoney(calc.total)} ${u}`,
      params: {
        base: String(baseNum),
        rate: String(transferRate),
        stampRate: String(stampPct),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="مالیات نقل‌وانتقال ملک"
      subtitle="برآورد مالیات نقل‌وانتقال املاک بر اساس ارزش معاملاتی و نرخ قابل تنظیم"
      icon={Building2}
      accent={ACCENT}
      info={[
        {
          icon: <Landmark className="w-4 h-4" />,
          title: 'مأخذ محاسبه: ارزش معاملاتی',
          body: 'مالیات نقل‌وانتقال قطعی املاک بر مبنای «ارزش معاملاتی» محاسبه می‌شود نه قیمت بازار یا مبلغ مندرج در مبایعه‌نامه. ارزش معاملاتی هر منطقه را کمیسیون تقویم املاک (موضوع مادهٔ ۶۴ قانون مالیات‌های مستقیم) تعیین و ادارهٔ امور مالیاتی اعلام می‌کند.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ مالیات نقل‌وانتقال',
          body: 'طبق مادهٔ ۵۹ قانون مالیات‌های مستقیم، نرخ پایه پنج درصد (۵٪) ارزش معاملاتی است. نرخ پیش‌فرض این ابزار صرفاً نمونه و قابل ویرایش است؛ آن را با نرخ مصوب جاری و شرایط خاص ملک خود (مانند معافیت‌ها یا نرخ‌های ویژه) جایگزین کنید.',
        },
        {
          icon: <Stamp className="w-4 h-4" />,
          title: 'حق تمبر',
          body: 'علاوه بر مالیات نقل‌وانتقال، حق تمبر نیز بر مبنای ارزش معاملاتی دریافت می‌شود. این نرخ نیز در ورودی قابل ویرایش است تا با مقررات روز هماهنگ شود؛ مقدار پیش‌فرض تنها یک نمونه است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'هزینه‌های جانبی',
          body: 'این برآورد فقط مالیات نقل‌وانتقال و حق تمبر را پوشش می‌دهد. هزینهٔ دفترخانه، حق‌الثبت، عوارض شهرداری، مالیات بر عایدی احتمالی و سایر هزینه‌های انتقال سند در آن لحاظ نشده‌اند.',
        },
      ]}
      disclaimer="این یک برآورد است. ارزش معاملاتی ملک را ادارهٔ دارایی تعیین می‌کند و نرخ‌ها قابل ویرایش‌اند؛ پیش از اقدام، نرخ‌های رسمی روز و رقم قطعی را از ادارهٔ امور مالیاتی تأیید کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="ارزش معاملاتی ملک"
            amount={base}
            setAmount={setBase}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="نرخ مالیات نقل‌وانتقال" hint="نرخ مصوب جاری را وارد کنید؛ پیش‌فرض ۵٪ صرفاً نمونه و قابل ویرایش است">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ مالیات نقل‌وانتقال به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>

          <Field label="نرخ حق تمبر" hint="نرخ حق تمبر بر مبنای ارزش معاملاتی؛ قابل ویرایش (پیش‌فرض نمونه)">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(stampRate)}
                onChange={(e) => setStampRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ حق تمبر به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Building2 className="w-6 h-6" />}>
                ارزش معاملاتی ملک را وارد کنید تا مالیات نقل‌وانتقال و حق تمبر برآورد شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="مجموع مالیات و حق تمبر"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="ارزش معاملاتی ملک" value={`${fmtMoney(baseNum)} ${u}`} />
                  <Row label="نرخ مالیات نقل‌وانتقال" value={fmtPct(transferRate)} />
                  <Row label="نرخ حق تمبر" value={fmtPct(stampPct)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="مالیات نقل‌وانتقال" value={`${fmtMoney(calc.transferTax)} ${u}`} strong />
                  <Row label="حق تمبر" value={`${fmtMoney(calc.stampDuty)} ${u}`} strong />
                  <Row label="مجموع قابل پرداخت" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  مأخذ این برآورد «ارزش معاملاتی» اعلامی ادارهٔ دارایی است نه قیمت بازار؛ نرخ‌ها قابل ویرایش‌اند و باید با مصوبات روز جایگزین شوند.
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
