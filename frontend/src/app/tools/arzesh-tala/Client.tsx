'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Coins, Scale, Gem, TrendingUp, Info, RefreshCw, Download } from 'lucide-react';
import { useMarketPrice } from '@/components/tools/useMarketPrice';
import { pdateFromGregorian, formatPDate } from '@/components/tools/DatePicker';
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
  fmtMoney,
  fmtNum,
  toWords,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '234, 179, 8'; // gold / amber-500

export default function ArzeshTala() {
  const [weight, setWeight] = useState('');
  const [karat, setKarat] = useState('750'); // عیار (مبنای ۱۰۰۰) — قابل ویرایش / نمونه
  const [pricePure, setPricePure] = useState(''); // قیمت روز هر گرم طلای خام (عیار ۱۰۰۰) — کاربر وارد می‌کند
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();
  const { prices, updatedAt, loading, error, refresh } = useMarketPrice();
  const autoFilledRef = useRef(false);

  // قیمت بازار هر گرم طلای خام (۲۴ عیار) را بر اساس واحد جاری به مقدار فیلد تبدیل می‌کند
  const marketFieldValue = (gram24: number, u: Unit): string => {
    const v = Math.round(u === 'rial' ? gram24 * 10 : gram24);
    return v > 0 ? v.toLocaleString('en-US') : '';
  };

  const applyMarketPrice = () => {
    const g24 = prices?.gram24;
    if (!g24 || g24 <= 0) return;
    const v = marketFieldValue(g24, unit);
    if (v) setPricePure(v);
  };

  // پر کردن خودکار قیمت در نخستین دریافت موفق، تنها اگر فیلد خالی باشد
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (autoFilledRef.current) return;
    const g24 = prices?.gram24;
    if (loading || !g24 || g24 <= 0) return;
    autoFilledRef.current = true;
    setPricePure((prev) => {
      if (prev && prev.trim()) return prev; // کاربر/URL مقدار دارد — دست نمی‌زنیم
      return marketFieldValue(g24, unit);
    });
  }, [prices, loading, unit]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // تاریخ جلالی نرخ بازار از updatedAt («YYYY-MM-DD HH:MM:SS» میلادی)
  const marketJalali = useMemo(() => {
    if (!updatedAt) return '';
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(updatedAt.trim());
    if (!m) return '';
    try {
      return formatPDate(pdateFromGregorian(Number(m[1]), Number(m[2]), Number(m[3])));
    } catch {
      return '';
    }
  }, [updatedAt]);

  const hasMarketPrice = !!(prices?.gram24 && prices.gram24 > 0);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get('weight');
    if (w && /^\d*\.?\d+$/.test(w)) setWeight(w);
    const k = p.get('karat');
    if (k && /^\d*\.?\d+$/.test(k)) setKarat(k);
    const pr = p.get('price');
    if (pr && /^\d+$/.test(pr)) setPricePure(Number(pr).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const weightNum = Math.max(0, Number(normalizeDigits(weight)) || 0);
  const karatNum = Math.max(0, Number(normalizeDigits(karat)) || 0);
  const pricePureNum = Number(normalizeDigits(pricePure).replace(/,/g, '')) || 0;

  const calc = useMemo(() => {
    if (weightNum <= 0 || pricePureNum <= 0 || karatNum <= 0) return null;
    // ارزش = وزن × (عیار / ۱۰۰۰) × قیمت هر گرم طلای خام (عیار ۱۰۰۰)
    const purity = karatNum / 1000;
    const pureWeight = weightNum * purity; // معادل وزن طلای خالص (۲۴ عیار)
    const value = weightNum * purity * pricePureNum;
    return {
      value: Math.round(value),
      pureWeight,
      purity,
    };
  }, [weightNum, karatNum, pricePureNum]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'ارزش طلا و آب‌شده',
      text: `${faNum(fmtNum(weightNum, 3))} گرم طلای عیار ${faNum(String(karatNum))} — ارزش: ${fmtMoney(calc.value)} ${u}`,
      params: {
        weight: String(weightNum),
        karat: String(karatNum),
        price: String(pricePureNum),
        unit,
      },
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="ارزش طلا و آب‌شده"
      subtitle="محاسبهٔ ارزش طلا بر اساس وزن، عیار و قیمت روز هر گرم طلای خام"
      icon={Coins}
      accent={ACCENT}
      info={[
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'وزن طلا',
          body: 'وزن طلا را برحسب «گرم» وارد کنید. برای طلای آب‌شده معمولاً وزن خالص قطعه پس از ذوب ملاک است. اعشار مجاز است؛ مثلاً ۴٫۳۵ گرم.',
        },
        {
          icon: <Gem className="w-4 h-4" />,
          title: 'عیار (مبنای ۱۰۰۰)',
          body: 'عیار میزان خلوص طلاست بر پایهٔ ۱۰۰۰. طلای ۱۸ عیار معادل ۷۵۰، طلای ۲۱ عیار معادل ۸۷۵ و طلای ۲۴ عیار (خام/خالص) معادل ۱۰۰۰ است. عیار پیش‌فرض (۷۵۰) صرفاً نمونه و قابل ویرایش است.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'قیمت روز هر گرم طلای خام',
          body: 'قیمت هر گرم طلای خام (عیار ۱۰۰۰ / ۲۴ عیار) را از منبع معتبر بازار وارد کنید. این رقم پیش‌فرض ندارد و باید با نرخ لحظه‌ای بازار جایگزین شود؛ نتیجه مستقیماً به آن وابسته است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'اجرت و سود و مالیات',
          body: 'این محاسبه فقط «ارزش ذاتی فلز طلا» را برمی‌گرداند. اجرت ساخت، سود فروشنده، مالیات بر ارزش افزوده و کارمزدها در آن لحاظ نشده و قیمت نهایی خرید یا فروش ممکن است متفاوت باشد.',
        },
      ]}
      disclaimer={
        <>
          قیمت روز هر گرم طلا را <strong className="text-foreground">کاربر وارد می‌کند</strong> و
          این ابزار آن را اعتبارسنجی نمی‌کند؛ نتیجه صرفاً یک «برآورد» از ارزش ذاتی طلاست. پیش از خرید
          یا فروش، نرخ روز و عیار را از منبع معتبر بررسی کنید.
        </>
      }
    >
      <TwoPane>
        <Panel className="space-y-7">
          <Field label="وزن طلا (گرم)" hint="وزن قطعه یا طلای آب‌شده برحسب گرم — اعشار مجاز است">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(weight)}
              onChange={(e) => setWeight(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="وزن طلا به گرم"
              className={inputClass}
            />
          </Field>

          <Field label="عیار (مبنای ۱۰۰۰)" hint="۱۸ عیار = ۷۵۰، ۲۱ عیار = ۸۷۵، ۲۴ عیار (خام) = ۱۰۰۰ — مقدار پیش‌فرض نمونه و قابل ویرایش است">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(karat)}
              onChange={(e) => setKarat(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              dir="ltr"
              aria-label="عیار طلا بر مبنای هزار"
              className={inputClass}
            />
          </Field>

          <Field label="قیمت روز هر گرم طلای خام (۲۴ عیار)" hint="نرخ لحظه‌ای بازار را وارد کنید؛ این رقم پیش‌فرض ندارد">
            <div
              className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs"
              dir="rtl"
            >
              {loading ? (
                <span className="text-muted-foreground">در حال دریافت نرخ بازار…</span>
              ) : error || !hasMarketPrice ? (
                <span className="text-muted-foreground/70">
                  دریافت نرخ بازار ناموفق بود — قیمت را دستی وارد کنید.
                </span>
              ) : (
                <>
                  <span className="font-bold text-foreground/80">
                    نرخ بازار آزاد
                    {marketJalali ? (
                      <span className="font-normal text-muted-foreground"> · {marketJalali}</span>
                    ) : null}
                    <span className="font-normal text-muted-foreground/70"> (تقریبی)</span>
                  </span>
                  <button
                    type="button"
                    onClick={applyMarketPrice}
                    aria-label="استفاده از قیمت بازار"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 font-bold text-primary transition-colors hover:border-primary"
                  >
                    <Download className="h-3 w-3" />
                    استفاده از قیمت بازار
                  </button>
                  <button
                    type="button"
                    onClick={refresh}
                    aria-label="به‌روزرسانی نرخ بازار"
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background p-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={faNum(pricePure)}
                onChange={(e) => {
                  const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
                  setPricePure(v ? Number(v).toLocaleString('en-US') : '');
                }}
                dir="ltr"
                aria-label="قیمت روز هر گرم طلای خام"
                className={`${inputClass} pl-14`}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40">
                {u}
              </span>
            </div>
          </Field>

          <div className="flex bg-muted p-0.5 rounded-lg border border-border w-fit mr-auto">
            {(['toman', 'rial'] as const).map((uu) => (
              <button
                key={uu}
                onClick={() => setUnit(uu)}
                aria-label={`واحد ${unitLabel(uu)}`}
                className={`px-3 py-1 rounded-md text-xs font-black transition-all ${
                  unit === uu ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {unitLabel(uu)}
              </button>
            ))}
          </div>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Coins className="w-6 h-6" />}>
                وزن، عیار و قیمت روز هر گرم طلای خام را وارد کنید تا ارزش طلا محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="ارزش طلا"
                  value={fmtMoney(calc.value)}
                  suffix={u}
                  sub={`${toWords(calc.value)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="وزن طلا" value={`${faNum(fmtNum(weightNum, 3))} گرم`} />
                  <Row label="عیار" value={`${faNum(String(karatNum))} (مبنای ۱۰۰۰)`} />
                  <Row label="قیمت هر گرم طلای خام" value={`${fmtMoney(pricePureNum)} ${u}`} />
                  <Row label="معادل طلای خالص" value={`${faNum(fmtNum(calc.pureWeight, 3))} گرم`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ارزش ذاتی طلا" value={`${fmtMoney(calc.value)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  این رقم فقط ارزش فلز طلاست؛ اجرت ساخت، سود فروشنده و مالیات بر ارزش افزوده در آن لحاظ نشده است.
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
