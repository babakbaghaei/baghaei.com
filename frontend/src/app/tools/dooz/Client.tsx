'use client';
/* eslint-disable react-hooks/set-state-in-effect -- بازی: نتیجه/حرکت رایانه عمداً در افکت ثبت می‌شود */

/**
 * بازی دوز (ایکس و او) در برابر رایانه (R41).
 * سه سطح سختی؛ سطح «حرفه‌ای» از الگوریتم مینیمکس استفاده می‌کند و هرگز نمی‌بازد
 * (بهترین حالت حریف، مساوی است). برای سرگرمی.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid3x3, RotateCcw, Trophy, Info, BookOpen, Cpu } from 'lucide-react';
import {
  ToolShell,
  Panel,
  faNum,
  motion,
  AnimatePresence,
} from '@/components/tools/shell';

const ACCENT = '239, 68, 68';
type Cell = 'X' | 'O' | null;
type Board = Cell[];
type Level = 'easy' | 'medium' | 'hard';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(b: Board): { who: Cell; line: number[] } | null {
  for (const ln of LINES) {
    const [a, c, d] = ln;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: ln };
  }
  return null;
}

const isFull = (b: Board) => b.every((c) => c !== null);

/** مینیمکس — امتیاز بهترین حرکت برای بازیکن جاری. */
function minimax(b: Board, player: Cell, ai: Cell, human: Cell, depth: number): number {
  const w = winnerOf(b);
  if (w) return w.who === ai ? 10 - depth : depth - 10;
  if (isFull(b)) return 0;

  const moves = b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
  if (player === ai) {
    let best = -Infinity;
    for (const m of moves) {
      b[m] = ai;
      best = Math.max(best, minimax(b, human, ai, human, depth + 1));
      b[m] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      b[m] = human;
      best = Math.min(best, minimax(b, ai, ai, human, depth + 1));
      b[m] = null;
    }
    return best;
  }
}

/** بهترین حرکت رایانه با مینیمکس. */
function bestMove(b: Board, ai: Cell, human: Cell): number {
  const moves = b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
  let best = -Infinity;
  let pick = moves[0];
  for (const m of moves) {
    b[m] = ai;
    const score = minimax(b, human, ai, human, 0);
    b[m] = null;
    if (score > best) {
      best = score;
      pick = m;
    }
  }
  return pick;
}

const emptyMoves = (b: Board) => b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
const randMove = (b: Board) => {
  const m = emptyMoves(b);
  return m[Math.floor(Math.random() * m.length)];
};

/** انتخاب حرکت رایانه بر اساس سطح سختی. */
function cpuMove(b: Board, ai: Cell, human: Cell, level: Level): number {
  if (level === 'easy') return Math.random() < 0.8 ? randMove(b) : bestMove(b, ai, human);
  if (level === 'medium') return Math.random() < 0.45 ? randMove(b) : bestMove(b, ai, human);
  return bestMove(b, ai, human); // hard — همیشه بهینه
}

const LEVELS: { key: Level; label: string }[] = [
  { key: 'easy', label: 'آسان' },
  { key: 'medium', label: 'متوسط' },
  { key: 'hard', label: 'حرفه‌ای' },
];

const HUMAN: Cell = 'X';
const AI: Cell = 'O';

export default function DoozClient() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [level, setLevel] = useState<Level>('hard');
  const [humanStarts, setHumanStarts] = useState(true);
  const [turn, setTurn] = useState<Cell>('X'); // نوبت جاری
  const [score, setScore] = useState({ win: 0, loss: 0, draw: 0 });
  const [locked, setLocked] = useState(false);

  const result = useMemo(() => winnerOf(board), [board]);
  const full = useMemo(() => isFull(board), [board]);
  const over = !!result || full;

  // ثبت نتیجه یک بار در پایان بازی
  const [recorded, setRecorded] = useState(false);
  useEffect(() => {
    if (over && !recorded) {
      setRecorded(true);
      if (result?.who === HUMAN) setScore((s) => ({ ...s, win: s.win + 1 }));
      else if (result?.who === AI) setScore((s) => ({ ...s, loss: s.loss + 1 }));
      else setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }, [over, recorded, result]);

  // حرکت رایانه وقتی نوبت اوست
  useEffect(() => {
    if (over) return;
    if (turn !== AI) return;
    setLocked(true);
    const t = setTimeout(() => {
      setBoard((b) => {
        if (winnerOf(b) || isFull(b)) return b;
        const m = cpuMove([...b], AI, HUMAN, level);
        const nb = [...b];
        nb[m] = AI;
        return nb;
      });
      setTurn(HUMAN);
      setLocked(false);
    }, 420);
    return () => clearTimeout(t);
  }, [turn, over, level]);

  const play = useCallback(
    (i: number) => {
      if (locked || over || board[i] || turn !== HUMAN) return;
      const nb = [...board];
      nb[i] = HUMAN;
      setBoard(nb);
      setTurn(AI);
    },
    [board, locked, over, turn],
  );

  const reset = useCallback(
    (starts = humanStarts) => {
      setBoard(Array(9).fill(null));
      setRecorded(false);
      setLocked(false);
      setTurn(starts ? HUMAN : AI);
    },
    [humanStarts],
  );

  const status = result
    ? result.who === HUMAN
      ? 'بردید! 🎉'
      : 'رایانه برد'
    : full
    ? 'مساوی شد'
    : turn === HUMAN
    ? 'نوبت شماست'
    : 'رایانه فکر می‌کند…';

  return (
    <ToolShell
      title="بازی دوز (ایکس و او)"
      subtitle="در برابر رایانه؛ سه سطح سختی — سطح حرفه‌ای هرگز نمی‌بازد"
      icon={Grid3x3}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'قانون بازی',
          body: 'هر بازیکن به‌نوبت یک خانه را با نماد خود پر می‌کند. هر کس زودتر سه نماد در یک ردیف افقی، عمودی یا قطری بچیند، برنده است. اگر همهٔ خانه‌ها پر شوند و کسی نبرد، بازی مساوی است.',
        },
        {
          icon: <Cpu className="w-4 h-4" />,
          title: 'سطح حرفه‌ای',
          body: 'در سطح حرفه‌ای، رایانه با الگوریتم مینیمکس بهترین حرکت ممکن را انتخاب می‌کند؛ بهترین نتیجه‌ای که می‌توانید بگیرید مساوی است. برای بردن، سطح آسان یا متوسط را امتحان کنید.',
        },
      ]}
      disclaimer="این بازی صرفاً برای سرگرمی است."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-6 items-start">
        <Panel className="space-y-7">
          {/* status */}
          <div className="text-center">
            <span
              className="inline-block text-sm font-black font-display px-4 py-1.5 rounded-full"
              style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
            >
              {status}
            </span>
          </div>

          {/* board */}
          <div className="mx-auto grid grid-cols-3 gap-2.5 w-[min(82vw,360px)]" dir="ltr">
            {board.map((cell, i) => {
              const inWin = result?.line.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => play(i)}
                  disabled={!!cell || over || turn !== HUMAN}
                  aria-label={`خانهٔ ${faNum(i + 1)}`}
                  className="relative aspect-square rounded-2xl border-2 flex items-center justify-center text-4xl md:text-5xl font-black transition-colors disabled:cursor-not-allowed"
                  style={{
                    borderColor: inWin ? `rgb(${ACCENT})` : 'hsl(var(--border))',
                    background: inWin ? `rgba(${ACCENT}, 0.12)` : 'transparent',
                  }}
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        style={{ color: cell === HUMAN ? `rgb(${ACCENT})` : 'hsl(var(--foreground))' }}
                      >
                        {cell === 'X' ? '✕' : '◯'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => reset()}
            className="mx-auto flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black font-display text-background transition-transform hover:scale-[1.02]"
            style={{ background: `rgb(${ACCENT})` }}
          >
            <RotateCcw className="w-4 h-4" /> بازی جدید
          </button>
        </Panel>

        {/* controls + score */}
        <div className="space-y-4">
          <Panel className="space-y-5" delay={0.05}>
            <div>
              <h3 className="text-xs font-black font-display text-muted-foreground uppercase tracking-wide mb-3">
                سطح سختی
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => {
                  const active = level === l.key;
                  return (
                    <button
                      key={l.key}
                      onClick={() => {
                        setLevel(l.key);
                        reset();
                      }}
                      className="rounded-xl border-2 py-2.5 text-xs font-black font-display transition-all"
                      style={
                        active
                          ? { borderColor: `rgb(${ACCENT})`, background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }
                          : { borderColor: 'hsl(var(--border))' }
                      }
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black font-display text-muted-foreground uppercase tracking-wide mb-3">
                شروع‌کننده
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: true, label: 'شما (✕)' },
                  { v: false, label: 'رایانه (◯)' },
                ].map((o) => {
                  const active = humanStarts === o.v;
                  return (
                    <button
                      key={String(o.v)}
                      onClick={() => {
                        setHumanStarts(o.v);
                        reset(o.v);
                      }}
                      className="rounded-xl border-2 py-2.5 text-xs font-black font-display transition-all"
                      style={
                        active
                          ? { borderColor: `rgb(${ACCENT})`, background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }
                          : { borderColor: 'hsl(var(--border))' }
                      }
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>

          <Panel className="space-y-3" delay={0.1}>
            <h3 className="flex items-center gap-2 text-sm font-black font-display text-foreground">
              <Trophy className="w-4 h-4" style={{ color: `rgb(${ACCENT})` }} /> جدول امتیاز
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'برد', v: score.win },
                { label: 'باخت', v: score.loss },
                { label: 'مساوی', v: score.draw },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/40 border border-border py-3">
                  <div className="text-2xl font-black font-display tabular-nums">{faNum(s.v)}</div>
                  <div className="text-xs text-muted-foreground font-display mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setScore({ win: 0, loss: 0, draw: 0 })}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors font-display pt-1"
            >
              صفر کردن امتیازها
            </button>
          </Panel>

          <p className="flex items-center gap-2 text-xs text-muted-foreground/70 font-display px-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            شما با ✕ بازی می‌کنید و رایانه با ◯.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
