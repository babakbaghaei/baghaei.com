'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ReceiptText, Scale, Percent, CalendarClock, Info } from 'lucide-react';
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
import {
  PersianDatePicker,
  pdateFromGregorian,
  pdateToDate,
  type PDate,
} from '@/components/tools/DatePicker';

const ACCENT = '245, 158, 11'; // amber-500

/** اختلاف روزِ بین دو PDate؛ اگر یکی null بود null. */
function daysBetween(from: PDate | null, to: PDate | null): number | null {
  if (!from || !to) return null;
  return Math.round((pdateToDate(to).getTime() - pdateToDate(from).getTime()) / 86400000);
}

/** PDate به‌صورت ISO میلادی (yyyy-mm-dd) برای پارامترهای URL. */
function pdateToISO(p: PDate): string {
  return `${p.gy}-${String(p.gm).padStart(2, '0')}-${String(p.gd).padStart(2, '0')}`;
}

/** PDate از یک رشتهٔ ISO میلادی؛ اگر نامعتبر بود null. */
function pdateFromISO(s: string): PDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return pdateFromGregorian(Number(m[1]), Number(m[2]), Number(m[3]));
}

const inputClass =
  'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

export default function KhesaratCheque() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('30'); // نرخ شاخص سالانه — نمونه و قابل ویرایش
  const [unit, setUnit] = useState<Unit>('toman');

  // حالت ورودی روز: مستقیم یا از روی تاریخ سررسید/پرداخت
  const [days, setDays] = useState('');
  const [dueDate, setDueDate] = useState<PDate | null>(null);
  const [payDate, setPayDate] = useState<PDate | null>(null);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pr = p.get('principal');
    if (pr && /^\d+$/.test(pr)) setPrincipal(Number(pr).toLocaleString('en-US'));
    const rt = p.get('rate');
    if (rt && /^\d*\.?\d+$/.test(rt)) setRate(rt);
    const dy = p.get('days');
    if (dy && /^\d+$/.test(dy)) setDays(dy);
    const dd = p.get('due');
    if (dd) {
      const pdd = pdateFromISO(dd);
      if (pdd) setDueDate(pdd);
    }
    const pd = p.get('pay');
    if (pd) {
      const ppd = pdateFromISO(pd);
      if (ppd) setPayDate(ppd);
    }
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const principalNum = cleanNum(principal);
  const annualRate = Math.max(0, Number(normalizeDigits(rate)) || 0);

  // روزهای محاسبه‌شده از تاریخ‌ها (در صورت معتبر بودن) بر روزِ دستی اولویت دارد.
  const datesDays = daysBetween(dueDate, payDate);
  const manualDays = Math.max(0, Math.floor(Number(normalizeDigits(days)) || 0));
  const effectiveDays =
    datesDays != null && datesDays > 0 ? datesDays : datesDays != null && datesDays <= 0 ? 0 : manualDays;
  const usingDates = datesDays != null;

  const calc = useMemo(() => {
    if (principalNum <= 0 || effectiveDays <= 0) return null;
    // ماده ۵۲۲ ق.آ.د.م: خسارت تأخیر تأدیه = اصل × نرخ شاخص سالانه × (روز تأخیر / ۳۶۵)
    const damage = (principalNum * (annualRate / 100) * effectiveDays) / 365;
    const total = principalNum + damage;
    const dailyDamage = (principalNum * (annualRate / 100)) / 365;
    return {
      damage: Math.round(damage),
      total: Math.round(total),
      dailyDamage: Math.round(dailyDamage),
    };
  }, [principalNum, annualRate, effectiveDays]);

  const u = unitLabel(unit);

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'خسارت تأخیر چک برگشتی',
      text: `چک ${fmtMoney(principalNum)} ${u} با نرخ شاخص ${faNum(String(annualRate))}٪ و ${faNum(String(effectiveDays))} روز تأخیر — خسارت تأخیر: ${fmtMoney(calc.damage)} ${u}`,
      params: {
        principal: String(principalNum),
        rate: String(annualRate),
        days: String(effectiveDays),
        ...(usingDates && dueDate ? { due: pdateToISO(dueDate) } : {}),
        ...(usingDates && payDate ? { pay: pdateToISO(payDate) } : {}),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="خسارت تأخیر چک برگشتی"
      subtitle="برآورد خسارت تأخیر تأدیه مبلغ چک برگشتی بر مبنای نرخ شاخص و تعداد روز تأخیر"
      icon={ReceiptText}
      accent={ACCENT}
      info={[
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'مبنای محاسبه (ماده ۵۲۲)',
          body: 'این برآورد بر پایهٔ منطق مادهٔ ۵۲۲ قانون آیین دادرسی مدنی انجام می‌شود؛ خسارت تأخیر تأدیه برابر است با اصل مبلغ ضرب در نرخ شاخص سالانه ضرب در نسبت روزهای تأخیر به ۳۶۵. مبدأ تأخیر معمولاً تاریخ سررسید چک (یا تاریخ مطالبه) است.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نرخ شاخص سالانه',
          body: 'نرخ را به‌صورت «سالانه» وارد کنید. مرجع رسمی، شاخص بهای کالا و خدمات مصرفی اعلامی بانک مرکزی است که سالانه تغییر می‌کند. نرخ پیش‌فرض صرفاً نمونه است و باید با نرخ رسمی دورهٔ موردنظر شما جایگزین شود؛ این عدد قابل ویرایش است.',
        },
        {
          icon: <CalendarClock className="w-4 h-4" />,
          title: 'تعداد روز تأخیر',
          body: 'می‌توانید تعداد روز را مستقیم وارد کنید یا تاریخ سررسید و تاریخ پرداخت را بدهید تا روزها خودکار محاسبه شود. اگر هر دو تاریخ معتبر باشند، روزِ محاسبه‌شده از تاریخ‌ها مبنا قرار می‌گیرد و ورودی دستی نادیده گرفته می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'مواردِ خارج از این برآورد',
          body: 'این محاسبه فقط خسارت تأخیر تأدیه اصل مبلغ چک را پوشش می‌دهد؛ هزینهٔ دادرسی، حق‌الوکاله، خسارت قراردادی توافقی و سایر مطالبات احتمالی در آن لحاظ نشده است. تعیین رقم قطعی و نرخ شاخصِ هر دوره با مرجع قضایی است.',
        },
      ]}
      disclaimer={
        <>
          این یک <strong>برآورد</strong> است و رقم قطعی را دادگاه بر مبنای نرخ شاخص رسمی اعلامی بانک
          مرکزی برای دورهٔ تأخیر تعیین می‌کند. نرخ شاخص را خودِ کاربر وارد می‌کند؛ پیش از استناد،
          نرخ رسمی روز را راستی‌آزمایی کنید.
        </>
      }
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="مبلغ چک"
            amount={principal}
            setAmount={setPrincipal}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="نرخ شاخص سالانه" hint="نرخ رسمی بانک مرکزی برای دورهٔ تأخیر را وارد کنید (نمونه، قابل ویرایش)">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(rate)}
                onChange={(e) => setRate(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="نرخ شاخص سالانه به درصد"
                className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-10 font-display text-lg text-center focus:border-primary outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground/50">
                ٪
              </span>
            </div>
          </Field>

          <Field label="تعداد روز تأخیر" hint="می‌توانید مستقیم وارد کنید یا با دو تاریخ زیر محاسبه شود">
            <input
              type="text"
              inputMode="numeric"
              value={faNum(days)}
              onChange={(e) => setDays(normalizeDigits(e.target.value).replace(/[^\d]/g, ''))}
              disabled={usingDates}
              dir="ltr"
              aria-label="تعداد روز تأخیر"
              className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="تاریخ سررسید" hint="مبدأ تأخیر (اختیاری)">
              <PersianDatePicker
                value={dueDate}
                onChange={(p) => setDueDate(p)}
                onClear={() => setDueDate(null)}
                clearable
                placeholder="انتخاب تاریخ سررسید"
                ariaLabel="تاریخ سررسید چک"
              />
            </Field>
            <Field label="تاریخ پرداخت" hint="پایان تأخیر (اختیاری)">
              <PersianDatePicker
                value={payDate}
                onChange={(p) => setPayDate(p)}
                onClear={() => setPayDate(null)}
                clearable
                placeholder="انتخاب تاریخ پرداخت"
                ariaLabel="تاریخ پرداخت"
              />
            </Field>
          </div>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<ReceiptText className="w-6 h-6" />}>
                مبلغ چک، نرخ شاخص و تعداد روز تأخیر (یا تاریخ‌ها) را وارد کنید تا خسارت تأخیر برآورد شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="خسارت تأخیر تأدیه"
                  value={fmtMoney(calc.damage)}
                  suffix={u}
                  sub={`${toWords(calc.damage)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="مبلغ چک" value={`${fmtMoney(principalNum)} ${u}`} />
                  <Row label="نرخ شاخص سالانه" value={fmtPct(annualRate)} />
                  <Row label="تعداد روز تأخیر" value={`${faNum(String(effectiveDays))} روز`} />
                  <Row label="خسارت روزانه" value={`${fmtMoney(calc.dailyDamage)} ${u}`} />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="خسارت تأخیر تأدیه" value={`${fmtMoney(calc.damage)} ${u}`} strong />
                  <Row label="مجموع قابل مطالبه (اصل + خسارت)" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  نرخ شاخص واردشده نمونه است؛ رقم قطعی بر مبنای نرخ رسمی اعلامی بانک مرکزی و رأی دادگاه تعیین می‌شود.
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
