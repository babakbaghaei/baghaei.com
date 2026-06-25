'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  ListPlus,
  Percent,
  Receipt,
  Info,
  Plus,
  Trash2,
} from 'lucide-react';
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
  PrintButton,
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

const ACCENT = '217, 119, 6'; // amber-600 — هم‌رنگ دستهٔ «کسب‌وکار»

interface LineItem {
  id: number;
  title: string;
  qty: string;
  unitPrice: string;
}

const inputClass =
  'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

let nextId = 0;
const newItem = (): LineItem => ({ id: ++nextId, title: '', qty: '۱', unitPrice: '' });

export default function FactorSaz() {
  const [seller, setSeller] = useState('');
  const [buyer, setBuyer] = useState('');
  const [items, setItems] = useState<LineItem[]>([newItem()]);
  const [discount, setDiscount] = useState('');
  const [vatRate, setVatRate] = useState('10'); // نرخ ارزش‌افزوده — قابل ویرایش (نمونه)
  const [unit, setUnit] = useState<Unit>('toman');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const vt = p.get('vat');
    if (vt && /^\d*\.?\d+$/.test(vt)) setVatRate(vt);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setItem = (id: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const addItem = () => setItems((prev) => [...prev, newItem()]);
  const removeItem = (id: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const discountNum = cleanNum(discount);
  const vatPct = Math.max(0, Number(normalizeDigits(vatRate)) || 0);

  const calc = useMemo(() => {
    const rows = items
      .map((it) => {
        const qty = Math.max(0, Number(normalizeDigits(it.qty)) || 0);
        const price = cleanNum(it.unitPrice);
        return {
          title: it.title.trim(),
          qty,
          price,
          lineTotal: Math.round(qty * price),
        };
      })
      .filter((r) => r.qty > 0 && r.price > 0);

    if (rows.length === 0) return null;

    const subtotal = rows.reduce((s, r) => s + r.lineTotal, 0);
    const discountApplied = Math.min(discountNum, subtotal);
    const taxable = Math.max(0, subtotal - discountApplied);
    const vat = Math.round((taxable * vatPct) / 100);
    const grandTotal = taxable + vat;

    return {
      rows,
      subtotal,
      discountApplied: Math.round(discountApplied),
      taxable: Math.round(taxable),
      vat,
      grandTotal: Math.round(grandTotal),
    };
  }, [items, discountNum, vatPct]);

  const u = unitLabel(unit);

  return (
    <ToolShell
      title="مولد فاکتور فروش"
      subtitle="ساخت فاکتور فروش با ردیف‌های کالا، جمع کل، تخفیف و مالیات بر ارزش‌افزوده، آمادهٔ چاپ"
      icon={FileSpreadsheet}
      accent={ACCENT}
      info={[
        {
          icon: <ListPlus className="w-4 h-4" />,
          title: 'ردیف‌های کالا و خدمات',
          body: 'برای هر کالا یا خدمت یک ردیف اضافه کنید و شرح، تعداد و قیمت واحد را وارد کنید؛ جمع جزء هر ردیف به‌صورت خودکار محاسبه می‌شود. با دکمهٔ «افزودن ردیف» می‌توانید هر تعداد قلم به فاکتور بیفزایید.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'مالیات بر ارزش‌افزوده',
          body: 'نرخ مالیات بر ارزش‌افزوده (VAT) در این ابزار قابل ویرایش است و مقدار پیش‌فرض ۱۰٪ صرفاً نمونه است؛ نرخ مصوب جاری را از سازمان امور مالیاتی بررسی کنید و در صورت تغییر، آن را جایگزین نمایید. مالیات روی مبلغ پس از کسر تخفیف اعمال می‌شود.',
        },
        {
          icon: <Receipt className="w-4 h-4" />,
          title: 'تخفیف و جمع نهایی',
          body: 'مبلغ تخفیف از جمع کل کسر و سپس مالیات بر مبلغ مشمول محاسبه می‌شود. جمع نهایی برابر است با «جمع کل منهای تخفیف به‌اضافهٔ مالیات». تمام مبالغ به ' + unitLabel(unit) + ' نمایش داده می‌شوند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'چاپ و خروجی',
          body: 'با دکمهٔ «خروجی PDF / چاپ» می‌توانید فاکتور را به‌صورت تمیز چاپ یا به‌شکل PDF ذخیره کنید؛ هنگام چاپ، فرم‌ها و دکمه‌ها حذف و فقط فاکتور نمایش داده می‌شود. این فاکتور جایگزین فاکتور رسمی مالیاتی نیست.',
        },
      ]}
      disclaimer="این فاکتور یک برآورد و سند داخلی است؛ نرخ مالیات بر ارزش‌افزودهٔ پیش‌فرض صرفاً نمونه است و باید با نرخ مصوب جاری سازمان امور مالیاتی تطبیق داده شود. برای فاکتور رسمی، اطلاعات مالیاتی و شمارهٔ اقتصادی معتبر را از مراجع رسمی بگیرید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="فروشنده" hint="نام شخص یا کسب‌وکار">
              <input
                type="text"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                dir="rtl"
                aria-label="نام فروشنده"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-sm text-right focus:border-primary outline-none transition-all"
              />
            </Field>
            <Field label="خریدار" hint="نام شخص یا کسب‌وکار">
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                dir="rtl"
                aria-label="نام خریدار"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-sm text-right focus:border-primary outline-none transition-all"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
                ردیف‌های کالا
              </span>
              <div className="flex bg-muted p-0.5 rounded-lg border border-border">
                {(['toman', 'rial'] as const).map((un) => (
                  <button
                    key={un}
                    onClick={() => setUnit(un)}
                    className={`px-3 py-1 rounded-md text-xs font-black transition-all ${
                      unit === un ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    {unitLabel(un)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {items.map((it, idx) => {
                const lineTotal = Math.round(
                  (Math.max(0, Number(normalizeDigits(it.qty)) || 0)) * cleanNum(it.unitPrice),
                );
                return (
                  <div
                    key={it.id}
                    className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground font-display">
                        ردیف {faNum(String(idx + 1))}
                      </span>
                      <button
                        onClick={() => removeItem(it.id)}
                        aria-label={`حذف ردیف ${idx + 1}`}
                        disabled={items.length === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={it.title}
                      onChange={(e) => setItem(it.id, { title: e.target.value })}
                      placeholder="شرح کالا یا خدمت"
                      dir="rtl"
                      aria-label={`شرح ردیف ${idx + 1}`}
                      className="w-full bg-background border-2 border-border rounded-xl py-2.5 px-4 font-display text-sm text-right focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[0.7rem] font-bold text-muted-foreground/80 font-display mb-1.5 text-right">
                          تعداد
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={faNum(it.qty)}
                          onChange={(e) =>
                            setItem(it.id, {
                              qty: normalizeDigits(e.target.value).replace(/[^\d]/g, ''),
                            })
                          }
                          dir="ltr"
                          aria-label={`تعداد ردیف ${idx + 1}`}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[0.7rem] font-bold text-muted-foreground/80 font-display mb-1.5 text-right">
                          قیمت واحد
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={faNum(it.unitPrice)}
                          onChange={(e) => {
                            const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
                            setItem(it.id, {
                              unitPrice: v ? Number(v).toLocaleString('en-US') : '',
                            });
                          }}
                          dir="ltr"
                          aria-label={`قیمت واحد ردیف ${idx + 1}`}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {lineTotal > 0 && (
                      <p className="text-xs text-muted-foreground/70 font-display text-left">
                        جمع جزء: {fmtMoney(lineTotal)} {u}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={addItem}
              aria-label="افزودن ردیف کالا"
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black font-display transition-all"
              style={{
                background: `rgba(${ACCENT}, 0.1)`,
                color: `rgb(${ACCENT})`,
                border: `1px solid rgba(${ACCENT}, 0.25)`,
              }}
            >
              <Plus className="w-4 h-4" /> افزودن ردیف
            </button>
          </div>

          <Field label="تخفیف" hint={`مبلغ تخفیف به ${u} (اختیاری)`}>
            <input
              type="text"
              inputMode="numeric"
              value={faNum(discount)}
              onChange={(e) => {
                const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
                setDiscount(v ? Number(v).toLocaleString('en-US') : '');
              }}
              dir="ltr"
              aria-label="مبلغ تخفیف"
              className={inputClass}
            />
          </Field>

          <Field
            label="نرخ مالیات بر ارزش‌افزوده"
            hint="نرخ پیش‌فرض ۱۰٪ نمونه و قابل ویرایش است؛ با نرخ مصوب جاری جایگزین کنید"
          >
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(vatRate)}
                onChange={(e) =>
                  setVatRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))
                }
                dir="ltr"
                aria-label="نرخ مالیات بر ارزش‌افزوده به درصد"
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
              <EmptyState accent={ACCENT} icon={<FileSpreadsheet className="w-6 h-6" />}>
                دست‌کم یک ردیف کالا با تعداد و قیمت واحد وارد کنید تا فاکتور ساخته شود.
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                {/* بلوک قابل چاپ فاکتور */}
                <div className="space-y-6">
                  <Headline
                    accent={ACCENT}
                    label="جمع نهایی فاکتور"
                    value={fmtMoney(calc.grandTotal)}
                    suffix={u}
                    sub={`${toWords(calc.grandTotal)} ${u}`}
                  />

                  {(seller || buyer) && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-display text-muted-foreground">
                      {seller && <span>فروشنده: {seller}</span>}
                      {buyer && <span>خریدار: {buyer}</span>}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {calc.rows.map((r, i) => (
                      <Row
                        key={i}
                        label={`${r.title || `قلم ${faNum(String(i + 1))}`} (${faNum(
                          String(r.qty),
                        )} × ${fmtMoney(r.price)})`}
                        value={`${fmtMoney(r.lineTotal)} ${u}`}
                      />
                    ))}
                    <div className="h-px bg-border/60 my-1" />
                    <Row label="جمع کل" value={`${fmtMoney(calc.subtotal)} ${u}`} strong />
                    {calc.discountApplied > 0 && (
                      <Row label="تخفیف" value={`${fmtMoney(calc.discountApplied)} ${u}`} />
                    )}
                    <Row
                      label={`مالیات بر ارزش‌افزوده (${fmtPct(vatPct)})`}
                      value={`${fmtMoney(calc.vat)} ${u}`}
                    />
                    <div className="h-px bg-border/60 my-1" />
                    <Row label="مبلغ قابل پرداخت" value={`${fmtMoney(calc.grandTotal)} ${u}`} strong />
                  </div>
                </div>

                <Notice accent={ACCENT}>
                  نرخ مالیات بر ارزش‌افزوده قابل ویرایش است؛ پیش از صدور فاکتور رسمی، نرخ مصوب جاری را
                  بررسی و در صورت لزوم جایگزین کنید.
                </Notice>

                <PrintButton accent={ACCENT} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
