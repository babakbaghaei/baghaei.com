'use client';

/**
 * رانر عمومی تست‌های شخصیت‌شناسی (R7).
 * هر تست را از روی قرارداد PersonalityTest رندر می‌کند: صفحهٔ معرفی → پرسش‌ها →
 * نتیجه. سه حالت نمره‌دهی (axes / top1 / profile) را پشتیبانی می‌کند.
 */

import React, { useMemo, useState } from 'react';
import {
  Brain,
  Puzzle,
  Compass,
  Briefcase,
  GraduationCap,
  Heart,
  Smile,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

/**
 * نگاشت اسلاگ هر تست → آیکن. آیکن نمی‌تواند از کامپوننت سرور به کلاینت پاس داده
 * شود (تابع است)، پس همین‌جا در کلاینت تعیین می‌شود.
 */
const ICONS: Record<string, LucideIcon> = {
  mbti: Puzzle,
  'big-five': Brain,
  enneagram: Compass,
  disc: Briefcase,
  holland: GraduationCap,
  'zaban-eshgh': Heart,
  eq: Smile,
};
import {
  ToolShell,
  Panel,
  ShareButton,
  useShareResult,
  faNum,
  motion,
  AnimatePresence,
} from '@/components/tools/shell';
import { getPersonalityTest } from '@/lib/data/personality';
import type { PersonalityTest, PResult } from '@/lib/data/personality/types';

type Phase = 'intro' | 'quiz' | 'result';

/** درصد را به بازهٔ ۰..۱۰۰ محدود می‌کند. */
const clampPct = (n: number) => Math.max(0, Math.min(100, n));

export default function PersonalityRunner({
  slug,
  test: testProp,
}: {
  slug?: string;
  test?: PersonalityTest;
}) {
  const test = testProp ?? (slug ? getPersonalityTest(slug) : undefined);
  const icon: LucideIcon = ICONS[test?.slug ?? slug ?? ''] ?? Brain;
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  // answers: questionId → likert value (۱..۵) یا index گزینه (choice)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { share, copied } = useShareResult();

  const accent = test?.accent ?? '139, 92, 246';

  const answeredCount = test ? test.questions.filter((q) => answers[q.id] != null).length : 0;
  const progress = test && test.questions.length ? (answeredCount / test.questions.length) * 100 : 0;

  /* ───────── scoring ───────── */
  const outcome = useMemo(() => {
    if (!test) return null;
    const scores: Record<string, number> = {};
    test.dimensions.forEach((d) => (scores[d.key] = 0));

    for (const q of test.questions) {
      const a = answers[q.id];
      if (a == null) continue;
      if (test.scoring === 'likert') {
        const v = q.reverse ? 6 - a : a; // a در بازهٔ ۱..۵
        if (q.dimension && scores[q.dimension] != null) scores[q.dimension] += v;
      } else {
        // choice: a = index گزینهٔ انتخابی
        const opt = q.options?.[a];
        if (opt)
          for (const [k, val] of Object.entries(opt.scores)) {
            if (scores[k] != null) scores[k] += val;
          }
      }
    }

    // درصد هر بُعد
    const pct: Record<string, number> = {};
    if (test.scoring === 'likert') {
      for (const d of test.dimensions) {
        const qs = test.questions.filter((q) => q.dimension === d.key).length;
        if (!qs) {
          pct[d.key] = 0;
          continue;
        }
        const min = qs * 1;
        const max = qs * 5;
        pct[d.key] = clampPct(((scores[d.key] - min) / (max - min)) * 100);
      }
    } else {
      const total = Object.values(scores).reduce((s, n) => s + n, 0) || 1;
      for (const d of test.dimensions) pct[d.key] = clampPct((scores[d.key] / total) * 100);
    }

    // رتبه‌بندی ابعاد بر اساس امتیاز خام
    const ranked = [...test.dimensions].sort((a, b) => scores[b.key] - scores[a.key]);

    let resultKey = '';
    let code = '';
    if (test.resultType === 'axes' && test.axes) {
      code = test.axes
        .map((ax) => (scores[ax.left] >= scores[ax.right] ? ax.left : ax.right))
        .join('');
      resultKey = code;
    } else if (test.resultType === 'top1') {
      resultKey = ranked[0]?.key ?? '';
    } else if (test.resultType === 'profile' && test.showTopCode) {
      code = ranked.slice(0, test.topCodeLen ?? 3).map((d) => d.key).join('');
    }

    const result: PResult | undefined =
      test.resultType === 'profile' ? undefined : test.results.find((r) => r.key === resultKey);

    return { scores, pct, ranked, resultKey, code, result };
  }, [test, answers]);

  if (!test) {
    return (
      <ToolShell title="تست شخصیت" subtitle="یافت نشد" icon={icon} accent={accent}>
        <Panel>
          <p className="text-muted-foreground font-display text-sm">این تست در دسترس نیست.</p>
        </Panel>
      </ToolShell>
    );
  }

  const reset = () => {
    setAnswers({});
    setCurrent(0);
    setPhase('intro');
  };

  const answer = (val: number) => {
    const q = test.questions[current];
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
    // پیش‌روی خودکار
    setTimeout(() => {
      if (current < test.questions.length - 1) setCurrent((c) => c + 1);
      else setPhase('result');
    }, 160);
  };

  const onShare = () => {
    if (!outcome) return;
    const headline =
      test.resultType === 'profile'
        ? outcome.code
          ? `${outcome.code} — ${outcome.ranked[0]?.label}`
          : `${outcome.ranked[0]?.label}`
        : outcome.result?.title ?? '';
    share({
      title: test.title,
      text: `نتیجهٔ من در «${test.title}»: ${headline}`,
    });
  };

  const likert = test.likertScale ?? [];

  return (
    <ToolShell
      title={test.title}
      subtitle={test.subtitle}
      icon={icon}
      accent={accent}
      info={[
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'این تست چیست؟',
          body: test.intro,
        },
        {
          icon: <ShieldCheck className="w-4 h-4" />,
          title: 'حریم خصوصی',
          body: 'تمام پردازش به‌صورت آفلاین در مرورگر شما انجام می‌شود؛ هیچ پاسخی به سروری ارسال یا ذخیره نمی‌شود.',
        },
      ]}
      disclaimer="این آزمون برای خودشناسی و سرگرمی طراحی شده و جایگزین ارزیابی یا تشخیص بالینی روان‌شناس و روان‌پزشک نیست."
    >
      <AnimatePresence mode="wait">
        {/* ───────── intro ───────── */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Panel className="space-y-7 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl"
                style={{ background: `rgba(${accent}, 0.12)`, color: `rgb(${accent})` }}
              >
                {React.createElement(icon, { className: 'h-8 w-8', strokeWidth: 1.7 })}
              </div>
              <p className="mx-auto max-w-2xl text-sm md:text-base leading-loose text-muted-foreground font-display">
                {test.intro}
              </p>
              <div className="flex items-center justify-center gap-6 text-xs font-display text-muted-foreground/80">
                <span>{faNum(test.questions.length)} پرسش</span>
                <span className="h-3 w-px bg-border" />
                <span>حدود {faNum(test.durationMin ?? 6)} دقیقه</span>
              </div>
              <button
                onClick={() => setPhase('quiz')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
                style={{ background: `rgb(${accent})` }}
              >
                شروع آزمون
                <ChevronLeft className="h-4 w-4" />
              </button>
            </Panel>
          </motion.div>
        )}

        {/* ───────── quiz ───────── */}
        {phase === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Panel className="space-y-8">
              {/* progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-display text-muted-foreground">
                  <span>
                    پرسش {faNum(current + 1)} از {faNum(test.questions.length)}
                  </span>
                  <span>{faNum(Math.round(progress))}٪</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `rgb(${accent})` }}
                    animate={{ width: `${((current + 1) / test.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={test.questions[current].id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <h3 className="text-center text-lg md:text-xl font-black font-display leading-relaxed min-h-[3.5rem] flex items-center justify-center">
                    {test.questions[current].text}
                  </h3>

                  {/* options */}
                  {test.scoring === 'likert' ? (
                    <div className="space-y-2.5">
                      {likert.map((opt) => {
                        const selected = answers[test.questions[current].id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => answer(opt.value)}
                            className="w-full rounded-2xl border px-5 py-4 text-right text-sm font-bold font-display transition-all"
                            style={
                              selected
                                ? {
                                    background: `rgba(${accent}, 0.14)`,
                                    borderColor: `rgb(${accent})`,
                                    color: `rgb(${accent})`,
                                  }
                                : { borderColor: 'hsl(var(--border))' }
                            }
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {test.questions[current].options?.map((opt, idx) => {
                        const selected = answers[test.questions[current].id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => answer(idx)}
                            className="w-full rounded-2xl border px-5 py-4 text-right text-sm font-bold font-display transition-all leading-relaxed"
                            style={
                              selected
                                ? {
                                    background: `rgba(${accent}, 0.14)`,
                                    borderColor: `rgb(${accent})`,
                                    color: `rgb(${accent})`,
                                  }
                                : { borderColor: 'hsl(var(--border))' }
                            }
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* back */}
              {current > 0 && (
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  className="inline-flex items-center gap-1.5 text-xs font-display text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                  پرسش قبلی
                </button>
              )}
            </Panel>
          </motion.div>
        )}

        {/* ───────── result ───────── */}
        {phase === 'result' && outcome && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ResultView test={test} outcome={outcome} accent={accent} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ShareButton accent={accent} copied={copied} onClick={onShare} />
              <button
                onClick={reset}
                className="no-print w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black font-display border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> آزمون دوباره
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolShell>
  );
}

/* ───────── result rendering ───────── */

function Bar({ label, pct, accent }: { label: string; pct: number; accent: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-display">
        <span className="text-foreground font-bold">{label}</span>
        <span className="text-muted-foreground tabular-nums">{faNum(Math.round(pct))}٪</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `rgb(${accent})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function ResultBody({ result }: { result: PResult }) {
  return (
    <div className="space-y-5 text-right">
      <p className="text-sm leading-loose text-muted-foreground font-display">{result.summary}</p>
      {result.strengths && result.strengths.length > 0 && (
        <div>
          <h4 className="text-xs font-black font-display text-foreground mb-2">نقاط قوت</h4>
          <ul className="flex flex-wrap gap-2">
            {result.strengths.map((s, i) => (
              <li
                key={i}
                className="rounded-full bg-muted/60 border border-border px-3 py-1 text-xs font-display text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.growth && result.growth.length > 0 && (
        <div>
          <h4 className="text-xs font-black font-display text-foreground mb-2">زمینه‌های رشد</h4>
          <ul className="space-y-1.5">
            {result.growth.map((g, i) => (
              <li key={i} className="text-xs text-muted-foreground font-display leading-relaxed">
                • {g}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.match && (
        <p className="text-xs text-muted-foreground font-display leading-relaxed rounded-2xl bg-muted/40 border border-border p-4">
          {result.match}
        </p>
      )}
    </div>
  );
}

function ResultView({
  test,
  outcome,
  accent,
}: {
  test: PersonalityTest;
  // ساختار خروجی useMemo بالا؛ با strict:false به‌صورت any پذیرفته می‌شود.
  outcome: any;
  accent: string;
}) {
  const { ranked, pct, result, code, resultKey, scores } = outcome;

  const heroTitle =
    test.resultType === 'profile' ? code || ranked[0]?.label : result?.title ?? resultKey;
  const heroSub =
    test.resultType === 'axes'
      ? code
      : test.resultType === 'top1'
      ? ranked[0]?.label
      : 'نیم‌رخ شما';

  return (
    <Panel className="space-y-8" delay={0.05}>
      <div className="text-center space-y-2">
        <span className="text-xs font-black font-display uppercase tracking-wide text-muted-foreground">
          نتیجهٔ شما
        </span>
        <h2
          className="text-3xl md:text-5xl font-black font-display leading-tight"
          style={{ color: `rgb(${accent})` }}
        >
          {heroTitle}
        </h2>
        {heroSub && heroSub !== heroTitle && (
          <p className="text-sm text-muted-foreground font-display">{heroSub}</p>
        )}
      </div>

      {/* axes → لِم هر محور */}
      {test.resultType === 'axes' && test.axes && (
        <div className="space-y-4">
          {test.axes.map((ax: any) => {
            const leftScore = scores[ax.left] ?? 0;
            const rightScore = scores[ax.right] ?? 0;
            const total = leftScore + rightScore || 1;
            const leftPct = (leftScore / total) * 100;
            const leftWins = leftScore >= rightScore;
            return (
              <div key={ax.left + ax.right} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-display">
                  <span
                    className={leftWins ? 'font-black' : 'text-muted-foreground'}
                    style={leftWins ? { color: `rgb(${accent})` } : undefined}
                  >
                    {ax.leftLabel}
                  </span>
                  <span
                    className={!leftWins ? 'font-black' : 'text-muted-foreground'}
                    style={!leftWins ? { color: `rgb(${accent})` } : undefined}
                  >
                    {ax.rightLabel}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="absolute right-0 top-0 h-full rounded-full"
                    style={{ background: `rgb(${accent})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${leftPct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* top1 / profile → بارها */}
      {(test.resultType === 'top1' || test.resultType === 'profile') && (
        <div className="space-y-3.5">
          {ranked.map((d: any) => (
            <Bar key={d.key} label={d.label} pct={pct[d.key] ?? 0} accent={accent} />
          ))}
        </div>
      )}

      {/* توضیح نتیجهٔ غالب (axes/top1) */}
      {result && <ResultBody result={result} />}

      {/* profile → توضیح هر بُعد */}
      {test.resultType === 'profile' && (
        <div className="space-y-4 pt-2 border-t border-border/60">
          {ranked.map((d: any) => {
            const r = test.results.find((x: PResult) => x.key === d.key);
            if (!r) return null;
            const high = (pct[d.key] ?? 0) >= 50;
            return (
              <div key={d.key} className="text-right">
                <h4 className="text-sm font-black font-display text-foreground mb-1">
                  {r.title}
                  <span className="mr-2 text-xs text-muted-foreground font-bold">
                    {faNum(Math.round(pct[d.key] ?? 0))}٪
                  </span>
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground font-display">
                  {high ? r.summary : r.lowSummary ?? r.summary}
                </p>
                {r.match && (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80 font-display">
                    {r.match}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
