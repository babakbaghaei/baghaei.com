'use client';

import React, { useState } from 'react';
import { Dices, RotateCw, Sigma } from 'lucide-react';
import {
  ToolShell,
  Panel,
  AnimatePresence,
  motion,
  faNum,
} from '@/components/tools/shell';

const ACCENT = '139, 92, 246'; // violet

// نقاط هر وجه تاس (۱..۶) روی شبکهٔ ۳×۳.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <motion.div
      animate={rolling ? { rotate: [0, -12, 12, 0], scale: [1, 1.08, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="grid h-16 w-16 grid-cols-3 grid-rows-3 gap-1 rounded-2xl border-2 bg-card p-2 shadow-lg"
      style={{ borderColor: `rgba(${ACCENT}, 0.4)` }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="flex items-center justify-center"
        >
          {PIPS[value]?.includes(i) && (
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${ACCENT})` }} />
          )}
        </span>
      ))}
    </motion.div>
  );
}

export default function Tas() {
  const [count, setCount] = useState(2);
  const [dice, setDice] = useState<number[]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => {
      const next = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
      setDice(next);
      const sum = next.reduce((a, b) => a + b, 0);
      setHistory((h) => [sum, ...h].slice(0, 8));
      setRolling(false);
    }, 450);
  };

  const setDiceCount = (n: number) => {
    setCount(n);
    setDice(Array.from({ length: n }, () => 1));
    setHistory([]);
  };

  const sum = dice.reduce((a, b) => a + b, 0);

  return (
    <ToolShell
      title="تاس بینداز"
      subtitle="یک تا چهار تاس هم‌زمان، با جمع خودکار و تاریخچهٔ پرتاب"
      icon={Dices}
      accent={ACCENT}
      info={[
        {
          icon: <Sigma className="w-4 h-4" />,
          title: 'پرتاب تصادفی',
          body: 'هر تاس مستقل و کاملاً تصادفی بین ۱ تا ۶ است. جمع تاس‌ها و تاریخچهٔ آخرین پرتاب‌ها در کنار نتیجه نمایش داده می‌شود.',
        },
      ]}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-8 py-4">
        {/* انتخاب تعداد تاس */}
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 p-1.5 font-display">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setDiceCount(n)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black transition-all ${
                count === n ? 'text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              style={count === n ? { background: `rgb(${ACCENT})` } : undefined}
            >
              {faNum(String(n))}
            </button>
          ))}
        </div>

        {/* تاس‌ها */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-2">
          {dice.map((d, i) => (
            <Die key={i} value={d} rolling={rolling} />
          ))}
        </div>

        <button
          onClick={roll}
          disabled={rolling}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black font-display text-white shadow-xl transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
          style={{ background: `rgb(${ACCENT})` }}
        >
          <RotateCw className={`h-5 w-5 ${rolling ? 'animate-spin' : ''}`} />
          پرتاب تاس
        </button>

        <Panel className="w-full text-center">
          <p className="font-display text-sm text-muted-foreground">جمع</p>
          <p className="font-display text-5xl font-black" style={{ color: `rgb(${ACCENT})` }}>
            {faNum(String(sum))}
          </p>
          <AnimatePresence>
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 flex flex-wrap items-center justify-center gap-2"
              >
                {history.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-background px-2 text-xs font-black font-display text-muted-foreground"
                  >
                    {faNum(String(h))}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>
      </div>
    </ToolShell>
  );
}
