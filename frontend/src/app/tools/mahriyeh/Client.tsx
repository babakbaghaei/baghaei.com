'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Gem, Coins, Scale, TrendingUp, Info, RefreshCw, Loader2, AlertCircle, CalendarClock, Gavel } from 'lucide-react';
import { useMarketPrice, type MarketPrices } from '@/components/tools/useMarketPrice';
import { pdateFromGregorian, formatPDate } from '@/components/tools/DatePicker';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
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
  fmtNum,
  toWords,
  cleanNum,
  normalizeDigits,
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

const ACCENT = '190, 18, 60'; // rose-700

// انواع سکه/طلا که نرخ روزشان از بازار خوانده می‌شود.
type CoinKind = 'sekee' | 'nim' | 'rob' | 'mesghal';
const COIN_META: Record<CoinKind, { label: string; priceKey: keyof MarketPrices }> = {
  sekee: { label: 'سکهٔ تمام بهار آزادی', priceKey: 'sekee' },
  nim: { label: 'نیم‌سکه', priceKey: 'nim' },
  rob: { label: 'ربع‌سکه', priceKey: 'rob' },
  mesghal: { label: 'مثقال طلا (آب‌شده)', priceKey: 'mesghal' },
};

export default function Mahriyeh() {
  // بخش سکه
  const [coinKind, setCoinKind] = useState<CoinKind>('sekee');
  const [coinCount, setCoinCount] = useState('');
  const [coinPrice, setCoinPrice] = useState(''); // قیمت روز هر واحد — از نرخ بازار پر می‌شود، قابل ویرایش

  // بخش وجه نقد (تعدیل با شاخص — ماده ۱۰۸۲ تبصره). شاخص از جدول رسمی بانک مرکزی، خودکار.
  const [cash, setCash] = useState('');
  const [dueYear, setDueYear] = useState<number>(1390); // سال عقد
  const [payYear, setPayYear] = useState<number>(CPI_LAST_YEAR); // سال مطالبه

  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  const { prices, updatedAt, loading: marketLoading, error: marketError, refresh } = useMarketPrice();

  // قیمت بازار واحدِ انتخاب‌شده به تومان (در صورت ریالی بودن واحد، ×۱۰)
  const marketCoinToman = useMemo(() => {
    const raw = prices?.[COIN_META[coinKind].priceKey];
    if (!raw || raw <= 0) return 0;
    return unit === 'rial' ? raw * 10 : raw;
  }, [prices, unit, coinKind]);

  // تاریخ جلالی نرخ بازار از updatedAt میلادی ("YYYY-MM-DD ...")
  const marketJalali = useMemo(() => {
    if (!updatedAt) return '';
    const m = updatedAt.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!m) return '';
    try {
      return formatPDate(pdateFromGregorian(Number(m[1]), Number(m[2]), Number(m[3])));
    } catch {
      return '';
    }
  }, [updatedAt]);

  const applyMarketCoinPrice = () => {
    if (marketCoinToman > 0) setCoinPrice(marketCoinToman.toLocaleString('en-US'));
  };

  // پر کردن خودکار قیمت با اولین دریافت موفق نرخ بازار (در صورت خالی بودن و دست‌نخوردگی توسط کاربر)
  const coinTouched = useRef(false);
  const autoFilled = useRef(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (coinTouched.current) return;
    if (coinPrice.trim() !== '' && autoFilled.current) {
      // قیمت قبلاً خودکار پر شده و کاربر دست نزده؛ با تغییر نوع سکه به‌روزش کن.
      if (marketCoinToman > 0) setCoinPrice(marketCoinToman.toLocaleString('en-US'));
      return;
    }
    if (coinPrice.trim() !== '') return;
    if (marketCoinToman > 0) {
      autoFilled.current = true;
      setCoinPrice(marketCoinToman.toLocaleString('en-US'));
    }
  }, [marketCoinToman, coinPrice]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ck = p.get('coinKind');
    if (ck && ck in COIN_META) setCoinKind(ck as CoinKind);
    const cc = p.get('coins');
    if (cc && /^\d*\.?\d+$/.test(cc)) setCoinCount(cc);
    const cp = p.get('coinPrice');
    if (cp && /^\d+$/.test(cp)) {
      coinTouched.current = true;
      setCoinPrice(Number(cp).toLocaleString('en-US'));
    }
    const ch = p.get('cash');
    if (ch && /^\d+$/.test(ch)) setCash(Number(ch).toLocaleString('en-US'));
    const dy = Number(p.get('due'));
    if (dy && CPI_YEARS.includes(dy)) setDueYear(dy);
    const py = Number(p.get('pay'));
    if (py && CPI_YEARS.includes(py)) setPayYear(py);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const coinCountNum = Math.max(0, Number(normalizeDigits(coinCount)) || 0);
  const coinPriceNum = cleanNum(coinPrice);
  const cashNum = cleanNum(cash);

  const calc = useMemo(() => {
    const coinValue = coinCountNum > 0 && coinPriceNum > 0 ? coinCountNum * coinPriceNum : 0;

    // تعدیل وجه نقد بر اساس نسبت شاخص رسمی بانک مرکزی (CPI) — خودکار از جدول.
    const indexDue = getAnnualIndex(dueYear);
    const indexPay = getAnnualIndex(payYear);
    const hasCash = cashNum > 0;
    const hasIndex = indexDue != null && indexPay != null && indexDue > 0;
    const ratio = hasIndex ? indexPay! / indexDue! : 0;
    const adjustedCash = hasCash && hasIndex ? cashNum * ratio : 0;

    if (coinValue <= 0 && adjustedCash <= 0) return null;

    const total = Math.round(coinValue + adjustedCash);
    return {
      coinValue: Math.round(coinValue),
      adjustedCash: Math.round(adjustedCash),
      ratio,
      indexDue,
      indexPay,
      hasCoin: coinValue > 0,
      hasCash,
      hasIndex,
      provisional: isProvisionalYear(payYear) || isProvisionalYear(dueYear),
      total,
    };
  }, [coinCountNum, coinPriceNum, cashNum, dueYear, payYear]);

  const u = unitLabel(unit);

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  const fmtIndex = (n: number | null) => {
    if (n == null) return '—';
    const maxFrac = n >= 100 ? 1 : n >= 10 ? 2 : n >= 1 ? 3 : 4;
    return toPersianDigits(n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxFrac }));
  };

  const yearOptions = [...CPI_YEARS].reverse().map((y) => (
    <option key={y} value={y}>
      {toPersianDigits(y)}
      {isProvisionalYear(y) ? ' (جاری)' : ''}
    </option>
  ));

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مهریه به نرخ روز',
      text: `ارزش روز مهریه: ${fmtMoney(calc.total)} ${u}`,
      params: {
        coinKind,
        coins: String(coinCountNum),
        coinPrice: String(coinPriceNum),
        cash: String(cashNum),
        due: String(dueYear),
        pay: String(payYear),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="مهریه به نرخ روز"
      subtitle="محاسبهٔ ارزش روز مهریه بر اساس تعداد و نوع سکه و قیمت روز، یا مبلغ وجه نقد تعدیل‌شده با شاخص بانک مرکزی"
      icon={Gem}
      accent={ACCENT}
      info={[
        {
          icon: <Coins className="w-4 h-4" />,
          title: 'مهریهٔ سکه‌ای',
          body: 'اگر مهریه به سکه (تمام، نیم، ربع) یا مثقال طلا تعیین شده باشد، ارزش روز آن برابر تعداد ضرب در قیمت روز هر واحد است. قیمت روز از نرخ بازار آزاد پیش‌فرض پر می‌شود و قابل ویرایش است.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'تعدیل وجه نقد (ماده ۱۰۸۲ تبصره)',
          body: 'اگر مهریه «وجه رایج» (مبلغ پول) باشد، طبق تبصرهٔ مادهٔ ۱۰۸۲ قانون مدنی، مبلغ بر اساس نسبت شاخص بهای کالا و خدمات سال مطالبه به سال عقد محاسبه می‌شود: مهریهٔ تعدیل‌شده = مبلغ مهریه × (شاخص سال مطالبه ÷ شاخص سال عقد).',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'شاخص خودکار بانک مرکزی',
          body: `کافی است سال عقد و سال مطالبه را انتخاب کنید؛ شاخص بهای مصرف‌کننده (CPI) از جدول رسمی ${CPI_SOURCE} به‌صورت خودکار اعمال می‌شود و نیازی به وارد کردن دستی عدد شاخص نیست.`,
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'محدودیت محاسبه',
          body: 'این برآورد صرفاً جنبهٔ راهنما دارد و رقم قطعی مهریه را دادگاه با استعلام رسمی شاخص و قیمت روز سکه تعیین می‌کند. این ابزار جایگزین مشاورهٔ حقوقی یا حکم دادگاه نیست.',
        },
      ]}
      disclaimer="قیمت روز سکه از نرخ بازار آزاد و شاخص بهای کالا و خدمات از جدول رسمی بانک مرکزی خوانده می‌شود؛ نتیجه صرفاً برآوردی است. رقم رسمی مهریه را دادگاه با استعلام رسمی تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-7">
          {/* نوع سکه */}
          <SelectField
            icon={<Coins className="w-4 h-4" />}
            label="نوع سکه / طلا"
            hint="نوع آنچه در عقدنامه تعیین شده را انتخاب کنید؛ قیمت روز همان واحد اعمال می‌شود"
            value={coinKind}
            onChange={(v) => {
              setCoinKind(v as CoinKind);
              // با تغییر نوع، اجازه بده مقدارِ خودکار دوباره با قیمت نوع جدید پر شود.
              if (!coinTouched.current) {
                autoFilled.current = false;
                setCoinPrice('');
              }
            }}
          >
            {(Object.keys(COIN_META) as CoinKind[]).map((k) => (
              <option key={k} value={k}>
                {COIN_META[k].label}
              </option>
            ))}
          </SelectField>

          {/* بخش سکه */}
          <Field label={`تعداد ${COIN_META[coinKind].label}`} hint="تعداد تعیین‌شده در عقدنامه را وارد کنید">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(coinCount)}
              onChange={(e) => setCoinCount(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label={`تعداد ${COIN_META[coinKind].label}`}
              placeholder="۰"
              className={inputClass}
            />
          </Field>

          <MoneyField
            label={`قیمت روز هر ${COIN_META[coinKind].label}`}
            amount={coinPrice}
            setAmount={(v: string) => {
              coinTouched.current = true;
              setCoinPrice(v);
            }}
            unit={unit}
            setUnit={setUnit}
          />

          {/* وضعیت نرخ بازار */}
          <div className="-mt-3">
            {marketLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-display">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                در حال دریافت نرخ بازار…
              </div>
            ) : marketError || marketCoinToman <= 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-500/90 font-display">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                دریافت نرخ بازار ناموفق بود — قیمت را دستی وارد کنید.
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-display">
                <span className="text-muted-foreground/80">
                  نرخ بازار آزاد · {marketJalali ? faNum(marketJalali) : '—'} (تقریبی)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyMarketCoinPrice}
                    className="text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    استفاده از قیمت بازار
                  </button>
                  <button
                    type="button"
                    onClick={refresh}
                    aria-label="به‌روزرسانی نرخ بازار"
                    className="inline-flex items-center gap-1 text-muted-foreground/70 hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-border/60" />

          {/* بخش وجه نقد + تعدیل با شاخص خودکار */}
          <p className="text-xs text-muted-foreground/80 font-display leading-relaxed text-right">
            بخش زیر اختیاری است و برای مهریهٔ «وجه نقد» با تعدیل خودکار بر اساس شاخص بانک مرکزی (مادهٔ ۱۰۸۲ تبصره) به کار می‌رود.
          </p>

          <MoneyField
            label="مبلغ مهریهٔ نقدی (سال عقد)"
            amount={cash}
            setAmount={setCash}
            unit={unit}
            setUnit={setUnit}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              icon={<CalendarClock className="w-4 h-4" />}
              label="سال عقد"
              hint="سال جاری‌شدن عقد"
              value={dueYear}
              onChange={(v) => setDueYear(Number(v))}
            >
              {yearOptions}
            </SelectField>
            <SelectField
              icon={<Gavel className="w-4 h-4" />}
              label="سال مطالبه"
              hint="سال مطالبه یا صدور حکم"
              value={payYear}
              onChange={(v) => setPayYear(Number(v))}
            >
              {yearOptions}
            </SelectField>
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground/70 font-display">
            <Info className="w-3.5 h-3.5 shrink-0" />
            شاخص از جدول رسمی بانک مرکزی خوانده می‌شود؛ آخرین سال قطعی {toPersianDigits(CPI_LAST_COMPLETE_YEAR)} و سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است.
          </p>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Gem className="w-6 h-6" />}>
                تعداد و نوع سکه و قیمت روز را وارد کنید، یا برای مهریهٔ نقدی مبلغ و سال‌ها را تکمیل کنید.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="ارزش روز مهریه"
                  value={fmtMoney(calc.total)}
                  suffix={u}
                  sub={`${toWords(calc.total)} ${u}`}
                />
                <div className="space-y-2.5">
                  {calc.hasCoin && (
                    <>
                      <Row label="نوع" value={COIN_META[coinKind].label} />
                      <Row label="تعداد" value={`${faNum(String(coinCountNum))} عدد`} />
                      <Row label="قیمت روز هر واحد" value={`${fmtMoney(coinPriceNum)} ${u}`} />
                      <Row label="ارزش سکه‌ها" value={`${fmtMoney(calc.coinValue)} ${u}`} strong />
                    </>
                  )}
                  {calc.hasCoin && calc.adjustedCash > 0 && <div className="h-px bg-border/60 my-1" />}
                  {calc.hasCash && (
                    <>
                      <Row label="مهریهٔ نقدی (سال عقد)" value={`${fmtMoney(cashNum)} ${u}`} />
                      {calc.hasIndex ? (
                        <>
                          <Row label="شاخص سال عقد" value={fmtIndex(calc.indexDue)} />
                          <Row label="شاخص سال مطالبه" value={fmtIndex(calc.indexPay)} />
                          <Row label="ضریب تعدیل شاخص" value={`${fmtNum(calc.ratio, 4)} برابر`} />
                          <Row label="مهریهٔ نقدی تعدیل‌شده" value={`${fmtMoney(calc.adjustedCash)} ${u}`} strong />
                        </>
                      ) : (
                        <Row label="تعدیل نقدی" value="شاخص این بازه موجود نیست" />
                      )}
                    </>
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ارزش روز کل مهریه" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                {calc.provisional && (
                  <Notice accent={ACCENT}>
                    شاخص سال {toPersianDigits(CPI_LAST_YEAR)} تخمینی است (بر پایهٔ آخرین نرخ تورم نقطه‌به‌نقطه)؛ متوسط سالانهٔ قطعی آن هنوز منتشر نشده است.
                  </Notice>
                )}
                <Notice accent={ACCENT}>
                  قیمت روز سکه از بازار آزاد و شاخص از جدول بانک مرکزی است؛ این نتیجه برآوردی است و رقم قطعی را دادگاه تعیین می‌کند.
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
