'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Handshake, Home, BookOpen, Info, Receipt } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Field,
  Toggle,
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
import { REAL_ESTATE_COMMISSION, RAHN_TO_RENT_MONTHLY_RATE } from '@/lib/data/legal-rates';

const ACCENT = '234, 88, 12'; // orange-600

type Mode = 'sale' | 'rent';

export default function KomisionMelk() {
  const [mode, setMode] = useState<Mode>('sale');
  const [unit, setUnit] = useState<Unit>('toman');
  // خرید و فروش
  const [price, setPrice] = useState('');
  // رهن و اجاره
  const [deposit, setDeposit] = useState('');
  const [rent, setRent] = useState('');
  const [rate, setRate] = useState(String(RAHN_TO_RENT_MONTHLY_RATE * 100));
  const [renewal, setRenewal] = useState(false);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('mode');
    if (m === 'sale' || m === 'rent') setMode(m);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const pr = p.get('price');
    if (pr && /^\d+$/.test(pr)) setPrice(Number(pr).toLocaleString('en-US'));
    const d = p.get('deposit');
    if (d && /^\d+$/.test(d)) setDeposit(Number(d).toLocaleString('en-US'));
    const r = p.get('rent');
    if (r && /^\d+$/.test(r)) setRent(Number(r).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    if (p.get('renewal') === '1') setRenewal(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const monthlyRate = Math.max(0, Number(normalizeDigits(rate)) || 0) / 100;

  const calc = useMemo(() => {
    const vat = REAL_ESTATE_COMMISSION.vat;
    if (mode === 'sale') {
      const p = cleanNum(price);
      if (p <= 0) return null;
      const perSideNet = p * REAL_ESTATE_COMMISSION.salePerSide;
      const perSideVat = perSideNet * vat;
      const perSide = perSideNet + perSideVat;
      return {
        baseLabel: 'مبلغ معامله',
        baseValue: p,
        rateLabel: `${fmtPct(REAL_ESTATE_COMMISSION.salePerSide * 100)} از هر طرف`,
        perSideNet: Math.round(perSideNet),
        perSideVat: Math.round(perSideVat),
        perSide: Math.round(perSide),
        total: Math.round(perSide * 2),
        equivMonthly: 0,
      };
    }
    // رهن و اجاره
    const d = cleanNum(deposit);
    const r = cleanNum(rent);
    if (d <= 0 && r <= 0) return null;
    const equivMonthly = r + d * monthlyRate; // یک ماه اجارهٔ معادل
    let perSideNet = equivMonthly * REAL_ESTATE_COMMISSION.rentPerSide;
    if (renewal) perSideNet *= REAL_ESTATE_COMMISSION.renewalFactor;
    const perSideVat = perSideNet * vat;
    const perSide = perSideNet + perSideVat;
    return {
      baseLabel: 'یک ماه اجارهٔ معادل',
      baseValue: Math.round(equivMonthly),
      rateLabel: renewal
        ? 'یک‌دهمِ کمیسیون اجاره (تمدید)'
        : `${fmtPct(REAL_ESTATE_COMMISSION.rentPerSide * 100)} یک ماه اجاره از هر طرف`,
      perSideNet: Math.round(perSideNet),
      perSideVat: Math.round(perSideVat),
      perSide: Math.round(perSide),
      total: Math.round(perSide * 2),
      equivMonthly: Math.round(equivMonthly),
    };
  }, [mode, price, deposit, rent, monthlyRate, renewal]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'کمیسیون مشاور املاک',
      text: `کمیسیون هر طرف: ${fmtMoney(calc.perSide)} ${u} | جمع دو طرف: ${fmtMoney(calc.total)} ${u}`,
      params: {
        mode,
        unit,
        price: String(cleanNum(price)),
        deposit: String(cleanNum(deposit)),
        rent: String(cleanNum(rent)),
        rate: String(monthlyRate * 100),
        renewal: renewal ? '1' : '0',
      },
    });
  };

  return (
    <ToolShell
      title="کمیسیون مشاور املاک"
      subtitle="محاسبهٔ حق‌الزحمهٔ بنگاه املاک در خرید و فروش و رهن و اجاره، بر اساس تعرفهٔ اتحادیه"
      icon={Handshake}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'تعرفهٔ خرید و فروش',
          body: 'در تهران کمیسیون خرید و فروش ۰٫۲۵٪ مبلغ معامله از «هر طرف» (خریدار و فروشنده) است؛ یعنی جمعاً ۰٫۵٪. در برخی شهرها این نرخ پلکانی است.',
        },
        {
          icon: <Home className="w-4 h-4" />,
          title: 'تعرفهٔ رهن و اجاره',
          body: 'ابتدا ودیعه با نرخ تبدیل به اجاره تبدیل و با اجارهٔ ماهانه جمع می‌شود (یک ماه اجارهٔ معادل)؛ کمیسیون برابر ۲۵٪ آن از هر طرف است. کمیسیون تمدید قرارداد یک‌دهم این مبلغ است.',
        },
        {
          icon: <Receipt className="w-4 h-4" />,
          title: 'مالیات بر ارزش افزوده',
          body: 'روی مبلغ کمیسیون، مالیات بر ارزش افزوده (در این ابزار ۱۰٪) افزوده می‌شود و در مبلغ نهایی لحاظ شده است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'توافقی و شهر‌به‌شهر',
          body: 'تعرفه را اتحادیهٔ صنف هر سال تعیین می‌کند و بین شهرها متفاوت است؛ با توافق طرفین قابل تغییر است، اما دریافت بیش از نرخ مصوب بدون رضایت تخلف محسوب می‌شود.',
        },
      ]}
      disclaimer="این برآورد بر پایهٔ تعرفهٔ عرفی تهران است. نرخ دقیق را اتحادیهٔ مشاوران املاک شهر شما تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <SelectField
            icon={<Home className="w-4 h-4" />}
            label="نوع معامله"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          >
            <option value="sale">خرید و فروش</option>
            <option value="rent">رهن و اجاره</option>
          </SelectField>

          {mode === 'sale' ? (
            <MoneyField label="مبلغ معامله" amount={price} setAmount={setPrice} unit={unit} setUnit={setUnit} />
          ) : (
            <>
              <MoneyField label="ودیعه (رهن)" amount={deposit} setAmount={setDeposit} unit={unit} setUnit={setUnit} />
              <MoneyField label="اجارهٔ ماهانه" amount={rent} setAmount={setRent} unit={unit} />
              <Field label="نرخ تبدیل ماهانه" hint="برای تبدیل ودیعه به اجاره (عرف ۳٪)">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={faNum(rate)}
                    onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                    dir="ltr"
                    aria-label="نرخ تبدیل ماهانه به درصد"
                    className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                    ٪
                  </span>
                </div>
              </Field>
              <Toggle
                label="تمدید قرارداد است"
                hint="کمیسیون تمدید یک‌دهم کمیسیون عقد قرارداد است"
                checked={renewal}
                onChange={setRenewal}
              />
            </>
          )}
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Handshake className="w-6 h-6" />}>
                اطلاعات معامله را وارد کنید تا کمیسیون محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="کمیسیون هر طرف"
                  value={fmtMoney(calc.perSide)}
                  suffix={u}
                  sub={`${toWords(calc.perSide)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label={calc.baseLabel} value={`${fmtMoney(calc.baseValue)} ${u}`} />
                  <Row label="نرخ کمیسیون" value={calc.rateLabel} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="کمیسیون خالص (هر طرف)" value={`${fmtMoney(calc.perSideNet)} ${u}`} />
                  <Row label="مالیات بر ارزش افزوده" value={`${fmtMoney(calc.perSideVat)} ${u}`} />
                  <Row label="کمیسیون هر طرف (با مالیات)" value={`${fmtMoney(calc.perSide)} ${u}`} strong />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع کل دو طرف" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  هر یک از خریدار و فروشنده (یا موجر و مستأجر) جداگانه کمیسیون «هر طرف» را می‌پردازند.
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
