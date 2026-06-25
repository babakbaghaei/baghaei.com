'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, BookOpen, Info } from 'lucide-react';
import {
  ToolShell,
  TwoPane,
  Panel,
  VerdictPanel,
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
  fmtNum,
  normalizeDigits,
} from '@/components/tools/shell';

const ACCENT = '37, 99, 235'; // blue-600 — must equal the `accent` in tools.ts

interface Course {
  name: string;
  grade: string; // 0–20
  units: string; // واحد/ضریب
}

const blankCourse = (): Course => ({ name: '', grade: '', units: '' });

const parseNum = (s: string) => {
  const v = normalizeDigits(s).replace(/[^\d.]/g, '');
  if (v === '' || v === '.') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function Moadel() {
  const [courses, setCourses] = useState<Course[]>([blankCourse(), blankCourse(), blankCourse()]);
  const { share, copied } = useShareResult();

  // hydrate from share URL: ?c=name|grade|units;name|grade|units
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const raw = p.get('c');
    if (!raw) return;
    const parsed = raw
      .split(';')
      .map((seg) => {
        const [name = '', grade = '', units = ''] = seg.split('|');
        return { name: decodeURIComponent(name), grade, units };
      })
      .filter((c) => c.name || c.grade || c.units);
    if (parsed.length) setCourses(parsed);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setRow = (i: number, patch: Partial<Course>) =>
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const addRow = () => setCourses((prev) => [...prev, blankCourse()]);

  const removeRow = (i: number) =>
    setCourses((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const calc = useMemo(() => {
    const valid = courses
      .map((c) => ({ name: c.name.trim(), grade: parseNum(c.grade), units: parseNum(c.units) }))
      .filter((c) => c.grade !== null && c.units !== null && (c.units as number) > 0) as {
      name: string;
      grade: number;
      units: number;
    }[];

    if (valid.length === 0) return null;
    if (valid.some((c) => !Number.isFinite(c.grade) || c.grade < 0 || c.grade > 20))
      return { error: 'نمرهٔ هر درس باید بین ۰ تا ۲۰ باشد.' };

    const totalUnits = valid.reduce((s, c) => s + c.units, 0);
    if (totalUnits === 0) return { error: 'مجموع واحدها نمی‌تواند صفر باشد.' };

    const totalWeighted = valid.reduce((s, c) => s + c.grade * c.units, 0);
    const average = totalWeighted / totalUnits;

    return {
      average,
      headline: fmtNum(average, 2),
      sentence: `معدل وزنی ${faNum(String(valid.length))} درس با مجموع ${fmtNum(totalUnits)} واحد برابر است با ${fmtNum(average, 2)} از ۲۰`,
      rows: [
        { label: 'تعداد دروس', value: faNum(String(valid.length)) },
        { label: 'مجموع واحدها', value: fmtNum(totalUnits) },
        { label: 'مجموع وزنی نمرات', value: fmtNum(totalWeighted, 2) },
        { label: 'معدل', value: `${fmtNum(average, 2)} از ۲۰`, strong: true },
      ],
      params: {
        c: valid.map((c) => `${encodeURIComponent(c.name)}|${c.grade}|${c.units}`).join(';'),
      },
    };
  }, [courses]);

  const onShare = () => {
    if (!calc || calc.error) return;
    share({
      title: 'محاسبه‌گر معدل',
      text: calc.sentence ?? '',
      params: calc.params,
    });
  };

  const inputClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-lg text-center focus:border-primary outline-none transition-all';

  const nameClass =
    'w-full bg-background border-2 border-border rounded-xl py-3 px-4 font-display text-sm focus:border-primary outline-none transition-all';

  return (
    <ToolShell
      title="محاسبه‌گر معدل"
      subtitle="محاسبهٔ معدل وزنی بر اساس نمرات و واحد/ضریب هر درس"
      icon={GraduationCap}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'معدل وزنی چگونه محاسبه می‌شود؟',
          body: 'معدل وزنی از تقسیم مجموع حاصل‌ضرب نمرهٔ هر درس در واحد آن، بر مجموع کل واحدها به دست می‌آید. دروس با واحد بیشتر، اثر بیشتری بر معدل دارند.',
        },
        {
          icon: <Info className="w-4 h-4" />,
          title: 'نکته',
          body: 'نمرهٔ هر درس بین ۰ تا ۲۰ و واحد آن باید بزرگ‌تر از صفر باشد. ارقام فارسی نیز پذیرفته می‌شوند و تمام محاسبات آفلاین و بدون ارسال داده انجام می‌شود.',
        },
      ]}
    >
      <TwoPane>
        <Panel className="space-y-6">
          <div className="space-y-4">
            {courses.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-muted/20 p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wide">
                    درس {faNum(String(i + 1))}
                  </span>
                  <button
                    onClick={() => removeRow(i)}
                    disabled={courses.length <= 1}
                    aria-label={`حذف درس ${faNum(String(i + 1))}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Field label="نام درس" hint="اختیاری">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => setRow(i, { name: e.target.value })}
                    aria-label={`نام درس ${faNum(String(i + 1))}`}
                    className={nameClass}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="نمره" hint="۰ تا ۲۰">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={faNum(c.grade)}
                      onChange={(e) =>
                        setRow(i, { grade: normalizeDigits(e.target.value).replace(/[^\d.]/g, '') })
                      }
                      dir="ltr"
                      aria-label={`نمرهٔ درس ${faNum(String(i + 1))}`}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="واحد / ضریب" hint="مثلاً ۳">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={faNum(c.units)}
                      onChange={(e) =>
                        setRow(i, { units: normalizeDigits(e.target.value).replace(/[^\d.]/g, '') })
                      }
                      dir="ltr"
                      aria-label={`واحد درس ${faNum(String(i + 1))}`}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display transition-all"
            style={{
              background: `rgba(${ACCENT}, 0.1)`,
              color: `rgb(${ACCENT})`,
              border: `1px solid rgba(${ACCENT}, 0.25)`,
            }}
          >
            <Plus className="w-4 h-4" /> افزودن درس
          </button>
        </Panel>

        <VerdictPanel accent={ACCENT}>
          <AnimatePresence mode="wait">
            {!calc ? (
              <EmptyState accent={ACCENT} icon={<GraduationCap className="w-6 h-6" />}>
                نمره و واحد دست‌کم یک درس را وارد کنید.
              </EmptyState>
            ) : calc.error ? (
              <motion.div
                key="e"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[200px] flex items-center justify-center"
              >
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {calc.error}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-7"
              >
                <Headline accent={ACCENT} label="معدل وزنی" value={calc.headline ?? ''} sub={calc.sentence} />
                <div className="space-y-2.5">
                  {calc.rows?.map((r, i) => (
                    <Row key={i} label={r.label} value={r.value} strong={r.strong} />
                  ))}
                </div>
                <Notice accent={ACCENT}>
                  فقط دروسی با نمرهٔ معتبر و واحد بزرگ‌تر از صفر در معدل لحاظ می‌شوند؛ نتیجه به‌صورت زنده محاسبه می‌شود.
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
