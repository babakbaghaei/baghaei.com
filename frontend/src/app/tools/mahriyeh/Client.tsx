'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Gem, Coins, Scale, TrendingUp, Info, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useMarketPrice } from '@/components/tools/useMarketPrice';
import { pdateFromGregorian, formatPDate } from '@/components/tools/DatePicker';
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
  fmtNum,
  toWords,
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '190, 18, 60'; // rose-700

export default function Mahriyeh() {
  // بخش سکه
  const [coinCount, setCoinCount] = useState('');
  const [coinPrice, setCoinPrice] = useState(''); // قیمت روز هر سکهٔ تمام — از نرخ بازار پر می‌شود، قابل ویرایش

  // بخش وجه نقد (تعدیل با شاخص — ماده ۱۰۸۲ تبصره)
  const [cash, setCash] = useState('');
  const [baseIndex, setBaseIndex] = useState(''); // شاخص سال عقد
  const [nowIndex, setNowIndex] = useState(''); // شاخص زمان مطالبه

  const [unit, setUnit] = useState<Unit>('toman');

  const { share, copied } = useShareResult();

  const { prices, updatedAt, loading: marketLoading, error: marketError, refresh } = useMarketPrice();

  // قیمت بازار هر سکهٔ تمام به تومان (در صورت ریالی بودن واحد، ×۱۰)
  const marketCoinToman = useMemo(() => {
    const sekee = prices?.sekee;
    if (!sekee || sekee <= 0) return 0;
    return unit === 'rial' ? sekee * 10 : sekee;
  }, [prices, unit]);

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

  // پر کردن خودکار قیمت سکه با اولین دریافت موفق نرخ بازار (در صورت خالی بودن و دست‌نخوردگی توسط کاربر)
  const coinTouched = useRef(false);
  const autoFilled = useRef(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (autoFilled.current || coinTouched.current) return;
    if (coinPrice.trim() !== '') return;
    if (marketCoinToman > 0) {
      autoFilled.current = true;
      setCoinPrice(marketCoinToman.toLocaleString('en-US'));
    }
  }, [marketCoinToman, coinPrice]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const cc = p.get('coins');
    if (cc && /^\d*\.?\d+$/.test(cc)) setCoinCount(cc);
    const cp = p.get('coinPrice');
    if (cp && /^\d+$/.test(cp)) {
      coinTouched.current = true;
      setCoinPrice(Number(cp).toLocaleString('en-US'));
    }
    const ch = p.get('cash');
    if (ch && /^\d+$/.test(ch)) setCash(Number(ch).toLocaleString('en-US'));
    const bi = p.get('baseIndex');
    if (bi && /^\d*\.?\d+$/.test(bi)) setBaseIndex(bi);
    const ni = p.get('nowIndex');
    if (ni && /^\d*\.?\d+$/.test(ni)) setNowIndex(ni);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const coinCountNum = Math.max(0, Number(normalizeDigits(coinCount)) || 0);
  const coinPriceNum = cleanNum(coinPrice);
  const cashNum = cleanNum(cash);
  const baseIdx = Math.max(0, Number(normalizeDigits(baseIndex)) || 0);
  const nowIdx = Math.max(0, Number(normalizeDigits(nowIndex)) || 0);

  const calc = useMemo(() => {
    const coinValue = coinCountNum > 0 && coinPriceNum > 0 ? coinCountNum * coinPriceNum : 0;

    // تعدیل وجه نقد بر اساس نسبت شاخص بهای کالا و خدمات (CPI)
    const hasCash = cashNum > 0;
    const hasIndex = baseIdx > 0 && nowIdx > 0;
    const ratio = hasIndex ? nowIdx / baseIdx : 0;
    const adjustedCash = hasCash && hasIndex ? cashNum * ratio : 0;

    if (coinValue <= 0 && adjustedCash <= 0) return null;

    const total = Math.round(coinValue + adjustedCash);
    return {
      coinValue: Math.round(coinValue),
      adjustedCash: Math.round(adjustedCash),
      ratio,
      hasCoin: coinValue > 0,
      hasCash,
      hasIndex,
      total,
    };
  }, [coinCountNum, coinPriceNum, cashNum, baseIdx, nowIdx]);

  const u = unitLabel(unit);

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  const onShare = () => {
    if (!calc) return;
    share({
      title: 'مهریه به نرخ روز',
      text: `ارزش روز مهریه: ${fmtMoney(calc.total)} ${u}`,
      params: {
        coins: String(coinCountNum),
        coinPrice: String(coinPriceNum),
        cash: String(cashNum),
        baseIndex: String(baseIdx),
        nowIndex: String(nowIdx),
        unit,
      },
    });
  };

  return (
    <ToolShell
      title="مهریه به نرخ روز"
      subtitle="محاسبهٔ ارزش روز مهریه بر اساس تعداد سکه و قیمت روز، یا مبلغ وجه نقد تعدیل‌شده با شاخص"
      icon={Gem}
      accent={ACCENT}
      info={[
        {
          icon: <Coins className="w-4 h-4" />,
          title: 'مهریهٔ سکه‌ای',
          body: 'اگر مهریه به «سکهٔ تمام بهار آزادی» تعیین شده باشد، ارزش روز آن برابر تعداد سکه ضرب در قیمت روز هر سکه است. قیمت سکه را خودتان بر اساس نرخ روز بازار وارد می‌کنید؛ عدد پیش‌فرض صرفاً نمونه است و باید با قیمت واقعی روز جایگزین شود.',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'تعدیل وجه نقد (ماده ۱۰۸۲ تبصره)',
          body: 'اگر مهریه «وجه رایج» (مبلغ پول) باشد، طبق تبصرهٔ مادهٔ ۱۰۸۲ قانون مدنی، مبلغ بر اساس نسبت شاخص بهای کالا و خدمات سال مطالبه به سال عقد محاسبه می‌شود: مهریهٔ تعدیل‌شده = مبلغ مهریه × (شاخص روز ÷ شاخص سال عقد).',
        },
        {
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'شاخص بهای مصرف‌کننده',
          body: 'شاخص‌های بهای کالا و خدمات مصرفی (CPI) را بانک مرکزی به‌صورت سالانه اعلام می‌کند. شاخص سال عقد و شاخص سال مطالبه را باید از جدول رسمی بانک مرکزی استخراج و در این محاسبه‌گر وارد کنید؛ این ابزار هیچ شاخص ثابتی را به‌جای شما فرض نمی‌کند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'محدودیت محاسبه',
          body: 'این برآورد صرفاً جنبهٔ راهنما دارد و رقم قطعی مهریه را دادگاه با استعلام رسمی شاخص و قیمت روز سکه تعیین می‌کند. این ابزار جایگزین مشاورهٔ حقوقی یا حکم دادگاه نیست.',
        },
      ]}
      disclaimer="قیمت روز سکه و شاخص‌های بهای کالا و خدمات را کاربر وارد می‌کند؛ نتیجه صرفاً برآوردی است. رقم رسمی مهریه را دادگاه با استعلام شاخص بانک مرکزی و قیمت روز تعیین می‌کند."
    >
      <TwoPane>
        <Panel className="space-y-7">
          {/* بخش سکه */}
          <Field label="تعداد سکهٔ تمام بهار آزادی" hint="تعداد سکه‌های تعیین‌شده در عقدنامه را وارد کنید">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(coinCount)}
              onChange={(e) => setCoinCount(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="تعداد سکهٔ تمام بهار آزادی"
              placeholder="۰"
              className={inputClass}
            />
          </Field>

          <MoneyField
            label="قیمت روز هر سکه"
            amount={coinPrice}
            setAmount={(v: any) => {
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
                دریافت نرخ بازار ناموفق بود — قیمت سکه را دستی وارد کنید.
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

          {/* بخش وجه نقد + تعدیل با شاخص */}
          <p className="text-xs text-muted-foreground/80 font-display leading-relaxed text-right">
            بخش زیر اختیاری است و برای مهریهٔ «وجه نقد» با تعدیل بر اساس شاخص (مادهٔ ۱۰۸۲ تبصره) به کار می‌رود.
          </p>

          <MoneyField
            label="مبلغ مهریهٔ نقدی (سال عقد)"
            amount={cash}
            setAmount={setCash}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="شاخص بهای سال عقد" hint="عدد شاخص CPI سال عقد از جدول بانک مرکزی">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(baseIndex)}
              onChange={(e) => setBaseIndex(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="شاخص بهای سال عقد"
              placeholder="۰"
              className={inputClass}
            />
          </Field>

          <Field label="شاخص بهای روز مطالبه" hint="عدد شاخص CPI سال مطالبه از جدول بانک مرکزی">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(nowIndex)}
              onChange={(e) => setNowIndex(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
              dir="ltr"
              aria-label="شاخص بهای روز مطالبه"
              placeholder="۰"
              className={inputClass}
            />
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Gem className="w-6 h-6" />}>
                تعداد سکه و قیمت روز را وارد کنید، یا برای مهریهٔ نقدی مبلغ و شاخص‌ها را تکمیل کنید.
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
                      <Row label="تعداد سکه" value={`${faNum(String(coinCountNum))} عدد`} />
                      <Row label="قیمت روز هر سکه" value={`${fmtMoney(coinPriceNum)} ${u}`} />
                      <Row label="ارزش سکه‌ها" value={`${fmtMoney(calc.coinValue)} ${u}`} strong />
                    </>
                  )}
                  {calc.hasCoin && calc.adjustedCash > 0 && <div className="h-px bg-border/60 my-1" />}
                  {calc.hasCash && (
                    <>
                      <Row label="مهریهٔ نقدی (سال عقد)" value={`${fmtMoney(cashNum)} ${u}`} />
                      {calc.hasIndex ? (
                        <>
                          <Row label="ضریب تعدیل شاخص" value={`${fmtNum(calc.ratio, 4)} برابر`} />
                          <Row label="مهریهٔ نقدی تعدیل‌شده" value={`${fmtMoney(calc.adjustedCash)} ${u}`} strong />
                        </>
                      ) : (
                        <Row label="تعدیل نقدی" value="شاخص ناقص است" />
                      )}
                    </>
                  )}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="ارزش روز کل مهریه" value={`${fmtMoney(calc.total)} ${u}`} strong />
                </div>
                <Notice accent={ACCENT}>
                  قیمت روز سکه و شاخص‌ها را شما وارد می‌کنید؛ این نتیجه برآوردی است و رقم قطعی را دادگاه تعیین می‌کند.
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
