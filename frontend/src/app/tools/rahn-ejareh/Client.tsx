'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRightLeft, Home, Info, Percent, Calculator } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  RateField,
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
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { RAHN_TO_RENT_MONTHLY_RATE } from '@/lib/data/legal-rates';

const ACCENT = '2, 132, 199'; // sky-600

export default function RahnEjareh() {
  const [deposit, setDeposit] = useState('');
  const [rent, setRent] = useState('');
  const [desired, setDesired] = useState('');
  const [rate, setRate] = useState(String(RAHN_TO_RENT_MONTHLY_RATE * 100));
  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const d = p.get('deposit');
    if (d && /^\d+$/.test(d)) setDeposit(Number(d).toLocaleString('en-US'));
    const r = p.get('rent');
    if (r && /^\d+$/.test(r)) setRent(Number(r).toLocaleString('en-US'));
    const ds = p.get('desired');
    if (ds && /^\d+$/.test(ds)) setDesired(Number(ds).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const dep = cleanNum(deposit);
  const rnt = cleanNum(rent);
  const monthlyRate = Math.max(0, Number(normalizeDigits(rate)) || 0) / 100;

  const calc = useMemo(() => {
    if ((dep <= 0 && rnt <= 0) || monthlyRate <= 0) return null;
    // ارزش ماهانهٔ کل قرارداد = اجاره + معادل اجارهٔ ودیعه (ثابت می‌ماند)
    const totalMonthlyValue = rnt + dep * monthlyRate;
    // رهن کامل: اجاره صفر شود
    const fullDeposit = totalMonthlyValue / monthlyRate;
    // اجارهٔ کامل: ودیعه صفر شود
    const fullRent = totalMonthlyValue;

    let desiredRow: { dep: number; rent: number; valid: boolean } | null = null;
    const des = cleanNum(desired);
    if (desired.trim() !== '') {
      const newRent = totalMonthlyValue - des * monthlyRate;
      desiredRow = { dep: des, rent: newRent, valid: newRent >= 0 && des >= 0 };
    }

    return {
      totalMonthlyValue: Math.round(totalMonthlyValue),
      fullDeposit: Math.round(fullDeposit),
      fullRent: Math.round(fullRent),
      desiredRow,
    };
  }, [dep, rnt, monthlyRate, desired]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'تبدیل رهن و اجاره',
      text: `با ودیعهٔ ${fmtMoney(dep)} و اجارهٔ ${fmtMoney(rnt)} ${u} — رهن کامل: ${fmtMoney(calc.fullDeposit)} ${u} | اجارهٔ کامل: ${fmtMoney(calc.fullRent)} ${u}`,
      params: {
        deposit: String(dep),
        rent: String(rnt),
        desired: String(cleanNum(desired)),
        rate: String(monthlyRate * 100),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="تبدیل رهن و اجاره"
      subtitle="تبدیل ودیعه (رهن) به اجارهٔ ماهانه و برعکس، با نرخ تبدیل دلخواه — بر پایهٔ عرف بازار مسکن"
      icon={ArrowRightLeft}
      accent={ACCENT}
      info={[
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ تبدیل چیست؟',
          body: 'نرخ تبدیل، درصدی است که هر ماه به ازای ودیعه به‌جای اجاره در نظر گرفته می‌شود. عرف رایج بازار ۱۴۰۴ حدود ۳٪ ماهانه است؛ یعنی هر ۱ میلیون تومان ودیعه تقریباً معادل ۳۰٬۰۰۰ تومان اجارهٔ ماهانه.',
        },
        {
          icon: <Home className="w-4 h-4" />,
          title: 'رهن کامل و اجارهٔ کامل',
          body: 'رهن کامل یعنی اجاره صفر و کل قرارداد به‌صورت ودیعه؛ اجارهٔ کامل یعنی ودیعه صفر و کل قرارداد به‌صورت اجاره. ارزش ماهانهٔ کل قرارداد در همهٔ حالت‌ها ثابت می‌ماند.',
        },
        {
          icon: <Calculator className="w-4 h-4" />,
          title: 'ودیعهٔ دلخواه',
          body: 'اگر ودیعهٔ مدنظرتان را وارد کنید، اجارهٔ معادل آن محاسبه می‌شود. هرچه ودیعه بیشتر باشد، اجاره کمتر است و برعکس.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'توافقی بودن نرخ',
          body: 'نرخ تبدیل قانون رسمی ندارد و عرفی و قابل مذاکره است؛ بسته به منطقه، کیفیت ملک، نوساز بودن و شرایط بازار تغییر می‌کند. نرخ پیش‌فرض را می‌توانید ویرایش کنید.',
        },
      ]}
      disclaimer="این محاسبه بر پایهٔ عرف بازار است و رقم قطعی نیست؛ نرخ نهایی تابع توافق موجر و مستأجر و عرف منطقه است."
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField label="ودیعهٔ فعلی (رهن)" amount={deposit} setAmount={setDeposit} unit={unit} setUnit={setUnit} />
          <MoneyField label="اجارهٔ ماهانهٔ فعلی" amount={rent} setAmount={setRent} unit={unit} />

          <RateField
            label="نرخ تبدیل ماهانه"
            official={RAHN_TO_RENT_MONTHLY_RATE * 100}
            value={rate}
            onChange={setRate}
            source="عرف بازار ۱۴۰۴"
            officialLabel="عرف بازار"
            hint="نرخ رایج بازار حدود ۳٪ ماهانه است؛ برای منطقه/توافق خاص «نرخ دلخواه» را بزنید."
          />

          <MoneyField label="ودیعهٔ دلخواه (اختیاری)" amount={desired} setAmount={setDesired} unit={unit} />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<ArrowRightLeft className="w-6 h-6" />}>
                ودیعه و اجارهٔ فعلی را وارد کنید تا معادل‌ها محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="معادل رهن کامل"
                  value={fmtMoney(calc.fullDeposit)}
                  suffix={u}
                  sub={`${toWords(calc.fullDeposit)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="ودیعهٔ فعلی" value={`${fmtMoney(dep)} ${u}`} />
                  <Row label="اجارهٔ فعلی" value={`${fmtMoney(rnt)} ${u}`} />
                  <Row label="نرخ تبدیل" value={`${faNum((monthlyRate * 100).toString())}٪ ماهانه`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="معادل رهن کامل (اجاره صفر)" value={`${fmtMoney(calc.fullDeposit)} ${u}`} strong />
                  <Row label="معادل اجارهٔ کامل (ودیعه صفر)" value={`${fmtMoney(calc.fullRent)} ${u}`} strong />
                </div>

                {calc.desiredRow && (
                  <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2.5">
                    <span className="text-foreground font-bold font-display text-sm">با ودیعهٔ دلخواه</span>
                    {calc.desiredRow.valid ? (
                      <>
                        <Row label="ودیعه" value={`${fmtMoney(calc.desiredRow.dep)} ${u}`} />
                        <Row label="اجارهٔ معادل" value={`${fmtMoney(Math.round(calc.desiredRow.rent))} ${u}`} strong />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        ودیعهٔ دلخواه از «معادل رهن کامل» بیشتر است؛ مقداری کمتر وارد کنید.
                      </p>
                    )}
                  </div>
                )}

                <Notice accent={ACCENT}>
                  ارزش ماهانهٔ کل این قرارداد ثابت است؛ افزایش ودیعه اجاره را کم و کاهش آن اجاره را زیاد می‌کند.
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
