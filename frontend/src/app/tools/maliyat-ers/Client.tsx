'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Landmark, Users, BookOpen, Percent, ShieldCheck } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
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
  fmtPct,
  toWords,
  cleanNum,
  normalizeDigits,
  groupThousands,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';
import {
  INHERITANCE_TAX_ITEMS,
  INHERITANCE_CLASS_FACTOR,
  INHERITANCE_CLASSES,
} from '@/lib/data/legal-rates';

const ACCENT = '79, 70, 229'; // indigo-600

type ClassKey = keyof typeof INHERITANCE_CLASS_FACTOR;

/** ورودی فشردهٔ مبلغ برای هر قلم دارایی. */
function AssetInput({
  label,
  hint,
  ratePct,
  value,
  onChange,
  unit,
}: {
  label: string;
  hint?: string;
  ratePct: string;
  value: string;
  onChange: (v: string) => void;
  unit: Unit;
}) {
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = normalizeDigits(e.target.value).replace(/[^\d]/g, '');
    if (v.length <= 15) onChange(groupThousands(v));
  };
  return (
    <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-foreground font-bold font-display text-sm">{label}</span>
        <span
          className="text-xs font-black font-display shrink-0 px-2 py-0.5 rounded-md"
          style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
        >
          {ratePct}
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground/70 font-display leading-relaxed">{hint}</p>}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={faNum(value)}
          onChange={onInput}
          placeholder="۰"
          dir="ltr"
          aria-label={label}
          className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 pl-12 font-bold font-display text-center focus:border-primary transition-all outline-none text-lg placeholder:text-muted/30"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/40">
          {unitLabel(unit)}
        </span>
      </div>
    </div>
  );
}

export default function MaliyatErs() {
  const [unit, setUnit] = useState<Unit>('toman');
  const [cls, setCls] = useState<ClassKey>('first');
  const [values, setValues] = useState<Record<string, string>>({});

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u = p.get('unit');
    if (u === 'rial' || u === 'toman') setUnit(u);
    const c = p.get('cls');
    if (c === 'first' || c === 'second' || c === 'third') setCls(c);
    const next: Record<string, string> = {};
    for (const item of INHERITANCE_TAX_ITEMS) {
      const v = p.get(item.key);
      if (v && /^\d+$/.test(v)) next[item.key] = Number(v).toLocaleString('en-US');
    }
    if (Object.keys(next).length) setValues(next);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const factor = INHERITANCE_CLASS_FACTOR[cls];

  const calc = useMemo(() => {
    const lines = INHERITANCE_TAX_ITEMS.map((item) => {
      const base = cleanNum(values[item.key] || '');
      const effRate = item.rate * factor;
      const tax = base * effRate;
      return { ...item, base, effRate, tax };
    }).filter((l) => l.base > 0);

    if (lines.length === 0) return null;
    const totalBase = lines.reduce((s, l) => s + l.base, 0);
    const totalTax = lines.reduce((s, l) => s + l.tax, 0);
    return { lines, totalBase, totalTax, netAfterTax: totalBase - totalTax };
  }, [values, factor]);

  const u = unitLabel(unit);

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const onShare = () => {
    if (!calc) return;
    const params: Record<string, string> = { unit, cls };
    for (const l of calc.lines) params[l.key] = String(l.base);
    share({
      title: 'مالیات بر ارث',
      text: `مالیات بر ارث (${INHERITANCE_CLASSES.find((c) => c.key === cls)!.label}): ${fmtMoney(Math.round(calc.totalTax))} ${u}`,
      params,
    });
  };

  return (
    <ToolShell
      title="ماشین‌حساب مالیات بر ارث"
      subtitle="محاسبهٔ مالیات بر ارث بر اساس نوع دارایی و طبقهٔ وراث، طبق مادهٔ ۱۷ قانون مالیات‌های مستقیم"
      icon={Landmark}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'مبنای قانونی (مادهٔ ۱۷)',
          body: 'برای متوفیان از ابتدای ۱۳۹۵ به بعد، مالیات بر ارث به‌صورت مقطوع و بر حسب نوع دارایی و طبقهٔ وراث محاسبه می‌شود و دیگر تصاعدی نیست.',
        },
        {
          icon: <Users className="w-4 h-4" />,
          title: 'طبقات وراث',
          body: 'نرخ پایه برای طبقهٔ اول است؛ طبقهٔ دوم دو برابر و طبقهٔ سوم چهار برابر نرخ طبقهٔ اول مالیات می‌پردازند.',
        },
        {
          icon: <Percent className="w-4 h-4" />,
          title: 'نمونهٔ نرخ‌ها (طبقهٔ اول)',
          body: 'سپردهٔ بانکی ۳٪، سهام بورسی ۰٫۷۵٪، سهام غیربورسی ۶٪، خودرو ۲٪، املاک ۷٫۵٪ (به مأخذ ارزش معاملاتی) و حق واگذاری محل ۳٪.',
        },
        {
          icon: <ShieldCheck className="w-4 h-4" />,
          title: 'معافیت‌ها',
          body: 'اثاث منزل، وجوه بازنشستگی و بیمهٔ عمر، و دارایی شهدا و برخی موارد دیگر از مالیات بر ارث معاف‌اند و در این محاسبه وارد نمی‌شوند.',
        },
      ]}
      disclaimer="این محاسبه راهنماست. مأخذ املاک «ارزش معاملاتی» اعلامی سازمان امور مالیاتی است نه قیمت بازار. ملاک قطعی، گواهی و برگ تشخیص ادارهٔ امور مالیاتی است."
    >
      <TwoPane>
        <Panel className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SelectField
              icon={<Users className="w-4 h-4" />}
              label="طبقهٔ وراث"
              value={cls}
              onChange={(v) => setCls(v as ClassKey)}
            >
              {INHERITANCE_CLASSES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </SelectField>
          </div>

          <Field label="واحد مبالغ" center action={
            <div className="flex bg-muted p-0.5 rounded-lg border border-border">
              {(['toman', 'rial'] as const).map((un) => (
                <button
                  key={un}
                  onClick={() => setUnit(un)}
                  className={`px-3 py-1 rounded-md text-xs font-black transition-all ${
                    unit === un ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {unitLabel(un)}
                </button>
              ))}
            </div>
          }>
            <div className="space-y-3">
              {INHERITANCE_TAX_ITEMS.map((item) => (
                <AssetInput
                  key={item.key}
                  label={item.label}
                  hint={item.hint}
                  ratePct={fmtPct(item.rate * INHERITANCE_CLASS_FACTOR[cls] * 100)}
                  value={values[item.key] || ''}
                  onChange={(v) => set(item.key, v)}
                  unit={unit}
                />
              ))}
            </div>
          </Field>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<Landmark className="w-6 h-6" />}>
                ارزش دست‌کم یکی از دارایی‌های مشمول را وارد کنید تا مالیات بر ارث محاسبه شود.
              </EmptyState>
            ) : (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-7">
                <Headline
                  accent={ACCENT}
                  label="مالیات بر ارث قابل پرداخت"
                  value={fmtMoney(Math.round(calc.totalTax))}
                  suffix={u}
                  sub={`${toWords(Math.round(calc.totalTax))} ${u}`}
                />
                <div className="space-y-2.5">
                  {calc.lines.map((l) => (
                    <Row
                      key={l.key}
                      label={`${l.label} (${fmtPct(l.effRate * 100)})`}
                      value={`${fmtMoney(Math.round(l.tax))} ${u}`}
                    />
                  ))}
                  <div className="h-px bg-border/60 my-1" />
                  <Row label="جمع ارزش دارایی‌ها" value={`${fmtMoney(calc.totalBase)} ${u}`} />
                  <Row label="جمع مالیات" value={`${fmtMoney(Math.round(calc.totalTax))} ${u}`} strong />
                  <Row label="خالص پس از مالیات" value={`${fmtMoney(Math.round(calc.netAfterTax))} ${u}`} />
                </div>
                <Notice accent={ACCENT}>
                  این مالیات بر هر قلم دارایی به‌صورت جداگانه و مقطوع محاسبه می‌شود و هنگام نقل‌و‌انتقال هر دارایی باید پرداخت گردد.
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
