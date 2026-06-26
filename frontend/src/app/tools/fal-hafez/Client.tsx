'use client';

import React, { useState } from 'react';
import { Feather, Sparkles, RotateCw, BookOpen } from 'lucide-react';
import {
  ToolShell,
  AnimatePresence,
  motion,
} from '@/components/tools/shell';
import { HAFEZ_FALS, type HafezFal } from '@/lib/data/hafez';

const ACCENT = '217, 70, 239'; // fuchsia

export default function FalHafez() {
  const [fal, setFal] = useState<HafezFal | null>(null);
  const [drawing, setDrawing] = useState(false);

  const draw = () => {
    if (drawing) return;
    setDrawing(true);
    setFal(null);
    window.setTimeout(() => {
      const next = HAFEZ_FALS[Math.floor(Math.random() * HAFEZ_FALS.length)];
      setFal(next);
      setDrawing(false);
    }, 700);
  };

  return (
    <ToolShell
      title="فال حافظ"
      subtitle="تفأل به دیوان حافظ شیرازی؛ نیّت کنید و فال بگیرید"
      icon={Feather}
      accent={ACCENT}
      info={[
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'آیین تفأل',
          body: 'بنا بر سنّت دیرینهٔ ایرانیان، برای گرفتن فال حافظ نخست نیّت می‌کنند، صلوات می‌فرستند و سپس به دیوان خواجه تفأل می‌زنند. غزلِ آمده، پاسخ حافظ به نیّت شماست.',
        },
        {
          icon: <Sparkles className="w-4 h-4" />,
          title: 'تعبیر فال',
          body: 'در کنار هر غزل، تفسیری کوتاه و امیدبخش آورده شده تا پیام کلی فال روشن‌تر شود. این تعبیرها جنبهٔ فرهنگی و معنوی دارند.',
        },
      ]}
      disclaimer="فال حافظ بخشی از فرهنگ و ادب پارسی است و جنبهٔ سرگرمی و معنوی دارد؛ پیش‌گویی قطعی محسوب نمی‌شود."
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-2">
        <button
          onClick={draw}
          disabled={drawing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black font-display text-white shadow-xl transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
          style={{ background: `rgb(${ACCENT})` }}
        >
          <RotateCw className={`h-5 w-5 ${drawing ? 'animate-spin' : ''}`} />
          {fal ? 'فال دوباره' : 'نیّت کنید و فال بگیرید'}
        </button>

        <AnimatePresence mode="wait">
          {drawing ? (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-12 text-muted-foreground"
            >
              <Feather className="h-10 w-10 animate-pulse" style={{ color: `rgb(${ACCENT})` }} />
              <p className="font-display text-sm">در حال تفأل به دیوان خواجه…</p>
            </motion.div>
          ) : fal ? (
            <motion.article
              key={fal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full overflow-hidden rounded-[2rem] border bg-card/40 backdrop-blur-xl shadow-xl"
              style={{ borderColor: `rgba(${ACCENT}, 0.25)` }}
            >
              <div
                className="p-6 md:p-9"
                style={{ background: `linear-gradient(160deg, rgba(${ACCENT}, 0.12), transparent 60%)` }}
              >
                <div className="mb-6 flex items-center justify-center gap-2 text-center">
                  <Feather className="h-4 w-4" style={{ color: `rgb(${ACCENT})` }} />
                  <h2 className="font-display text-lg font-black text-foreground">{fal.title}</h2>
                </div>

                <div className="space-y-4 text-center" dir="rtl">
                  {fal.verses.map((v, i) => (
                    <p
                      key={i}
                      className="font-sans text-base md:text-lg leading-loose text-foreground"
                    >
                      {v}
                    </p>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-background/50 p-5 text-right">
                  <h3
                    className="mb-2 flex items-center gap-2 font-display text-sm font-black"
                    style={{ color: `rgb(${ACCENT})` }}
                  >
                    <Sparkles className="h-4 w-4" />
                    تعبیر فال
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-foreground/80">
                    {fal.interpretation}
                  </p>
                </div>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12 text-center"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: `rgba(${ACCENT}, 0.1)`, color: `rgb(${ACCENT})` }}
              >
                <Feather className="h-7 w-7" />
              </div>
              <p className="max-w-sm font-display text-sm leading-relaxed text-muted-foreground">
                چشمان خود را ببندید، نیّت کنید و دکمهٔ بالا را بزنید تا حافظ به نیّت شما پاسخ دهد.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolShell>
  );
}
