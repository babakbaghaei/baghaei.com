'use client';

import React, { useState } from 'react';
import { Hand, RotateCcw, Trophy } from 'lucide-react';
import {
  ToolShell,
  Panel,
  AnimatePresence,
  motion,
  faNum,
} from '@/components/tools/shell';

const ACCENT = '244, 63, 94'; // rose

type Move = 'سنگ' | 'کاغذ' | 'قیچی';
const MOVES: Move[] = ['سنگ', 'کاغذ', 'قیچی'];
const EMOJI: Record<Move, string> = { سنگ: '✊', کاغذ: '✋', قیچی: '✌️' };

// چه چیزی چه چیزی را می‌برد.
const BEATS: Record<Move, Move> = { سنگ: 'قیچی', کاغذ: 'سنگ', قیچی: 'کاغذ' };

type Outcome = 'برد' | 'باخت' | 'مساوی';

export default function SangKaghazGheychi() {
  const [you, setYou] = useState<Move | null>(null);
  const [cpu, setCpu] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [score, setScore] = useState({ برد: 0, باخت: 0, مساوی: 0 });

  const play = (move: Move) => {
    const c = MOVES[Math.floor(Math.random() * 3)];
    let res: Outcome;
    if (move === c) res = 'مساوی';
    else if (BEATS[move] === c) res = 'برد';
    else res = 'باخت';
    setYou(move);
    setCpu(c);
    setOutcome(res);
    setScore((s) => ({ ...s, [res]: s[res] + 1 }));
  };

  const reset = () => {
    setYou(null);
    setCpu(null);
    setOutcome(null);
    setScore({ برد: 0, باخت: 0, مساوی: 0 });
  };

  const outcomeColor =
    outcome === 'برد' ? '5, 150, 105' : outcome === 'باخت' ? '244, 63, 94' : '120, 120, 130';

  return (
    <ToolShell
      title="سنگ کاغذ قیچی"
      subtitle="بازی در برابر رایانه، با امتیازشماری و نتیجهٔ آنی"
      icon={Hand}
      accent={ACCENT}
      info={[
        {
          icon: <Trophy className="w-4 h-4" />,
          title: 'قوانین بازی',
          body: 'سنگ، قیچی را می‌شکند؛ قیچی، کاغذ را می‌برد؛ و کاغذ، سنگ را می‌پوشاند. انتخاب رایانه کاملاً تصادفی است و امتیاز برد، باخت و مساوی شمارش می‌شود.',
        },
      ]}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 py-4">
        {/* انتخاب بازیکن */}
        <div className="flex items-center justify-center gap-3">
          {MOVES.map((m) => (
            <button
              key={m}
              onClick={() => play(m)}
              aria-label={m}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-card text-3xl shadow-sm transition-all hover:scale-105 active:scale-95"
              style={{ borderColor: you === m ? `rgb(${ACCENT})` : 'rgba(120,120,130,0.25)' }}
            >
              <span>{EMOJI[m]}</span>
              <span className="font-display text-[11px] font-black text-muted-foreground">{m}</span>
            </button>
          ))}
        </div>

        {/* نتیجهٔ دور */}
        <AnimatePresence mode="wait">
          {outcome && you && cpu && (
            <motion.div
              key={`${you}-${cpu}-${score.برد + score.باخت + score.مساوی}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Panel className="w-full">
                <div className="flex items-center justify-around text-center">
                  <div className="space-y-1">
                    <p className="text-xs font-display text-muted-foreground">شما</p>
                    <p className="text-4xl">{EMOJI[you]}</p>
                  </div>
                  <p className="font-display text-sm font-black text-muted-foreground">در برابر</p>
                  <div className="space-y-1">
                    <p className="text-xs font-display text-muted-foreground">رایانه</p>
                    <p className="text-4xl">{EMOJI[cpu]}</p>
                  </div>
                </div>
                <p
                  className="mt-5 text-center font-display text-3xl font-black"
                  style={{ color: `rgb(${outcomeColor})` }}
                >
                  {outcome === 'برد' ? 'بردید!' : outcome === 'باخت' ? 'باختید' : 'مساوی'}
                </p>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* امتیاز */}
        <div className="flex w-full items-center justify-center gap-8 rounded-2xl border border-border bg-card/40 p-4 font-display">
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: 'rgb(5,150,105)' }}>{faNum(String(score.برد))}</p>
            <p className="text-xs text-muted-foreground">برد</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: `rgb(${ACCENT})` }}>{faNum(String(score.باخت))}</p>
            <p className="text-xs text-muted-foreground">باخت</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{faNum(String(score.مساوی))}</p>
            <p className="text-xs text-muted-foreground">مساوی</p>
          </div>
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-5 py-2.5 text-sm font-black font-display text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          شروع دوباره
        </button>
      </div>
    </ToolShell>
  );
}
