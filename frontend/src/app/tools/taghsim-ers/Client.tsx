'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Users, Heart, BookOpen, Info, Scale } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
  MoneyField,
  SelectField,
  Toggle,
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
  fmtPct,
  toWords,
  cleanNum,
  unitLabel,
  type Unit,
} from '@/components/tools/shell';

const ACCENT = '5, 150, 105'; // emerald-600

type Spouse = 'none' | 'husband' | 'wife';

interface Heir {
  key: string;
  label: string;
  frac: number; // سهم کل این گروه از یک واحد
  count?: number; // تعداد افراد گروه
}

interface ShareResult {
  heirs: Heir[];
  radd: boolean; // رد مازاد
  aul: boolean; // ورود نقص (شبه‌عول امامی)
  note?: string;
}

/** تبدیل کسر اعشاری به نسبت ساده (مخرج تا ۲۴) برای نمایش «یک‌هشتم» و مانند آن. */
function asFraction(x: number): string | null {
  for (let b = 2; b <= 24; b++) {
    const a = Math.round(x * b);
    if (a > 0 && Math.abs(x - a / b) < 1e-6) return `${faNum(a)}/${faNum(b)}`;
  }
  return null;
}

/**
 * محاسبهٔ سهم‌الارث وراث طبقهٔ اول (همسر، فرزندان، پدر، مادر) بر پایهٔ فقه امامی
 * و قانون مدنی ایران: فروض، رد مازاد و ورود نقص بر دختران (نفی عول).
 */
function computeShares(opts: {
  spouse: Spouse;
  wives: number;
  sons: number;
  daughters: number;
  father: boolean;
  mother: boolean;
}): ShareResult {
  const { spouse, wives, sons, daughters, father, mother } = opts;
  const desc = sons + daughters > 0;

  let spouseFrac = 0;
  if (spouse === 'husband') spouseFrac = desc ? 1 / 4 : 1 / 2;
  if (spouse === 'wife') spouseFrac = desc ? 1 / 8 : 1 / 4;

  const heirs: Heir[] = [];
  let radd = false;
  let aul = false;
  let note: string | undefined;

  if (spouseFrac > 0) {
    heirs.push({
      key: 'spouse',
      label: spouse === 'husband' ? 'زوج (شوهر)' : wives > 1 ? 'زوجه‌ها' : 'زوجه (همسر)',
      frac: spouseFrac,
      count: spouse === 'wife' ? wives : 1,
    });
  }

  if (sons > 0) {
    // فرزندان به قرابت باقیمانده را می‌برند؛ پدر و مادر فرض ۱/۶.
    let pf = 0;
    if (father) {
      heirs.push({ key: 'father', label: 'پدر', frac: 1 / 6 });
      pf += 1 / 6;
    }
    if (mother) {
      heirs.push({ key: 'mother', label: 'مادر', frac: 1 / 6 });
      pf += 1 / 6;
    }
    const residue = 1 - spouseFrac - pf;
    const units = sons * 2 + daughters; // پسر دو برابر دختر
    const perUnit = residue / units;
    heirs.push({ key: 'sons', label: 'پسران', frac: perUnit * 2 * sons, count: sons });
    if (daughters > 0)
      heirs.push({ key: 'daughters', label: 'دختران', frac: perUnit * daughters, count: daughters });
  } else if (daughters > 0) {
    // فقط دختر: فرض ۱/۲ (یک نفر) یا ۲/۳ (دو نفر و بیشتر) + رد یا ورود نقص.
    const fatherFrac = father ? 1 / 6 : 0;
    const motherFrac = mother ? 1 / 6 : 0;
    const dFraz = daughters === 1 ? 1 / 2 : 2 / 3;
    const sumFarz = spouseFrac + fatherFrac + motherFrac + dFraz;
    let residue = 1 - sumFarz;
    if (Math.abs(residue) < 1e-9) residue = 0;

    if (residue >= 0) {
      // رد مازاد به نسبت فرض بین پدر، مادر و دختران (زوج/زوجه رد نمی‌برند).
      const base = fatherFrac + motherFrac + dFraz;
      if (residue > 0) radd = true;
      if (father)
        heirs.push({ key: 'father', label: 'پدر', frac: fatherFrac + (residue * fatherFrac) / base });
      if (mother)
        heirs.push({ key: 'mother', label: 'مادر', frac: motherFrac + (residue * motherFrac) / base });
      heirs.push({
        key: 'daughters',
        label: daughters === 1 ? 'دختر' : 'دختران',
        frac: dFraz + (residue * dFraz) / base,
        count: daughters,
      });
    } else {
      // ورود نقص بر دختران (در فقه امامی عول پذیرفته نیست).
      aul = true;
      if (father) heirs.push({ key: 'father', label: 'پدر', frac: fatherFrac });
      if (mother) heirs.push({ key: 'mother', label: 'مادر', frac: motherFrac });
      heirs.push({
        key: 'daughters',
        label: daughters === 1 ? 'دختر' : 'دختران',
        frac: Math.max(0, dFraz + residue),
        count: daughters,
      });
    }
  } else {
    // بدون فرزند.
    if (!father && !mother && spouseFrac === 0) {
      return { heirs: [], radd: false, aul: false, note: 'هیچ‌یک از وراث طبقهٔ اول وارد نشده است.' };
    }
    const motherFrac = mother ? 1 / 3 : 0;
    if (father) {
      // پدر در نبود فرزند به قرابت ارث می‌برد (باقیمانده).
      if (mother) heirs.push({ key: 'mother', label: 'مادر', frac: motherFrac });
      heirs.push({ key: 'father', label: 'پدر', frac: 1 - spouseFrac - motherFrac });
    } else if (mother) {
      // مادر فرض ۱/۳ و رد باقیمانده.
      const motherActual = 1 - spouseFrac;
      if (motherActual > motherFrac + 1e-9) radd = true;
      heirs.push({ key: 'mother', label: 'مادر', frac: motherActual });
    } else if (spouse === 'husband') {
      // زوج تنها: در نبود سایر وراث، باقیمانده نیز به او رد می‌شود.
      heirs[0].frac = 1;
      radd = true;
      note = 'در نبود سایر وراث، تمام ترکه به زوج می‌رسد (فرض ۱/۲ + رد).';
    } else {
      // زوجهٔ تنها: بر پایهٔ اصلاحیهٔ ۱۳۸۷ مادهٔ ۹۴۹ ق.م، در نبود هر وارث دیگر مازاد بر فرض ۱/۴ نیز به زوجه رد می‌شود.
      heirs[0].frac = 1;
      radd = true;
      note = 'در نبود سایر وراث، تمام ترکه به زوجه می‌رسد (فرض ۱/۴ + رد)؛ بر پایهٔ اصلاحیهٔ سال ۱۳۸۷ مادهٔ ۹۴۹ قانون مدنی.';
    }
  }

  return { heirs, radd, aul, note };
}

export default function TaghsimErs() {
  const [estate, setEstate] = useState('');
  const [unit, setUnit] = useState<Unit>('toman');
  const [spouse, setSpouse] = useState<Spouse>('wife');
  const [wives, setWives] = useState(1);
  const [sons, setSons] = useState(1);
  const [daughters, setDaughters] = useState(1);
  const [father, setFather] = useState(true);
  const [mother, setMother] = useState(true);

  const { share, copied } = useShareResult();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const e = p.get('estate');
    if (e && /^\d+$/.test(e)) setEstate(Number(e).toLocaleString('en-US'));
    const un = p.get('unit');
    if (un === 'rial' || un === 'toman') setUnit(un);
    const sp = p.get('spouse');
    if (sp === 'none' || sp === 'husband' || sp === 'wife') setSpouse(sp);
    const w = Number(p.get('wives'));
    if (w >= 1) setWives(w);
    const s = p.get('sons');
    if (s != null && /^\d+$/.test(s)) setSons(Number(s));
    const d = p.get('daughters');
    if (d != null && /^\d+$/.test(d)) setDaughters(Number(d));
    if (p.get('father') === '0') setFather(false);
    if (p.get('mother') === '0') setMother(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const estateVal = cleanNum(estate);

  const result = useMemo(
    () => computeShares({ spouse, wives, sons, daughters, father, mother }),
    [spouse, wives, sons, daughters, father, mother],
  );

  const hasHeirs = result.heirs.length > 0;
  const u = unitLabel(unit);

  const onShare = () => {
    if (!hasHeirs) return;
    const lines = result.heirs
      .map((h) => `${h.label}: ${fmtPct(h.frac * 100)}`)
      .join('، ');
    share({
      title: 'تقسیم ارث (سهم‌الارث)',
      text: `سهم‌الارث وراث طبقهٔ اول — ${lines}`,
      params: {
        estate: String(estateVal),
        unit,
        spouse,
        wives: String(wives),
        sons: String(sons),
        daughters: String(daughters),
        father: father ? '1' : '0',
        mother: mother ? '1' : '0',
      },
    });
  };

  return (
    <ToolShell
      title="ماشین‌حساب تقسیم ارث"
      subtitle="محاسبهٔ سهم‌الارث وراث طبقهٔ اول (همسر، فرزندان، پدر و مادر) بر پایهٔ فقه امامی و قانون مدنی"
      icon={Users}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'فروض شش‌گانه',
          body: 'سهم زوج با فرزند ۱/۴ و بدون فرزند ۱/۲؛ زوجه با فرزند ۱/۸ و بدون فرزند ۱/۴؛ هر یک از پدر و مادر با وجود فرزند ۱/۶؛ مادر در نبود فرزند ۱/۳. این کسرها «فرض» نامیده می‌شوند (مواد ۸۹۱ تا ۹۰۵ قانون مدنی).',
        },
        {
          icon: <Scale className="w-4 h-4" />,
          title: 'پسر دو برابر دختر',
          body: 'هرگاه وارثان از طبقهٔ اول هم پسر و هم دختر باشند، باقیماندهٔ ترکه پس از فرضِ همسر و والدین، میان فرزندان به نسبت «پسر دو برابر دختر» تقسیم می‌شود (مادهٔ ۹۰۷ ق.م).',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'رد و نفی عول',
          body: 'اگر پس از پرداخت فرض‌ها مازادی بماند، به‌جز زوج و زوجه، به نسبت فرض به سایر وراث «رد» می‌شود. در فقه امامی «عول» پذیرفته نیست و در صورت کمبود، نقص بر دختران وارد می‌شود.',
        },
        {
          icon: <Users className="w-4 h-4" />,
          title: 'دامنهٔ این ابزار',
          body: 'این محاسبه‌گر مخصوص طبقهٔ اول است و موارد ویژه مانند حاجب بودن برادران برای مادر، نوه‌ها (به نمایندگی)، حبوهٔ پسر بزرگ‌تر و وصیت تا ثلث را لحاظ نمی‌کند.',
        },
      ]}
      disclaimer="این محاسبه راهنماست و جایگزین گواهی انحصار وراثت و نظر دادگاه نیست. دیون متوفّی، هزینهٔ کفن‌و‌دفن، وصیت تا ثلث و حبوه باید پیش از تقسیم لحاظ شوند."
    >
      <TwoPane>
        <Panel className="space-y-6">
          <MoneyField
            label="ارزش کل ترکه (اختیاری)"
            amount={estate}
            setAmount={setEstate}
            unit={unit}
            setUnit={setUnit}
          />

          <SelectField
            icon={<Heart className="w-4 h-4" />}
            label="همسر متوفّی"
            value={spouse}
            onChange={(v) => setSpouse(v as Spouse)}
          >
            <option value="none">همسری در قید حیات نیست</option>
            <option value="wife">زوجه (متوفّی مرد است)</option>
            <option value="husband">زوج (متوفّی زن است)</option>
          </SelectField>

          {spouse === 'wife' && (
            <Stepper
              label="تعداد زوجه‌ها"
              hint="سهم زوجه میان همسران به‌طور مساوی تقسیم می‌شود"
              value={wives}
              onChange={setWives}
              min={1}
              max={4}
            />
          )}

          <Stepper label="تعداد پسران" value={sons} onChange={setSons} min={0} max={30} />
          <Stepper label="تعداد دختران" value={daughters} onChange={setDaughters} min={0} max={30} />

          <Toggle label="پدر در قید حیات است" checked={father} onChange={setFather} />
          <Toggle label="مادر در قید حیات است" checked={mother} onChange={setMother} />
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!hasHeirs ? (
              <EmptyState accent={ACCENT} icon={<Users className="w-6 h-6" />}>
                {result.note ?? 'دست‌کم یکی از وراث طبقهٔ اول را مشخص کنید تا سهم‌الارث محاسبه شود.'}
              </EmptyState>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                {estateVal > 0 ? (
                  <Headline
                    accent={ACCENT}
                    label="ارزش کل ترکه"
                    value={fmtMoney(estateVal)}
                    suffix={u}
                    sub={`${toWords(estateVal)} ${u}`}
                  />
                ) : (
                  <Headline accent={ACCENT} label="تقسیم سهم‌الارث" value="طبقهٔ اول" />
                )}

                <div className="space-y-3">
                  {result.heirs.map((h) => {
                    const fracStr = asFraction(h.frac);
                    const amount = estateVal > 0 ? estateVal * h.frac : 0;
                    const each = h.count && h.count > 1 ? h.frac / h.count : null;
                    return (
                      <div
                        key={h.key}
                        className="rounded-2xl border border-border bg-background/40 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-display font-black text-sm text-foreground">
                            {h.label}
                            {h.count && h.count > 1 ? ` (${faNum(h.count)} نفر)` : ''}
                          </span>
                          <span
                            className="font-display font-black text-sm"
                            style={{ color: `rgb(${ACCENT})` }}
                          >
                            {fracStr ? fracStr : fmtPct(h.frac * 100)}
                          </span>
                        </div>
                        {estateVal > 0 && (
                          <Row label="سهم این گروه" value={`${fmtMoney(amount)} ${u}`} />
                        )}
                        {each != null && (
                          <Row
                            label="سهم هر نفر"
                            value={
                              estateVal > 0
                                ? `${fmtMoney(estateVal * each)} ${u}`
                                : asFraction(each) ?? fmtPct(each * 100)
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {result.radd && (
                  <Notice accent={ACCENT}>
                    مازاد ترکه به‌صورت «رد» میان وراث (به‌جز زوج و زوجه) به نسبت فرض تقسیم شده است.
                  </Notice>
                )}
                {result.aul && (
                  <Notice accent={ACCENT}>
                    مجموع فروض از کل ترکه بیشتر شد؛ بر پایهٔ فقه امامی، نقص بر سهم دختران وارد شده است (عول اعمال نمی‌شود).
                  </Notice>
                )}
                {result.note && <Notice accent={ACCENT}>{result.note}</Notice>}

                <ShareButton accent={ACCENT} copied={copied} onClick={onShare} />
              </motion.div>
            )}
          </AnimatePresence>
        </VerdictPanel>
      </TwoPane>
    </ToolShell>
  );
}
