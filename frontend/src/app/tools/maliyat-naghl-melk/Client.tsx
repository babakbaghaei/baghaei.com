'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Landmark, Percent, Stamp, Info, KeyRound } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Field,
  RateField,
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
import { PROPERTY_TRANSFER_TAX } from '@/lib/data/legal-rates';

const ACCENT = '13, 148, 136'; // teal-600 — املاک

export default function MaliyatNaghlMelk() {
  const [base, setBase] = useState(''); // ارزش معاملاتی ملک
  const [rate, setRate] = useState(String(PROPERTY_TRANSFER_TAX.transferRate * 100)); // نرخ رسمی نقل‌وانتقال ۵٪ (م.۵۹ ق.م.م) — قابل ویرایش
  const [stampRate, setStampRate] = useState('0.5'); // نرخ حق تمبر (قابل ویرایش، نمونه)
  const [goodwill, setGoodwill] = useState(''); // ارزش روز حق واگذاری محل (سرقفلی) — اختیاری
  const [goodwillRate, setGoodwillRate] = useState(String(PROPERTY_TRANSFER_TAX.goodwillRate * 100)); // نرخ رسمی سرقفلی ۲٪ — قابل ویرایش
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
    const gw = p.get('gw');
    if (gw && /^\d+$/.test(gw)) setGoodwill(Number(gw).toLocaleString('en-US'));
    const gwr = p.get('gwRate');
    if (gwr && /^\d*\.?\d+$/.test(gwr)) setGoodwillRate(gwr);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const baseNum = cleanNum(base);
  const transferRate = Math.max(0, Number(normalizeDigits(rate)) || 0);
  const stampPct = Math.max(0, Number(normalizeDigits(stampRate)) || 0);
  const goodwillNum = cleanNum(goodwill);
  const goodwillPct = Math.max(0, Number(normalizeDigits(goodwillRate)) || 0);

  const calc = useMemo(() => {
    if (baseNum <= 0 && goodwillNum <= 0) return null;
    const transferTax = baseNum * (transferRate / 100);
    const stampDuty = baseNum * (stampPct / 100);
    const goodwillTax = goodwillNum * (goodwillPct / 100);
    const total = transferTax + stampDuty + goodwillTax;
    return {
      transferTax: Math.round(transferTax),
      stampDuty: Math.round(stampDuty),
      goodwillTax: Math.round(goodwillTax),
      total: Math.round(total),
    };
  }, [baseNum, transferRate, stampPct, goodwillNum, goodwillPct]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مالیات نقل‌وانتقال ملک',
      text: `ارزش معاملاتی ${fmtMoney(baseNum)} ${u} با نرخ ${faNum(String(transferRate))}٪${goodwillNum > 0 ? ` + سرقفلی ${fmtMoney(goodwillNum)} ${u}` : ''} — مجموع مالیات و حق تمبر: ${fmtMoney(calc.total)} ${u}`,
      params: {
        base: String(baseNum),
        rate: String(transferRate),
        stampRate: String(stampPct),
        gw: String(goodwillNum),
        gwRate: String(goodwillPct),
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
          icon: <KeyRound className="w-4 h-4" />,
          title: 'مالیات سرقفلی (حق واگذاری محل)',
          body: 'در صورت انتقال حق واگذاری محل (سرقفلی)، مطابق مادهٔ ۵۹ قانون مالیات‌های مستقیم دو درصد (۲٪) «ارزش روز» آن به‌عنوان مالیات دریافت می‌شود. اگر همراه ملک، سرقفلی نیز منتقل می‌شود، ارزش روز آن را وارد کنید تا مالیاتش جداگانه افزوده شود.',
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

          <RateField
            label="نرخ مالیات نقل‌وانتقال"
            official={PROPERTY_TRANSFER_TAX.transferRate * 100}
            value={rate}
            onChange={setRate}
            source="م.۵۹ ق.م.م"
            hint="نرخ رسمی ۵٪ ارزش معاملاتی است. برای موارد خاص (معافیت یا نرخ ویژه) «نرخ دلخواه» را بزنید."
          />

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

          <MoneyField
            label="ارزش روز حق واگذاری محل / سرقفلی (اختیاری)"
            amount={goodwill}
            setAmount={setGoodwill}
            unit={unit}
          />

          <RateField
            label="نرخ مالیات سرقفلی"
            official={PROPERTY_TRANSFER_TAX.goodwillRate * 100}
            value={goodwillRate}
            onChange={setGoodwillRate}
            source="م.۵۹ ق.م.م"
            hint="نرخ رسمی ۲٪ ارزش روزِ حق واگذاری محل است؛ برای تغییر، «نرخ دلخواه» را بزنید."
          />
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
                  {goodwillNum > 0 && (
                    <>
                      <Row label="ارزش روز سرقفلی" value={`${fmtMoney(goodwillNum)} ${u}`} />
                      <Row label="نرخ سرقفلی" value={fmtPct(goodwillPct)} />
                      <Row label="مالیات سرقفلی" value={`${fmtMoney(calc.goodwillTax)} ${u}`} strong />
                    </>
                  )}
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
