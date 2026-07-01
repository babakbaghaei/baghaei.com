'use client';

/**
 * نوار اعتماد (R51 — CRO): چهار عدد کلیدی و راستی‌آزمایی‌پذیر که بلافاصله بعد از
 * نمونه‌کارها می‌نشیند تا پیش از دعوت به همکاری، اعتبار مجموعه را ملموس کند.
 * اعداد از دادهٔ واقعی سایت گرفته شده‌اند (۱۱ سال تجربه، ۸ پروژهٔ شاخصِ نمایان،
 * جعبه‌ابزار رایگان، ۶ حوزهٔ خدمات) تا هیچ ادعای اغراق‌آمیزی در کار نباشد.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Layers, Wrench, Sparkles, type LucideIcon } from 'lucide-react';
import { toPersianDigits as faNum } from '@/lib/utils/format';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';
import { Card } from '@/components/ui/Card';

interface Stat {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: Briefcase, value: 11, prefix: '+', label: 'سال تجربه' },
  { icon: Layers, value: 8, prefix: '+', label: 'پروژهٔ شاخص' },
  { icon: Wrench, value: 50, prefix: '+', label: 'ابزار رایگان' },
  { icon: Sparkles, value: 6, label: 'حوزهٔ خدمات' },
];

/** شمارندهٔ نرم که با ورود به دید، از صفر تا مقدار هدف بالا می‌رود. */
function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return <span ref={ref}>{faNum(n)}</span>;
}

export default function TrustStats() {
  return (
    <section aria-label="آمار و اعتبار" className="relative border-t border-border bg-transparent py-20 md:py-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24, delay: i * 0.08 }}
                className="h-full"
              >
                <Card
                  roundedClass="rounded-[2rem]"
                  className="p-2"
                  contentClassName="px-4 py-8"
                  isHoverable
                  colorOnHoverOnly
                >
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-3 text-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/[0.06] text-foreground"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <div
                      className="font-display text-4xl md:text-5xl font-black leading-none text-foreground tabular-nums"
                      style={{ transform: 'translateZ(30px)' }}
                    >
                      {s.prefix && <span>{s.prefix}</span>}
                      <Counter target={s.value} />
                    </div>
                    <div className="font-display text-xs md:text-sm font-bold text-muted-foreground">{s.label}</div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
