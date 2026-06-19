'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Building2, Home, Store, BookOpen, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Row,
  Headline,
  EmptyState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  fmtMoney,
  fmtPct,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { PROPERTY_TRANSFER_TAX } from '@/lib/data/legal-rates';

const ACCENT = '15, 118, 110'; // teal-700

export default function MaliyatNaghlMelk() {
  const [value, setValue] = useState('');
  const [goodwill, setGoodwill] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get('value');
    if (v && /^\d+$/.test(v)) setValue(Number(v).toLocaleString('en-US'));
    const g = p.get('goodwill');
    if (g && /^\d+$/.test(g)) setGoodwill(Number(g).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const val = cleanNum(value);
  const gw = cleanNum(goodwill);

  const calc = useMemo(() => {
    if (val <= 0 && gw <= 0) return null;
    const transferTax = val * PROPERTY_TRANSFER_TAX.transferRate;
    const goodwillTax = gw * PROPERTY_TRANSFER_TAX.goodwillRate;
    return {
      transferTax: Math.round(transferTax),
      goodwillTax: Math.round(goodwillTax),
      total: Math.round(transferTax + goodwillTax),
    };
  }, [val, gw]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مالیات نقل و انتقال ملک',
      text: `مالیات نقل و انتقال ملک: ${fmtMoney(calc.total)} ${u}`,
      params: { value: String(val), goodwill: String(gw), unit },
    });
  };

  return (
    <ToolShell
      title="مالیات نقل و انتقال ملک"
      subtitle="محاسبهٔ مالیات نقل و انتقال قطعی املاک و حق واگذاری محل (سرقفلی) بر اساس قانون مالیات‌های مستقیم"
      icon={Building2}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مادهٔ ۵۹ ق.م.م',
          body: 'مالیات نقل و انتقال قطعی املاک، ۵٪ «ارزش معاملاتی» ملک است. این مالیات بر عهدهٔ فروشنده (انتقال‌دهنده) است و هنگام تنظیم سند در دفترخانه وصول می‌شود.',
        },
        {
          icon: <Home className="w-4 h-4" />,
          title: 'ارزش معاملاتی، نه قیمت روز',
          body: 'مأخذ مالیات، «ارزش معاملاتی» (ارزش منطقه‌ای) است که کمیسیون تقویم املاک هر منطقه طبق مادهٔ ۶۴ تعیین می‌کند؛ این رقم معمولاً بسیار کمتر از قیمت بازار است و در استعلام دفترخانه مشخص می‌شود.',
        },
        {
          icon: <Store className="w-4 h-4" />,
          title: 'حق واگذاری محل (سرقفلی)',
          body: 'اگر سرقفلی یا حق کسب و پیشه نیز منتقل شود، ۲٪ «ارزش روز» آن به‌عنوان مالیات حق واگذاری محل اخذ می‌شود (تبصرهٔ مادهٔ ۵۹).',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'معافیت‌ها و هزینه‌های دیگر',
          body: 'علاوه بر این مالیات، هزینه‌های دفترخانه (حق‌الثبت و حق‌التحریر) و تسویهٔ عوارض شهرداری و دارایی جداگانه است. برخی انتقالات (مانند بین زوجین یا بلاعوض به فرزند) معافیت یا تخفیف دارند.',
        },
      ]}
      disclaimer="مأخذ دقیق (ارزش معاملاتی) را دفترخانهٔ اسناد رسمی از سامانهٔ مالیاتی استعلام می‌کند؛ این برآورد راهنماست."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="ارزش معاملاتی ملک"
            amount={value}
            setAmount={setValue}
            unit={unit}
            setUnit={setUnit}
          />
          <MoneyField
            label="ارزش روز سرقفلی (اختیاری)"
            amount={goodwill}
            setAmount={setGoodwill}
            unit={unit}
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Building2 className="w-6 h-6" />}>
                ارزش معاملاتی ملک را وارد کنید تا مالیات محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="جمع مالیات نقل و انتقال"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  {val > 0 && (
                    <>
                      <Row label="ارزش معاملاتی" value={`${fmtMoney(val)} ${u}`} />
                      <Row
                        label={`مالیات نقل و انتقال (${fmtPct(PROPERTY_TRANSFER_TAX.transferRate * 100)})`}
                        value={`${fmtMoney(calc.transferTax)} ${u}`}
                      />
                    </>
                  )}
                  {gw > 0 && (
                    <>
                      <Row label="ارزش روز سرقفلی" value={`${fmtMoney(gw)} ${u}`} />
                      <Row
                        label={`مالیات حق واگذاری محل (${fmtPct(PROPERTY_TRANSFER_TAX.goodwillRate * 100)})`}
                        value={`${fmtMoney(calc.goodwillTax)} ${u}`}
                      />
                    </>
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع کل مالیات" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  مأخذ مالیات «ارزش معاملاتی» است نه قیمت بازار؛ رقم واقعی را دفترخانه از سامانهٔ مالیاتی استعلام می‌کند.
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
