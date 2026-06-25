'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BookHeart, Coins, Wallet, Percent, Info } from 'lucide-react';
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

const ACCENT = '5, 150, 105'; // emerald-600

export default function Khoms() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [rate, setRate] = useState('20'); // ← editable default rate (sample): یک‌پنجم = ۲۰٪
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const inc = p.get('income');
    if (inc && /^\d+$/.test(inc)) setIncome(Number(inc).toLocaleString('en-US'));
    const exp = p.get('expenses');
    if (exp && /^\d+$/.test(exp)) setExpenses(Number(exp).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const incomeNum = cleanNum(income);
  const expensesNum = cleanNum(expenses);
  const khomsRate = Math.max(0, Number(normalizeDigits(rate)) || 0);

  const calc = useMemo(() => {
    if (incomeNum <= 0) return null;
    const surplus = Math.max(0, incomeNum - expensesNum);
    const khoms = surplus * (khomsRate / 100);
    const remaining = incomeNum - khoms;
    return {
      surplus: Math.round(surplus),
      khoms: Math.round(khoms),
      remaining: Math.round(remaining),
    };
  }, [incomeNum, expensesNum, khomsRate]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'محاسبه‌گر خمس',
      text: `درآمد ${fmtMoney(incomeNum)} ${u} منهای مئونهٔ ${fmtMoney(expensesNum)} ${u} — خمس (${faNum(String(khomsRate))}٪ مازاد): ${fmtMoney(calc.khoms)} ${u}`,
      params: {
        income: String(incomeNum),
        expenses: String(expensesNum),
        rate: String(khomsRate),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="محاسبه‌گر خمس"
      subtitle="برآورد خمس سود سالانه (مازاد بر مئونه) بر پایهٔ نرخ یک‌پنجم"
      icon={BookHeart}
      accent={ACCENT}
      info={[
        {
          icon: <Coins className="w-4 h-4" />,
          title: 'مازاد بر مئونه',
          body: 'خمس به «مازاد درآمد سالانه بر مخارج (مئونه)» تعلق می‌گیرد. هزینه‌های متعارف زندگی در طول سال (مئونه) از درآمد کسر می‌شود و آنچه در پایان سالِ خمسی باقی می‌مانَد، مبنای محاسبه است. اگر مخارج بیشتر یا برابر درآمد باشد، مازادی نمی‌مانَد و خمسی تعلق نمی‌گیرد.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ یک‌پنجم',
          body: 'خمس به‌معنای «یک‌پنجم» است؛ یعنی ۲۰٪ از مازاد. این نرخ به‌صورت پیش‌فرض قابل ویرایش در فیلد قرار داده شده تا صرفاً نمونه باشد؛ مبنای شرعی، یک‌پنجم (۲۰٪) است و نیازی به تغییر آن نیست مگر برای محاسبهٔ آزمایشی.',
        },
        {
          icon: <Wallet className="w-4 h-4" />,
          title: 'مئونه چیست؟',
          body: 'مئونه شامل خوراک، پوشاک، مسکن، درمان، هزینهٔ تحصیل، رفت‌وآمد و دیگر مخارج متعارفِ شأن فرد در طول سال است. تشخیص دقیق مصادیق مئونه و موارد استثنا (مانند سرمایه و ابزار کسب) بسته به فتوای مرجع تقلید متفاوت است.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'تفاوت احکام مراجع',
          body: 'این ابزار صرفاً یک محاسبهٔ ریاضیِ یک‌پنجمِ مازاد است و جایگزین مراجعه به رساله یا دفتر مرجع تقلید نیست. جزئیاتی مانند سال خمسی، خمس سرمایه، مخلوط شدن مال خمس‌نداده و موارد مشابه باید بر پایهٔ فتوای مرجع شما تعیین شود.',
        },
      ]}
      disclaimer="احکام خمس بسته به مرجع تقلید متفاوت است؛ این صرفاً برآورد ریاضیِ یک‌پنجمِ مازاد است و حکم شرعی قطعی محسوب نمی‌شود. برای محاسبهٔ دقیق به رساله یا دفتر مرجع تقلید خود مراجعه کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="درآمد / پس‌انداز سال"
            amount={income}
            setAmount={setIncome}
            unit={unit}
            setUnit={setUnit}
          />

          <MoneyField
            label="مخارج سال (مئونه)"
            amount={expenses}
            setAmount={setExpenses}
            unit={unit}
          />

          <Field label="نرخ خمس" hint="پیش‌فرض یک‌پنجم (۲۰٪) است و قابل ویرایش — صرفاً نمونه">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ خمس به درصد"
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
              <EmptyState accent={ACCENT} icon={<BookHeart className="w-6 h-6" />}>
                درآمد یا پس‌انداز سال و مخارج (مئونه) را وارد کنید تا خمسِ مازاد برآورد شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="خمس قابل پرداخت"
                  value={fmtMoney(calc.khoms)}
                  suffix={u}
                  sub={`${toWords(calc.khoms)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="درآمد / پس‌انداز سال" value={`${fmtMoney(incomeNum)} ${u}`} />
                  <Row label="مخارج سال (مئونه)" value={`${fmtMoney(expensesNum)} ${u}`} />
                  <Row label="نرخ خمس" value={fmtPct(khomsRate)} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="مازاد بر مئونه" value={`${fmtMoney(calc.surplus)} ${u}`} strong />
                  <Row label="خمس قابل پرداخت" value={`${fmtMoney(calc.khoms)} ${u}`} strong />
                  <Row label="باقی‌مانده پس از خمس" value={`${fmtMoney(calc.remaining)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  اگر مخارج برابر یا بیشتر از درآمد باشد، مازادی نمی‌مانَد و خمسی تعلق نمی‌گیرد.
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
