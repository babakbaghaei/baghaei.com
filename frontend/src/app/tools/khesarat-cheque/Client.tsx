'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ReceiptText, Scale, Gavel, CalendarClock, TrendingUp, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Row,
  Headline,
  EmptyState,
  ErrorState,
  Notice,
  ShareButton,
  useShareResult,
  AnimatePresence,
  motion,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import { toPersianDigits } from '@/lib/utils/format';
import {
  CPI_YEARS,
  CPI_SOURCE,
  CPI_LAST_YEAR,
  CPI_LAST_COMPLETE_YEAR,
  getAnnualIndex,
  isProvisionalYear,
} from '@/lib/data/cpi-index';

const ACCENT = '245, 158, 11'; // amber-500

export default function KhesaratCheque() {
  const [principal, setPrincipal] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const [dueYear, setDueYear] = useState<number>(1400); // سال سررسید چک
  const [payYear, setPayYear] = useState<number>(CPI_LAST_YEAR); // سال وصول/حکم

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pr = p.get('principal');
    if (pr && /^\d+$/.test(pr)) setPrincipal(Number(pr).toLocaleString('en-US'));
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const d = Number(p.get('due'));
    if (d && CPI_YEARS.includes(d)) setDueYear(d);
    const pa = Number(p.get('pay'));
    if (pa && CPI_YEARS.includes(pa)) setPayYear(pa);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const principalNum = cleanNum(principal);

  const calc = useMemo(() => {
    if (principalNum <= 0) return null;

    const indexDue = getAnnualIndex(dueYear);
    const indexPay = getAnnualIndex(payYear);

    if (indexDue == null || indexPay == null || indexDue <= 0) {
      return { error: 'شاخص این بازه هنوز منتشر نشده است.' as string };
    }
    if (payYear < dueYear) {
      return { error: 'سال وصول باید بعد از سال سررسید باشد.' as string };
    }

    const updated = Math.round(principalNum * (indexPay / indexDue));
    const damage = updated - principalNum;
    const growthPct = (indexPay / indexDue - 1) * 100;
    const years = payYear - dueYear;
    const provisional = isProvisionalYear(payYear) || isProvisionalYear(dueYear);

    return { indexDue, indexPay, updated, damage, growthPct, years, provisional };
  }, [principalNum, dueYear, payYear]);

  const fmt = (n: number) => toPersianDigits(Math.round(n).toLocaleString('en-US'));
  const fmtPct = (n: number) =>
    toPersianDigits((Math.round(n * 10) / 10).toLocaleString('en-US')) + '٪';
  const fmtIndex = (n: number) => {
    const maxFrac = n >= 100 ? 1 : n >= 10 ? 2 : n >= 1 ? 3 : 4;
    return toPersianDigits(n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxFrac }));
  };
  const u = unitLabel(unit);

  const yearOptions = [...CPI_YEARS].reverse().map((y) => (
    <option key={y} value={y}>
      {toPersianDigits(y)}
      {isProvisionalYear(y) ? ' (جاری)' : ''}
    </option>
  ));

  const onShare = () => {
    if (!calc || 'error' in calc) return;
    share({
      title: 'خسارت تأخیر چک برگشتی',
      text:
        `خسارت تأخیر چک برگشتی\n` +
        `مبلغ چک: ${fmt(principalNum)} ${u}\n` +
        `از سال ${toPersianDigits(dueYear)} تا ${toPersianDigits(payYear)}\n` +
        `جمع کل قابل مطالبه: ${fmt(calc.updated)} ${u}`,
      params: {
        principal: String(principalNum),
        unit,
        due: String(dueYear),
        pay: String(payYear),
      },
    });
  };

  return (
    <ToolShell
      title="خسارت تأخیر چک برگشتی"
      subtitle="برآورد خسارت تأخیر تأدیه مبلغ چک برگشتی بر مبنای شاخص رسمی بانک مرکزی (ماده ۵۲۲ و رأی وحدت رویه ۸۵۰)"
      icon={ReceiptText}
      accent={ACCENT}
      info={[
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'مبنای محاسبه (ماده ۵۲۲)',
          body: 'خسارت تأخیر تأدیهٔ مبلغ چک برگشتی طبق مادهٔ ۵۲۲ قانون آیین دادرسی مدنی بر اساس تغییر شاخص قیمت بانک مرکزی محاسبه می‌شود: مبلغ روزآمدشده = مبلغ چک × (شاخص سال وصول ÷ شاخص سال سررسید).',
        },
        {
          icon: <Gavel className="w-4 h-4" />,
          title: 'رأی وحدت رویه شماره ۸۵۰',
          body: 'طبق رأی وحدت رویه شماره ۸۵۰ هیأت عمومی دیوان عالی کشور (۱۴۰۳/۵/۳۱)، ملاک محاسبه «متوسط شاخص سالانه» است؛ همان مبنایی که این ابزار به‌کار می‌برد.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'شاخص خودکار بانک مرکزی',
          body: `کافی است سال سررسید چک و سال وصول/حکم را انتخاب کنید؛ شاخص بهای مصرف‌کننده از جدول رسمی ${CPI_SOURCE} به‌صورت خودکار اعمال می‌شود و نیازی به وارد کردن دستی نرخ نیست.`,
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'مواردِ خارج از این برآورد',
          body: 'این محاسبه فقط خسارت تأخیر تأدیهٔ اصل مبلغ چک را پوشش می‌دهد؛ هزینهٔ دادرسی، حق‌الوکاله و سایر مطالبات احتمالی در آن لحاظ نشده است. تعیین رقم قطعی با مرجع قضایی است.',
        },
      ]}
      disclaimer="این محاسبه صرفاً جنبهٔ راهنما و تخمینی دارد و بر پایهٔ شاخص رسمی بانک مرکزی است. مبنای قطعی خسارت، نظر کارشناس رسمی و حکم دادگاه است."
    >
      <TwoPane>
        <Panel className="space-y-9">
          <MoneyField
            label="مبلغ چک"
            amount={principal}
            setAmount={setPrincipal}
            unit={unit}
            setUnit={setUnit}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              icon={<Gavel className="w-4 h-4" />}
              label="سال وصول"
              hint="سالی که چک وصول یا حکم صادر می‌شود"
              value={payYear}
              onChange={(v) => setPayYear(Number(v))}
            >
              {yearOptions}
            </SelectField>
            <SelectField
              icon={<CalendarClock className="w-4 h-4" />}
              label="سال سررسید"
              hint="سال سررسید چک (مبدأ تأخیر)"
              value={dueYear}
              onChange={(v) => setDueYear(Number(v))}
            >
              {yearOptions}
            </SelectField>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground/70 font-display">
            <Info className="w-3.5 h-3.5 shrink-0" />
            مبنا «متوسط شاخص سالانه» است؛ آخرین سال قطعی {toPersianDigits(CPI_LAST_COMPLETE_YEAR)} و سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است.
          </p>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<ReceiptText className="w-6 h-6" />}>
                مبلغ چک را وارد و سال سررسید و وصول را انتخاب کنید تا خسارت تأخیر برآورد شود.
              </EmptyState>
            ) : 'error' in calc ? (
              <ErrorState>{calc.error}</ErrorState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="جمع کل قابل مطالبه"
                  value={fmt(calc.updated)}
                  suffix={u}
                  sub={`${toWords(calc.updated)} ${u}`}
                />
                <div className="space-y-2.5">
                  <Row label="مبلغ چک" value={`${fmt(principalNum)} ${u}`} />
                  <Row
                    label="خسارت تأخیر تأدیه"
                    value={
                      <span style={{ color: `rgb(${ACCENT})` }}>
                        {'+ '}
                        {fmt(calc.damage)} {u}
                      </span>
                    }
                    strong
                  />
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع کل قابل مطالبه" value={`${fmt(calc.updated)} ${u}`} strong />
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  <Row
                    label="رشد شاخص قیمت"
                    value={
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> {fmtPct(calc.growthPct)}
                      </span>
                    }
                  />
                  <Row
                    label="مدت تأخیر"
                    value={calc.years > 0 ? `${toPersianDigits(calc.years)} سال` : 'کمتر از یک سال'}
                  />
                  <Row label="شاخص سال سررسید" value={fmtIndex(calc.indexDue)} />
                  <Row label="شاخص سال وصول" value={fmtIndex(calc.indexPay)} />
                  <Row
                    label="ضریب روزآمدسازی"
                    value={`× ${toPersianDigits((calc.indexPay / calc.indexDue).toFixed(2))}`}
                  />
                </div>

                {calc.provisional && (
                  <Notice accent={ACCENT}>
                    شاخص سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است (بر پایهٔ آخرین نرخ تورم نقطه‌به‌نقطه)؛ متوسط سالانهٔ قطعی آن هنوز منتشر نشده است.
                  </Notice>
                )}

                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
