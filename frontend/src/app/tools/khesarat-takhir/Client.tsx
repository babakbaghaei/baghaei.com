'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Scale,
  Info,
  Gavel,
  CalendarClock,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
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
  CPI_BASE_YEAR,
  CPI_SOURCE,
  CPI_LAST_YEAR,
  CPI_LAST_COMPLETE_YEAR,
  CPI_LATEST_MONTHLY,
  getAnnualIndex,
  isProvisionalYear,
} from '@/lib/data/cpi-index';

const ACCENT = '245, 158, 11'; // amber — اشتراک با رجیستری ابزارها

export default function KhesaratTakhir() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');

  const [dueYear, setDueYear] = useState<number>(1400);
  const [payYear, setPayYear] = useState<number>(CPI_LAST_YEAR);

  const { share, copied } = useShareResult();

  // restore state from a shared link (?amount&unit&due&pay). Runs after mount
  // (not a lazy initializer) to keep the static SSR markup hydration-safe.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get('amount');
    if (a && /^\d+$/.test(a)) {
      setAmount(Number(a).toLocaleString('en-US'));
    }
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const d = Number(p.get('due'));
    if (d && CPI_YEARS.includes(d)) setDueYear(d);
    const pa = Number(p.get('pay'));
    if (pa && CPI_YEARS.includes(pa)) setPayYear(pa);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cleanNumber = useMemo(() => cleanNum(amount), [amount]);

  const calc = useMemo(() => {
    if (cleanNumber <= 0) return null;

    const indexDue = getAnnualIndex(dueYear);
    const indexPay = getAnnualIndex(payYear);

    if (indexDue == null || indexPay == null || indexDue <= 0) {
      return { error: 'شاخص این بازه هنوز منتشر نشده است.' as string };
    }
    if (payYear < dueYear) {
      return { error: 'سال پرداخت باید بعد از سال سررسید باشد.' as string };
    }

    const updated = Math.round(cleanNumber * (indexPay / indexDue));
    const penalty = updated - cleanNumber;
    const growthPct = (indexPay / indexDue - 1) * 100;
    const years = payYear - dueYear;
    const provisional = isProvisionalYear(payYear) || isProvisionalYear(dueYear);

    return { indexDue, indexPay, updated, penalty, growthPct, years, provisional };
  }, [cleanNumber, dueYear, payYear]);

  const fmt = (n: number) => toPersianDigits(Math.round(n).toLocaleString('en-US'));
  const fmtPct = (n: number) =>
    toPersianDigits((Math.round(n * 10) / 10).toLocaleString('en-US')) + '٪';
  // adaptive precision: shows more decimals for small index values so old
  // due-years (e.g. ۱۳۴۰ ≈ ۰٫۰۵ with base ۱۳۹۵=۱۰۰) never collapse to «۰».
  const fmtIndex = (n: number) => {
    const maxFrac = n >= 100 ? 1 : n >= 10 ? 2 : n >= 1 ? 3 : 4;
    return toPersianDigits(
      n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxFrac }),
    );
  };
  const u = unitLabel(unit);
  const latest = CPI_LATEST_MONTHLY[CPI_LATEST_MONTHLY.length - 1];

  const onShare = () => {
    if (!calc || 'error' in calc) return;
    share({
      title: 'محاسبه خسارت تأخیر تأدیه',
      text:
        `خسارت تأخیر تأدیه\n` +
        `اصل بدهی: ${fmt(cleanNumber)} ${u}\n` +
        `از سال ${toPersianDigits(dueYear)} تا ${toPersianDigits(payYear)}\n` +
        `جمع کل قابل پرداخت: ${fmt(calc.updated)} ${u}`,
      params: {
        amount: String(cleanNumber),
        unit,
        due: String(dueYear),
        pay: String(payYear),
      },
    });
  };

  const yearOptions = [...CPI_YEARS].reverse().map((y) => (
    <option key={y} value={y}>
      {toPersianDigits(y)}
      {isProvisionalYear(y) ? ' (جاری)' : ''}
    </option>
  ));

  return (
    <ToolShell
      title="محاسبه خسارت تأخیر تأدیه"
      subtitle="بر اساس ماده ۵۲۲ آیین دادرسی مدنی و رأی وحدت رویه ۸۵۰ (شاخص سالانهٔ بانک مرکزی)"
      icon={Scale}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی (ماده ۵۲۲)',
          body: 'بر اساس ماده ۵۲۲ قانون آیین دادرسی مدنی، چنانچه طلب از نوع وجه رایج باشد و با مطالبهٔ داین و تمکن مدیون پرداخت نشود، خسارت تأخیر بر اساس تغییر شاخص قیمت بانک مرکزی محاسبه می‌شود.',
        },
        {
          icon: <Gavel className="w-4 h-4" />,
          title: 'رأی وحدت رویه شماره ۸۵۰',
          body: 'طبق رأی وحدت رویه شماره ۸۵۰ هیأت عمومی دیوان عالی کشور (۱۴۰۳/۵/۳۱)، ملاک محاسبهٔ خسارت تأخیر تأدیه «متوسط شاخص سالانه» است؛ همان مبنایی که این ابزار به‌کار می‌برد.',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'فرمول محاسبه',
          body: 'مبلغ روزآمدشده = اصل بدهی × (شاخص سال پرداخت ÷ شاخص سال سررسید). خسارت تأخیر تأدیه برابر است با تفاوت مبلغ روزآمدشده و اصل بدهی.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'منبع داده‌ها',
          body: (
            <>
              شاخص سالانه از زنجیرهٔ «نرخ تورم سالانهٔ» رسمی {CPI_SOURCE} بازسازی شده است (سال پایه{' '}
              {toPersianDigits(CPI_BASE_YEAR)}=۱۰۰). آخرین نرخ تورم نقطه‌به‌نقطهٔ منتشرشده:{' '}
              {latest.month} {toPersianDigits(latest.year)} برابر {fmtPct(latest.rate)}.
            </>
          ),
        },
      ]}
      disclaimer="این محاسبه صرفاً جنبهٔ راهنما و تخمینی دارد. مبنای قطعی خسارت، نظر کارشناس رسمی و حکم دادگاه است. در دعاوی واقعی حتماً با وکیل یا کارشناس رسمی دادگستری مشورت کنید."
    >
      <TwoPane>
        <Panel className="space-y-9">
          {/* amount */}
          <MoneyField
            label="اصل بدهی"
            amount={amount}
            setAmount={setAmount}
            unit={unit}
            setUnit={setUnit}
          />

          {/* years — payment first, due second (swapped) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              icon={<Gavel className="w-4 h-4" />}
              label="سال پرداخت"
              hint="سالی که بدهی پرداخت یا حکم صادر می‌شود"
              value={payYear}
              onChange={(v) => setPayYear(Number(v))}
            >
              {yearOptions}
            </SelectField>
            <SelectField
              icon={<CalendarClock className="w-4 h-4" />}
              label="سال سررسید"
              hint="سالی که بدهی باید پرداخت می‌شد"
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
              <EmptyState accent={ACCENT} icon={<Scale className="w-6 h-6" />}>
                مبلغ اصل بدهی را وارد کنید تا خسارت محاسبه شود.
              </EmptyState>
            ) : 'error' in calc ? (
              <ErrorState>{calc.error}</ErrorState>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                {/* headline — TOTAL payable */}
                <Headline
                  accent={ACCENT}
                  label="جمع کل قابل پرداخت"
                  value={fmt(calc.updated)}
                  suffix={u}
                  sub={`${toWords(calc.updated)} ${u}`}
                />

                {/* breakdown: principal + penalty = total */}
                <div className="space-y-2.5">
                  <Row label="اصل بدهی" value={`${fmt(cleanNumber)} ${u}`} />
                  <Row
                    label="خسارت تأخیر تأدیه"
                    value={
                      <span style={{ color: `rgb(${ACCENT})` }}>
                        {'+ '}
                        {fmt(calc.penalty)} {u}
                      </span>
                    }
                    strong
                  />
                  <div className="h-px bg-border/60 my-1" />
                  <Row
                    label="جمع کل قابل پرداخت"
                    value={`${fmt(calc.updated)} ${u}`}
                    strong
                  />
                </div>

                {/* details: everything */}
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
                    value={
                      calc.years > 0 ? `${toPersianDigits(calc.years)} سال` : 'کمتر از یک سال'
                    }
                  />
                  <Row label="شاخص سال سررسید" value={fmtIndex(calc.indexDue)} />
                  <Row label="شاخص سال پرداخت" value={fmtIndex(calc.indexPay)} />
                  <Row
                    label="ضریب روزآمدسازی"
                    value={`× ${toPersianDigits((calc.indexPay / calc.indexDue).toFixed(2))}`}
                  />
                </div>

                {/* provisional warning */}
                {calc.provisional && (
                  <Notice accent={ACCENT}>
                    شاخص سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است (بر پایهٔ آخرین نرخ تورم
                    نقطه‌به‌نقطه)؛ متوسط سالانهٔ قطعی آن هنوز منتشر نشده است.
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
