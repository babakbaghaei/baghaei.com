'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { KeyRound, Scale, BookOpen, Info, Gavel } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  Stepper,
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
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '146, 64, 14'; // amber-800

export default function AjratMesl() {
  const [monthlyRent, setMonthlyRent] = useState('');
  const [months, setMonths] = useState(1);
  const [days, setDays] = useState(0);
  const [dailyPenalty, setDailyPenalty] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const r = p.get('rent');
    if (r && /^\d+$/.test(r)) setMonthlyRent(Number(r).toLocaleString('en-US'));
    const m = p.get('months');
    if (m != null && /^\d+$/.test(m)) setMonths(Number(m));
    const d = p.get('days');
    if (d != null && /^\d+$/.test(d)) setDays(Number(d));
    const pen = p.get('penalty');
    if (pen && /^\d+$/.test(pen)) setDailyPenalty(Number(pen).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const rent = cleanNum(monthlyRent);
  const penalty = cleanNum(dailyPenalty);

  const calc = useMemo(() => {
    const totalDays = months * 30 + days;
    if (totalDays <= 0) return null;
    if (rent <= 0 && penalty <= 0) return null;
    const monthsFrac = totalDays / 30;
    const ajrat = rent * monthsFrac;
    const penaltyTotal = penalty * totalDays;
    return {
      totalDays,
      monthsFrac,
      ajrat: Math.round(ajrat),
      penaltyTotal: Math.round(penaltyTotal),
      total: Math.round(ajrat + penaltyTotal),
    };
  }, [rent, penalty, months, days]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'اجرت‌المثل ایام تصرف',
      text: `اجرت‌المثل و خسارت ${faNum(calc.totalDays)} روز تصرف: ${fmtMoney(calc.total)} ${u}`,
      params: {
        rent: String(rent),
        months: String(months),
        days: String(days),
        penalty: String(penalty),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="اجرت‌المثل ایام تصرف"
      subtitle="برآورد اجرت‌المثل تصرف غیرمجاز ملک و خسارت تأخیر در تخلیه، بر مبنای ارزش اجارهٔ ماهانه"
      icon={KeyRound}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'اجرت‌المثل چیست؟',
          body: 'هرگاه کسی بدون اذن یا پس از پایان قرارداد، ملک دیگری را در تصرف داشته باشد، باید «اجرت‌المثل» یعنی ارزش اجارهٔ عرفی همان مدت را بپردازد (مواد ۳۲۰ به بعد قانون مدنی و مادهٔ ۴۹۴ در پایان اجاره).',
        },
        {
          icon: <Gavel className="w-4 h-4" />,
          title: 'خسارت تأخیر تخلیه',
          body: 'اگر در قرارداد برای تأخیر در تخلیه «وجه التزام روزانه» تعیین شده باشد، علاوه بر اجرت‌المثل، آن مبلغ روزشمار نیز قابل مطالبه است. در این ابزار می‌توانید وجه التزام روزانه را وارد کنید.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'نقش کارشناس رسمی',
          body: 'میزان دقیق اجرت‌المثل را معمولاً کارشناس رسمی دادگستری با توجه به موقعیت، کاربری و نرخ اجارهٔ روز ملک تعیین می‌کند؛ این ابزار صرفاً برآورد اولیه می‌دهد.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'مبنای محاسبه',
          body: 'اجرت‌المثل = ارزش اجارهٔ ماهانه × مدت تصرف (ماه)؛ هر ماه ۳۰ روز فرض شده است. خسارت تأخیر = وجه التزام روزانه × تعداد روزهای تصرف.',
        },
      ]}
      disclaimer="این برآورد راهنماست؛ مبلغ قطعی اجرت‌المثل را کارشناس رسمی و مرجع قضایی تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="ارزش اجارهٔ ماهانهٔ ملک"
            amount={monthlyRent}
            setAmount={setMonthlyRent}
            unit={unit}
            setUnit={setUnit}
          />
          <div className="grid grid-cols-2 gap-4">
            <Stepper label="مدت تصرف (ماه)" value={months} onChange={setMonths} min={0} max={240} />
            <Stepper label="روز اضافه" value={days} onChange={setDays} min={0} max={29} />
          </div>
          <MoneyField
            label="وجه التزام روزانه (اختیاری)"
            amount={dailyPenalty}
            setAmount={setDailyPenalty}
            unit={unit}
          />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<KeyRound className="w-6 h-6" />}>
                ارزش اجارهٔ ماهانه و مدت تصرف را وارد کنید.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="جمع قابل مطالبه"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="مدت تصرف" value={`${faNum(calc.totalDays)} روز`} />
                  {rent > 0 && (
                    <>
                      <Row label="اجارهٔ ماهانه" value={`${fmtMoney(rent)} ${u}`} />
                      <Row label="اجرت‌المثل ایام تصرف" value={`${fmtMoney(calc.ajrat)} ${u}`} strong />
                    </>
                  )}
                  {penalty > 0 && (
                    <>
                      <Row label="وجه التزام روزانه" value={`${fmtMoney(penalty)} ${u}`} />
                      <Row label="خسارت تأخیر تخلیه" value={`${fmtMoney(calc.penaltyTotal)} ${u}`} strong />
                    </>
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع کل" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  مبلغ نهایی اجرت‌المثل با نظر کارشناس رسمی دادگستری تعیین می‌شود؛ این رقم برآورد اولیه بر پایهٔ اجارهٔ ماهانه است.
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
