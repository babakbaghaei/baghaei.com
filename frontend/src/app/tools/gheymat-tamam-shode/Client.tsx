'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Percent, Tag, TrendingUp, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Field,
  SelectField,
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

type Mode = 'markup' | 'price';

const MODES: { value: Mode; label: string }[] = [
  { value: 'markup', label: 'از روی درصد سود (markup)' },
  { value: 'price', label: 'از روی قیمت فروش' },
];

export default function GheymatTamamShode() {
  const [mode, setMode] = useState<Mode>('markup');
  const [cost, setCost] = useState('');
  const [markup, setMarkup] = useState('30'); // ← درصد سود قابل‌ویرایش (نمونه)
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const md = p.get('mode');
    if (md === 'markup' || md === 'price') setMode(md);
    const c = p.get('cost');
    if (c && /^\d+$/.test(c)) setCost(Number(c).toLocaleString('en-US'));
    const mk = p.get('markup');
    if (mk && /^\d*\.?\d+$/.test(mk)) setMarkup(mk);
    const pr = p.get('price');
    if (pr && /^\d+$/.test(pr)) setPrice(Number(pr).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const costNum = cleanNum(cost);
  const markupNum = Math.max(0, Number(normalizeDigits(markup)) || 0);
  const priceNum = cleanNum(price);

  const calc = useMemo(() => {
    if (costNum <= 0) return null;

    let sellPrice: number;
    if (mode === 'markup') {
      sellPrice = costNum * (1 + markupNum / 100);
    } else {
      if (priceNum <= 0) return null;
      if (priceNum < costNum) {
        return {
          error: 'قیمت فروش از بهای تمام‌شده کمتر است؛ در این حالت معامله به‌جای سود، زیان دارد.',
        } as const;
      }
      sellPrice = priceNum;
    }

    const profit = sellPrice - costNum;
    // markup = سود نسبت به بهای تمام‌شده / margin = سود نسبت به قیمت فروش
    const markupPct = costNum > 0 ? (profit / costNum) * 100 : 0;
    const marginPct = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;

    return {
      sellPrice: Math.round(sellPrice),
      profit: Math.round(profit),
      markupPct,
      marginPct,
    };
  }, [mode, costNum, markupNum, priceNum]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc || 'error' in calc) return;
    share({
      title: 'قیمت تمام‌شده و سود',
      text: `بهای تمام‌شده ${fmtMoney(costNum)} ${u} — قیمت فروش: ${fmtMoney(calc.sellPrice)} ${u}، سود: ${fmtMoney(calc.profit)} ${u} (حاشیهٔ سود ${fmtPct(calc.marginPct)})`,
      params: {
        mode,
        cost: String(costNum),
        markup: String(markupNum),
        price: String(priceNum),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="قیمت تمام‌شده و سود"
      subtitle="محاسبهٔ قیمت فروش، مبلغ سود، حاشیهٔ سود و markup بر اساس بهای تمام‌شده"
      icon={Calculator}
      accent={ACCENT}
      info={[
        {
          icon: <Tag className="w-4 h-4" />,
          title: 'بهای تمام‌شده چیست؟',
          body: 'بهای تمام‌شده مجموع تمام هزینه‌های یک کالا یا خدمت تا لحظهٔ آمادهٔ فروش است؛ شامل قیمت خرید، حمل، بسته‌بندی و هزینه‌های سربار. قیمت فروش از افزودن سود به این رقم به دست می‌آید.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'درصد سود (markup) قابل ویرایش است',
          body: 'درصد سود را نسبت به بهای تمام‌شده وارد کنید؛ مثلاً markup ۳۰٪ یعنی قیمت فروش = بهای تمام‌شده × ۱٫۳. درصد پیش‌فرض صرفاً یک نمونه است و باید با سیاست قیمت‌گذاری واقعی کسب‌وکار شما جایگزین شود.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'تفاوت markup و حاشیهٔ سود (margin)',
          body: 'markup سود را نسبت به «بهای تمام‌شده» می‌سنجد و margin همان سود را نسبت به «قیمت فروش». این دو هیچ‌گاه برابر نیستند؛ مثلاً markup ۵۰٪ معادل margin ۳۳٫۳٪ است. هر دو در نتیجه نمایش داده می‌شوند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'این محاسبه فقط رابطهٔ ساده بهای تمام‌شده، سود و قیمت فروش را پوشش می‌دهد و مالیات بر ارزش افزوده، تخفیف، عوارض و هزینه‌های فروش جداگانه را لحاظ نمی‌کند. ارقام را به تومان یا ریال وارد کنید.',
        },
      ]}
      disclaimer="این برآورد بر پایهٔ درصد سودی است که خودتان وارد می‌کنید؛ قیمت فروش نهایی به سیاست قیمت‌گذاری، مالیات، تخفیف و شرایط بازار بستگی دارد و باید با ارقام واقعی کسب‌وکار راستی‌آزمایی شود."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField label="روش محاسبه" value={mode} onChange={(v) => setMode(v as Mode)}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </SelectField>

          <MoneyField
            label="بهای تمام‌شده"
            amount={cost}
            setAmount={setCost}
            unit={unit}
            setUnit={setUnit}
          />

          {mode === 'markup' ? (
            <Field label="درصد سود (markup)" hint="درصد سود نسبت به بهای تمام‌شده — قابل ویرایش (نمونه)">
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={faNum(markup)}
                  onChange={(e) => setMarkup(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                  dir="ltr"
                  aria-label="درصد سود نسبت به بهای تمام‌شده"
                  className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                  ٪
                </span>
              </div>
            </Field>
          ) : (
            <MoneyField
              label="قیمت فروش"
              amount={price}
              setAmount={setPrice}
              unit={unit}
              setUnit={setUnit}
            />
          )}
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Calculator className="w-6 h-6" />}>
                {mode === 'markup'
                  ? 'بهای تمام‌شده و درصد سود را وارد کنید تا قیمت فروش محاسبه شود.'
                  : 'بهای تمام‌شده و قیمت فروش را وارد کنید تا سود و حاشیهٔ سود محاسبه شود.'}
              </EmptyState>
            ) : 'error' in calc ? (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{calc.error}</p>
              </motion.div>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label={mode === 'markup' ? 'قیمت فروش' : 'مبلغ سود'}
                  value={fmtMoney(mode === 'markup' ? calc.sellPrice : calc.profit)}
                  suffix={u}
                  sub={`${toWords(mode === 'markup' ? calc.sellPrice : calc.profit)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="بهای تمام‌شده" value={`${fmtMoney(costNum)} ${u}`} />
                  <Row label="قیمت فروش" value={`${fmtMoney(calc.sellPrice)} ${u}`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="مبلغ سود" value={`${fmtMoney(calc.profit)} ${u}`} strong />
                  <Row label="درصد سود (markup)" value={fmtPct(calc.markupPct)} strong />
                  <Row label="حاشیهٔ سود (margin)" value={fmtPct(calc.marginPct)} strong />
                </div>
                <Notice accent={ACCENT}>
                  markup سود را نسبت به بهای تمام‌شده و margin همان سود را نسبت به قیمت فروش می‌سنجد؛ این دو رقم همیشه با هم متفاوت‌اند.
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
