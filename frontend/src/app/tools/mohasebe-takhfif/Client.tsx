'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Percent, Tag, Receipt, PiggyBank, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  Field,
  MoneyField,
  Toggle,
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
  cleanNum,
  normalizeDigits,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '217, 119, 6'; // amber-600 — matches the «کسب‌وکار» / financial accent

/** پارس درصد: ارقام فارسی/عربی → انگلیسی، فقط عدد و اعشار، سپس کلمپ ۰..۱۰۰. */
const parsePct = (s: string): number | null => {
  const v = normalizeDigits(s).replace(/[^\d.]/g, '');
  if (v === '' || v === '.') return null;
  const n = Number(v);
  if (!isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
};

export default function MohasebeTakhfif() {
  const [price, setPrice] = useState(''); // grouped string from MoneyField
  const [unit, setUnit] = useState<Unit>('toman');
  const [discount, setDiscount] = useState('');
  const [vatOn, setVatOn] = useState(false);
  const [vat, setVat] = useState('10'); // default VAT 10%
  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pr = p.get('price');
    if (pr) setPrice(faNum(pr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')));
    const u = p.get('unit');
    if (u === 'toman' || u === 'rial') setUnit(u);
    const d = p.get('discount');
    if (d) setDiscount(d);
    const vt = p.get('vat');
    if (vt) {
      setVat(vt);
      setVatOn(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const basePrice = cleanNum(price); // numeric toman/rial
  const discPct = parsePct(discount);
  const vatPct = vatOn ? parsePct(vat) : 0;

  const calc = useMemo(() => {
    if (basePrice <= 0 || discPct === null) return null;

    const saved = (basePrice * discPct) / 100;
    const afterDiscount = basePrice - saved;
    const vatAmount = vatPct ? (afterDiscount * vatPct) / 100 : 0;
    const final = afterDiscount + vatAmount;
    const u = unitLabel(unit);

    const rows: { label: string; value: string; strong?: boolean }[] = [
      { label: 'قیمت اولیه', value: `${fmtMoney(basePrice)} ${u}` },
      { label: `تخفیف (${faNum(String(discPct))}٪)`, value: `−${fmtMoney(saved)} ${u}` },
      { label: 'مبلغ پس از تخفیف', value: `${fmtMoney(afterDiscount)} ${u}` },
    ];
    if (vatPct) {
      rows.push({
        label: `مالیات بر ارزش‌افزوده (${faNum(String(vatPct))}٪)`,
        value: `+${fmtMoney(vatAmount)} ${u}`,
      });
    }
    rows.push({ label: 'قیمت نهایی', value: `${fmtMoney(final)} ${u}`, strong: true });

    const sentence = vatPct
      ? `با ${faNum(String(discPct))}٪ تخفیف و ${faNum(String(vatPct))}٪ مالیات، قیمت نهایی ${fmtMoney(final)} ${u} می‌شود (${fmtMoney(saved)} ${u} صرفه‌جویی).`
      : `با ${faNum(String(discPct))}٪ تخفیف، ${fmtMoney(saved)} ${u} صرفه‌جویی می‌کنید و قیمت نهایی ${fmtMoney(final)} ${u} است.`;

    return {
      headline: `${fmtMoney(final)}`,
      suffix: u,
      saved,
      sentence,
      rows,
    };
  }, [basePrice, discPct, vatPct, unit]);

  const onShare = () => {
    if (!calc) return;
    const params: Record<string, string> = {
      price: String(basePrice),
      unit,
      discount: String(discPct),
    };
    if (vatPct) params.vat = String(vatPct);
    share({ title: 'محاسبه‌گر تخفیف', text: calc.sentence, params });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="محاسبه‌گر تخفیف"
      subtitle="مبلغ پس از تخفیف، میزان صرفه‌جویی و قیمت نهایی با مالیات بر ارزش‌افزوده"
      icon={Percent}
      accent={ACCENT}
      info={[
        {
          icon: <Tag className="w-4 h-4" />,
          title: 'مبلغ پس از تخفیف',
          body: 'قیمت کالا و درصد تخفیف را وارد کنید تا مبلغ کسرشده و قیمت کاهش‌یافته بی‌درنگ محاسبه شود؛ مناسب فروشگاه‌ها، حراج‌ها و سبد خرید.',
        },
        {
          icon: <PiggyBank className="w-4 h-4" />,
          title: 'میزان صرفه‌جویی',
          body: 'مبلغ صرفه‌جویی همان عددی است که با اعمال تخفیف از قیمت اولیه کم می‌شود؛ این رقم به‌صورت جداگانه در نتیجه نمایش داده می‌شود.',
        },
        {
          icon: <Receipt className="w-4 h-4" />,
          title: 'مالیات بر ارزش‌افزوده',
          body: 'با فعال‌کردن مالیات، درصد آن (به‌صورت پیش‌فرض ۱۰٪) روی «مبلغ پس از تخفیف» اعمال و به قیمت نهایی افزوده می‌شود.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'درصد تخفیف و مالیات بین ۰ تا ۱۰۰ پذیرفته می‌شود و ارقام فارسی نیز قابل‌ورود است. تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-7">
          <MoneyField
            label="قیمت اولیه"
            amount={price}
            setAmount={setPrice}
            unit={unit}
            setUnit={setUnit}
          />

          <Field label="درصد تخفیف" hint="مثلاً ۲۰">
            <input
              type="text"
              inputMode="decimal"
              value={faNum(discount)}
              onChange={(e) => {
                const v = normalizeDigits(e.target.value).replace(/[^\d.]/g, '');
                setDiscount(v !== '' && v !== '.' && Number(v) > 100 ? '100' : v);
              }}
              dir="ltr"
              aria-label="درصد تخفیف"
              className={inputClass}
            />
          </Field>

          <Toggle
            label="افزودن مالیات بر ارزش‌افزوده"
            checked={vatOn}
            onChange={setVatOn}
            hint="مالیات روی مبلغ پس از تخفیف اعمال می‌شود"
          />

          {vatOn && (
            <Field label="درصد مالیات" hint="پیش‌فرض ۱۰">
              <input
                type="text"
                inputMode="decimal"
                value={faNum(vat)}
                onChange={(e) => setVat(normalizeDigits(e.target.value).replace(/[^\d.]/g, ''))}
                dir="ltr"
                aria-label="درصد مالیات"
                className={inputClass}
              />
            </Field>
          )}
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Percent className="w-6 h-6" />}>
                قیمت اولیه و درصد تخفیف را وارد کنید.
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline
                  accent={ACCENT}
                  label="قیمت نهایی"
                  value={calc.headline}
                  suffix={calc.suffix}
                  sub={`${fmtMoney(calc.saved)} ${calc.suffix} صرفه‌جویی`}
                />
                <div className="space-y-2.5">
                  {calc.rows.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  درصد تخفیف و مالیات به‌صورت زنده اعمال می‌شوند؛ ارقام فارسی نیز پذیرفته می‌شوند.
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
