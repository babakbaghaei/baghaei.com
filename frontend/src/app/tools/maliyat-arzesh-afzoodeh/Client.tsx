'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Receipt, Percent, Calculator, SplitSquareHorizontal, Info } from 'lucide-react';
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

const ACCENT = '217, 119, 6'; // amber-600 — مالی

type Mode = 'add' | 'extract';

const MODES: { value: Mode; label: string }[] = [
  { value: 'add', label: 'افزودن مالیات به مبلغ' },
  { value: 'extract', label: 'تفکیک مالیات از مبلغ ناخالص' },
];

export default function MaliyatArzeshAfzoodeh() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('10'); // ← نرخ قابل ویرایش (نمونه)
  const [mode, setMode] = useState<Mode>('add');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const am = p.get('amount');
    if (am && /^\d+$/.test(am)) setAmount(Number(am).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const md = p.get('mode');
    if (md === 'add' || md === 'extract') setMode(md);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const amountNum = cleanNum(amount);
  const vatRate = Math.max(0, Number(normalizeDigits(rate)) || 0);

  const calc = useMemo(() => {
    if (amountNum <= 0) return null;
    const r = vatRate / 100;
    let net: number;
    let gross: number;
    if (mode === 'add') {
      // مبلغ وارد شده = خالص (بدون مالیات)
      net = amountNum;
      gross = amountNum * (1 + r);
    } else {
      // مبلغ وارد شده = ناخالص (شامل مالیات)
      gross = amountNum;
      net = amountNum / (1 + r);
    }
    const tax = gross - net;
    return {
      net: Math.round(net),
      tax: Math.round(tax),
      gross: Math.round(gross),
    };
  }, [amountNum, vatRate, mode]);

  const u = unitLabel(unit);
  const isAdd = mode === 'add';

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مالیات بر ارزش‌افزوده',
      text: `${isAdd ? 'مبلغ خالص' : 'مبلغ ناخالص'} ${fmtMoney(amountNum)} ${u} با نرخ ${faNum(String(vatRate))}٪ — مالیات: ${fmtMoney(calc.tax)} ${u}، مبلغ نهایی: ${fmtMoney(calc.gross)} ${u}`,
      params: {
        amount: String(amountNum),
        rate: String(vatRate),
        mode,
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="مالیات بر ارزش‌افزوده"
      subtitle="افزودن یا تفکیک مالیات بر ارزش‌افزوده از مبلغ، با نرخ قابل تنظیم"
      icon={Receipt}
      accent={ACCENT}
      info={[
        {
          icon: <Calculator className="w-4 h-4" />,
          title: 'افزودن مالیات',
          body: 'در حالت «افزودن»، مبلغی که وارد می‌کنید مبلغ خالص (بدون مالیات) در نظر گرفته می‌شود؛ مالیات روی آن محاسبه و به مبلغ نهایی (ناخالص) اضافه می‌شود. این حالت برای محاسبهٔ مبلغ قابل پرداخت روی فاکتور مناسب است.',
        },
        {
          icon: <SplitSquareHorizontal className="w-4 h-4" />,
          title: 'تفکیک از مبلغ ناخالص',
          body: 'در حالت «تفکیک»، مبلغی که وارد می‌کنید مبلغ ناخالص (شامل مالیات) است؛ ماشین‌حساب مبلغ خالص و سهم مالیات را از آن جدا می‌کند. برای زمانی که فقط جمع کل فاکتور را دارید و باید مالیات را معکوس استخراج کنید.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ مالیات قابل ویرایش',
          body: 'نرخ پیش‌فرض ۱۰٪ صرفاً یک نمونه است و باید با نرخ مصوب جاری جایگزین شود. نرخ عمومی مالیات بر ارزش‌افزوده در ایران در طول زمان تغییر کرده و برخی کالاها و خدمات نرخ یا معافیت متفاوتی دارند؛ نرخ قابل اعمال برای مورد خود را وارد کنید.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکتهٔ محاسبه',
          body: 'این ابزار فقط مالیات بر ارزش‌افزوده را روی یک مبلغ پایه محاسبه می‌کند و عوارض، تخفیف‌ها، معافیت‌ها یا سایر اقلام فاکتور را لحاظ نمی‌کند. رقم نهایی سند رسمی را باید بر اساس قوانین و نرخ‌های جاری سازمان امور مالیاتی تأیید کنید.',
        },
      ]}
      disclaimer={
        <span>
          این یک <strong className="text-foreground font-bold">برآورد</strong> بر پایهٔ نرخی است که خودتان وارد می‌کنید؛ نرخ پیش‌فرض صرفاً نمونه است. نرخ و قواعد جاری مالیات بر ارزش‌افزوده را از سازمان امور مالیاتی کشور بررسی و تأیید کنید.
        </span>
      }
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label={isAdd ? 'مبلغ پایه (بدون مالیات)' : 'مبلغ ناخالص (شامل مالیات)'}
            amount={amount}
            setAmount={setAmount}
            unit={unit}
            setUnit={setUnit}
          />

          <SelectField
            icon={<SplitSquareHorizontal className="w-4 h-4" />}
            label="نوع محاسبه"
            hint="افزودن مالیات به مبلغ خالص یا تفکیک مالیات از مبلغ ناخالص"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </SelectField>

          <Field label="نرخ مالیات بر ارزش‌افزوده" hint="نرخ پیش‌فرض ۱۰٪ نمونه و قابل ویرایش است؛ نرخ مصوب جاری را وارد کنید">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
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
              <EmptyState accent={ACCENT} icon={<Receipt className="w-6 h-6" />}>
                مبلغ را وارد کنید تا مالیات بر ارزش‌افزوده محاسبه و تفکیک شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label={isAdd ? 'مبلغ نهایی (با مالیات)' : 'مبلغ خالص (بدون مالیات)'}
                  value={fmtMoney(isAdd ? calc.gross : calc.net)}
                  suffix={u}
                  sub={`${toWords(isAdd ? calc.gross : calc.net)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="نرخ مالیات" value={fmtPct(vatRate)} />
                  <Row label="نوع محاسبه" value={isAdd ? 'افزودن مالیات' : 'تفکیک از مبلغ ناخالص'} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="مبلغ خالص (بدون مالیات)" value={`${fmtMoney(calc.net)} ${u}`} strong />
                  <Row label="مالیات بر ارزش‌افزوده" value={`${fmtMoney(calc.tax)} ${u}`} strong />
                  <Row label="مبلغ ناخالص (با مالیات)" value={`${fmtMoney(calc.gross)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  نرخ واردشده صرفاً نمونه است؛ نرخ مصوب جاری مالیات بر ارزش‌افزوده را پیش از استناد بررسی کنید.
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
