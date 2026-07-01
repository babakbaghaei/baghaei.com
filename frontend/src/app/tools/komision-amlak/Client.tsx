'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Handshake, Building2, Home, Receipt, Users } from 'lucide-react';
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
  fmtMoney,
  fmtPct,
  toWords,
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { REAL_ESTATE_COMMISSION } from '@/lib/data/legal-rates';

const ACCENT = '13, 148, 136'; // teal-600

type Mode = 'sale' | 'rent';

export default function KomisionAmlak() {
  const [mode, setMode] = useState<Mode>('sale');

  // خرید و فروش — نرخ رسمی هر طرف از تعرفهٔ اتحادیه (تک‌منبع)
  const [price, setPrice] = useState('');
  const [saleRate, setSaleRate] = useState(String(REAL_ESTATE_COMMISSION.salePerSide * 100));

  // رهن و اجاره — درصد رسمیِ یک ماه اجاره از تعرفهٔ اتحادیه
  const [rent, setRent] = useState('');
  const [rentRate, setRentRate] = useState(String(REAL_ESTATE_COMMISSION.rentPerSide * 100));

  // ارزش‌افزوده رسمی (۱۰٪) — تک‌منبع؛ با «نرخ دلخواه» قابل تغییر
  const [vatRate, setVatRate] = useState(String(REAL_ESTATE_COMMISSION.vat * 100));

  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('mode');
    if (m === 'sale' || m === 'rent') setMode(m);
    const pr = p.get('price');
    if (pr && /^\d+$/.test(pr)) setPrice(Number(pr).toLocaleString('en-US'));
    const sr = p.get('saleRate');
    if (sr && /^\d*\.?\d+$/.test(sr)) setSaleRate(sr);
    const rn = p.get('rent');
    if (rn && /^\d+$/.test(rn)) setRent(Number(rn).toLocaleString('en-US'));
    const rr = p.get('rentRate');
    if (rr && /^\d*\.?\d+$/.test(rr)) setRentRate(rr);
    const vr = p.get('vatRate');
    if (vr && /^\d*\.?\d+$/.test(vr)) setVatRate(vr);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const priceNum = cleanNum(price);
  const rentNum = cleanNum(rent);
  const saleRatePct = Math.max(0, Number(normalizeDigits(saleRate)) || 0);
  const rentRatePct = Math.max(0, Number(normalizeDigits(rentRate)) || 0);
  const vatPct = Math.max(0, Number(normalizeDigits(vatRate)) || 0);

  const calc = useMemo(() => {
    if (mode === 'sale') {
      if (priceNum <= 0) return null;
      const perSide = priceNum * (saleRatePct / 100);
      const vatPerSide = perSide * (vatPct / 100);
      const eachSide = perSide + vatPerSide; // هر طرف با ارزش‌افزوده
      return {
        commission: Math.round(perSide), // حق‌الزحمهٔ هر طرف (بدون مالیات)
        vat: Math.round(vatPerSide),
        eachSide: Math.round(eachSide),
        bothSides: Math.round(eachSide * 2),
      };
    }
    if (rentNum <= 0) return null;
    const commission = rentNum * (rentRatePct / 100);
    const vat = commission * (vatPct / 100);
    const eachSide = commission + vat;
    return {
      commission: Math.round(commission),
      vat: Math.round(vat),
      eachSide: Math.round(eachSide),
      bothSides: Math.round(eachSide * 2),
    };
  }, [mode, priceNum, saleRatePct, rentNum, rentRatePct, vatPct]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    const text =
      mode === 'sale'
        ? `کمیسیون مشاور املاک (خرید و فروش) برای مبلغ ${fmtMoney(priceNum)} ${u} — هر طرف: ${fmtMoney(calc.eachSide)} ${u}`
        : `کمیسیون مشاور املاک (رهن و اجاره) برای اجارهٔ ${fmtMoney(rentNum)} ${u} — هر طرف: ${fmtMoney(calc.eachSide)} ${u}`;
    share({
      title: 'کمیسیون مشاور املاک',
      text,
      params: {
        mode,
        price: String(priceNum),
        saleRate: String(saleRatePct),
        rent: String(rentNum),
        rentRate: String(rentRatePct),
        vatRate: String(vatPct),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="کمیسیون مشاور املاک"
      subtitle="محاسبهٔ حق‌الزحمهٔ بنگاه برای معاملات خرید/فروش و رهن و اجاره با نرخ قابل تنظیم"
      icon={Handshake}
      accent={ACCENT}
      info={[
        {
          icon: <Building2 className="w-4 h-4" />,
          title: 'کمیسیون خرید و فروش',
          body: 'در معاملات خرید و فروش، حق‌الزحمهٔ بنگاه معمولاً درصدی از مبلغ کل معامله است و از هر طرف (خریدار و فروشنده) جداگانه دریافت می‌شود. نرخ پیش‌فرض ۰٫۲۵٪ هر طرف صرفاً نمونه است؛ نرخ مصوب اتحادیه را وارد کنید.',
        },
        {
          icon: <Home className="w-4 h-4" />,
          title: 'کمیسیون رهن و اجاره',
          body: 'در قراردادهای رهن و اجاره، حق‌الزحمه معمولاً درصدی از «اجارهٔ یک ماه» است و از موجر و مستأجر جداگانه گرفته می‌شود. نرخ پیش‌فرض ۲۵٪ یک ماه اجاره نمونه است و باید با نرخ مصوب جایگزین شود.',
        },
        {
          icon: <Receipt className="w-4 h-4" />,
          title: 'مالیات بر ارزش‌افزوده',
          body: 'به حق‌الزحمهٔ بنگاه، مالیات بر ارزش‌افزوده (پیش‌فرض ۹٪) افزوده می‌شود. این نرخ نیز قابل ویرایش است و باید با نرخ جاری سازمان امور مالیاتی تطبیق داده شود.',
        },
        {
          icon: <Users className="w-4 h-4" />,
          title: 'دریافت از دو طرف',
          body: 'حق‌الزحمه معمولاً به‌صورت جداگانه از هر دو طرف معامله دریافت می‌شود؛ بنابراین «مجموع دریافتی بنگاه» دو برابر سهم هر طرف است. توافق طرفین می‌تواند این تقسیم را تغییر دهد.',
        },
      ]}
      disclaimer="نرخ مصوب اتحادیهٔ مشاوران املاک قابل ویرایش است و در شهرها و سال‌های مختلف متفاوت است؛ این محاسبه صرفاً یک برآورد است و باید نرخ‌های رسمی و جاری را از اتحادیه و سازمان امور مالیاتی راستی‌آزمایی کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          {/* انتخاب نوع معامله */}
          <Field label="نوع معامله">
            <div className="flex bg-muted p-1 rounded-xl border border-border">
              {(
                [
                  { key: 'sale', label: 'خرید و فروش' },
                  { key: 'rent', label: 'رهن و اجاره' },
                ] as const
              ).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  aria-pressed={mode === m.key}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-black font-display transition-all ${
                    mode === m.key ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Field>

          {mode === 'sale' ? (
            <>
              <MoneyField
                label="مبلغ کل معامله"
                amount={price}
                setAmount={setPrice}
                unit={unit}
                setUnit={setUnit}
              />

              <RateField
                label="نرخ کمیسیون هر طرف"
                official={REAL_ESTATE_COMMISSION.salePerSide * 100}
                value={saleRate}
                onChange={setSaleRate}
                source="تعرفهٔ اتحادیه"
                hint="نرخ رسمی اتحادیه ۰٫۲۵٪ از هر طرف است؛ برای شهر/توافق خاص «نرخ دلخواه» را بزنید."
              />
            </>
          ) : (
            <>
              <MoneyField
                label="مبلغ اجارهٔ یک ماه"
                amount={rent}
                setAmount={setRent}
                unit={unit}
                setUnit={setUnit}
              />

              <RateField
                label="نرخ کمیسیون (درصدی از یک ماه اجاره)"
                official={REAL_ESTATE_COMMISSION.rentPerSide * 100}
                value={rentRate}
                onChange={setRentRate}
                source="تعرفهٔ اتحادیه"
                hint="نرخ رسمی اتحادیه ۲۵٪ یک ماه اجاره از هر طرف است؛ برای تغییر «نرخ دلخواه» را بزنید."
              />
            </>
          )}

          <RateField
            label="مالیات بر ارزش‌افزوده"
            official={REAL_ESTATE_COMMISSION.vat * 100}
            value={vatRate}
            onChange={setVatRate}
            source="سازمان امور مالیاتی"
            hint="نرخ رسمی ارزش‌افزوده ۱۰٪ است؛ در صورت تغییرِ مصوبه «نرخ دلخواه» را بزنید."
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Handshake className="w-6 h-6" />}>
                {mode === 'sale'
                  ? 'مبلغ کل معامله را وارد کنید تا حق‌الزحمهٔ بنگاه محاسبه شود.'
                  : 'مبلغ اجارهٔ یک ماه را وارد کنید تا حق‌الزحمهٔ بنگاه محاسبه شود.'}
              </EmptyState>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline
                  accent={ACCENT}
                  label="حق‌الزحمهٔ هر طرف (با ارزش‌افزوده)"
                  value={fmtMoney(calc.eachSide)}
                  suffix={u}
                  sub={`${toWords(calc.eachSide)} ${u}`}
                />
                <div className="space-y-2.5">
                  {mode === 'sale' ? (
                    <>
                      <Row label="مبلغ کل معامله" value={`${fmtMoney(priceNum)} ${u}`} />
                      <Row label="نرخ کمیسیون هر طرف" value={fmtPct(saleRatePct)} />
                    </>
                  ) : (
                    <>
                      <Row label="مبلغ اجارهٔ یک ماه" value={`${fmtMoney(rentNum)} ${u}`} />
                      <Row label="نرخ کمیسیون" value={fmtPct(rentRatePct)} />
                    </>
                  )}
                  <Row label={`حق‌الزحمهٔ پایه (هر طرف)`} value={`${fmtMoney(calc.commission)} ${u}`} />
                  <Row label={`ارزش‌افزوده (${fmtPct(vatPct)})`} value={`${fmtMoney(calc.vat)} ${u}`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="هر طرف (با ارزش‌افزوده)" value={`${fmtMoney(calc.eachSide)} ${u}`} strong />
                  <Row label="مجموع دریافتی بنگاه (دو طرف)" value={`${fmtMoney(calc.bothSides)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  حق‌الزحمه معمولاً از هر دو طرف معامله جداگانه دریافت می‌شود؛ سهم هر طرف و نرخ نهایی را
                  می‌توان با توافق طرفین تغییر داد.
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
