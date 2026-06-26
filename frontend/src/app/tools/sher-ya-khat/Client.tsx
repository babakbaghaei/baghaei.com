'use client';

import React, { useState } from 'react';
import { CircleDollarSign, RotateCw, Sparkles } from 'lucide-react';
import {
  ToolShell,
  AnimatePresence,
  motion,
  faNum,
} from '@/components/tools/shell';

const ACCENT = '234, 179, 8'; // amber/gold

type Side = 'شیر' | 'خط';

export default function SherYaKhat() {
  const [side, setSide] = useState<Side | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [spins, setSpins] = useState(0);
  const [counts, setCounts] = useState({ شیر: 0, خط: 0 });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    const result: Side = Math.random() < 0.5 ? 'شیر' : 'خط';
    // چند دور کامل + نیم‌دور در صورت «خط» تا روی نتیجه بایستد.
    setSpins((s) => s + 5 * 360 + (result === 'خط' ? 180 : 0) + (result === 'شیر' ? 360 : 0));
    window.setTimeout(() => {
      setSide(result);
      setCounts((c) => ({ ...c, [result]: c[result] + 1 }));
      setFlipping(false);
    }, 1100);
  };

  const total = counts.شیر + counts.خط;

  return (
    <ToolShell
      title="شیر یا خط"
      subtitle="پرتاب سکه برای یک تصمیم سریع و منصفانه"
      icon={CircleDollarSign}
      accent={ACCENT}
      info={[
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'احتمال برابر',
          body: 'هر پرتاب کاملاً تصادفی است و احتمال شیر و خط دقیقاً برابر (۵۰٪) است؛ نتیجهٔ پرتاب‌های پیشین روی پرتاب بعدی اثری ندارد.',
        },
      ]}
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-10 py-6">
        {/* سکه */}
        <div className="relative" style={{ perspective: 1000 }}>
          <motion.div
            className="flex h-40 w-40 items-center justify-center rounded-full text-3xl font-black font-display shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              background: `radial-gradient(circle at 35% 30%, rgba(${ACCENT},0.95), rgba(${ACCENT},0.55) 70%)`,
              color: '#3b2f00',
              border: `4px solid rgba(${ACCENT}, 0.7)`,
            }}
            animate={{ rotateY: spins }}
            transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {side ?? 'سکه'}
          </motion.div>
        </div>

        <button
          onClick={flip}
          disabled={flipping}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black font-display text-white shadow-xl transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
          style={{ background: `rgb(${ACCENT})` }}
        >
          <RotateCw className={`h-5 w-5 ${flipping ? 'animate-spin' : ''}`} />
          پرتاب سکه
        </button>

        <AnimatePresence>
          {side && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="font-display text-sm text-muted-foreground">نتیجه</p>
              <p className="font-display text-4xl font-black" style={{ color: `rgb(${ACCENT})` }}>
                {side}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {total > 0 && (
          <div className="flex w-full items-center justify-center gap-8 rounded-2xl border border-border bg-card/40 p-4 font-display">
            <div className="text-center">
              <p className="text-2xl font-black text-foreground">{faNum(String(counts.شیر))}</p>
              <p className="text-xs text-muted-foreground">شیر</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-black text-foreground">{faNum(String(counts.خط))}</p>
              <p className="text-xs text-muted-foreground">خط</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-black text-foreground">{faNum(String(total))}</p>
              <p className="text-xs text-muted-foreground">کل پرتاب‌ها</p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
