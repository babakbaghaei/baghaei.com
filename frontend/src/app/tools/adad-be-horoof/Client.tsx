'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Type, Hash, Coins } from 'lucide-react';
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
  PrintButton,
  AnimatePresence,
  motion,
  fmtMoney,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '99, 102, 241'; // indigo

export default function AdadBeHoroof() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) setAmount(Number(a).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const num = cleanNum(amount);
  const u = unitLabel(unit);

  const calc = useMemo(() => {
    if (num <= 0) return null;
    return { words: toWords(num), rial: unit === 'toman' ? num * 10 : num };
  }, [num, unit]);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'تبدیل عدد به حروف',
      text: `${fmtMoney(num)} ${u} = ${calc.words} ${u}`,
      params: { amount: String(num), unit },
    });
  };

  return (
    <ToolShell
      title="مبدل عدد به حروف"
      subtitle="تبدیل دقیق مبلغ عددی به حروف فارسی برای نوشتن چک، قرارداد و اسناد مالی"
      icon={Type}
      accent={ACCENT}
      info={[
        {
          icon: <Hash className="w-4 h-4" />,
          title: 'کاربرد',
          body: 'برای نوشتن بی‌خطای مبلغ چک، فاکتور و قرارداد، عدد را وارد کنید تا معادل حروفی آن به فارسی ساخته شود.',
        },
        {
          icon: <Coins className="w-4 h-4" />,
          title: 'تومان و ریال',
          body: 'واحد را انتخاب کنید؛ معادل ریالی مبلغ نیز برای ثبت در اسناد رسمی نمایش داده می‌شود.',
        },
      ]}
      disclaimer="در نوشتن چک، مبلغ حروفی ملاک است؛ پیش از ثبت، صحت آن را بازبینی کنید."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField label="مبلغ" amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Type className="w-6 h-6" />}>
                یک مبلغ وارد کنید تا معادل حروفی آن ساخته شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline accent={ACCENT} label="به حروف" value={`${calc.words} ${u}`} />
                <div className="space-y-2.5">
                  <Row label="به عدد" value={`${fmtMoney(num)} ${u}`} />
                  <Row label="معادل ریالی" value={`${fmtMoney(calc.rial)} ریال`} strong />
                </div>
                <Notice accent={ACCENT}>
                  هنگام نوشتن چک، عبارت «{calc.words} {u}» را در بخش حروفی وارد کنید.
                </Notice>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
                  <PrintButton accent={ACCENT} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
