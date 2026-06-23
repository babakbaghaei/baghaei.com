'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import { getCategoryMeta, type Tool } from '@/lib/data/tools';

/**
 * Lightweight tool card for the dense /tools grid.
 * Unlike the heavy shared Card.tsx (which attaches a global window mousemove
 * listener per instance), this tracks the pointer locally — only the hovered
 * card runs any work — so a grid of 16+ cards stays smooth. Keeps the house
 * glass + accent-glow + subtle 3D tilt signature.
 */
export const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const Icon = tool.icon;
  const isSoon = tool.status === 'soon';
  const accent = getCategoryMeta(tool.category).color;
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--rx', `${(0.5 - py) * 5}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 5}deg`);
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  const card = (
    <div
      ref={ref}
      onMouseMove={isSoon ? undefined : onMove}
      onMouseLeave={isSoon ? undefined : onLeave}
      className="group/card relative h-full min-h-[168px] overflow-hidden rounded-3xl border border-border bg-card/40 p-6 shadow-xl backdrop-blur-xl backdrop-saturate-150 transition-[transform,border-color,background-color] duration-300 ease-out will-change-transform hover:border-foreground/15 hover:bg-card/60"
      style={{
        transform:
          'perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
      }}
    >
      {/* accent spotlight following the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(440px circle at var(--mx, 50%) var(--my, 0%), rgba(${accent}, 0.12), transparent 60%)`,
        }}
        aria-hidden
      />
      {/* hairline top highlight for glassiness */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
        }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col" dir="rtl">
        {/* top row: icon + status / arrow */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              background: `rgba(${accent}, 0.1)`,
              color: `rgb(${accent})`,
            }}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
          </div>
          {isSoon ? (
            <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-bold font-display text-muted-foreground">
              به‌زودی
            </span>
          ) : (
            <ArrowUpLeft
              className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100"
              style={{ color: `rgb(${accent})` }}
              aria-hidden
            />
          )}
        </div>

        {/* title + description anchored to the bottom */}
        <div className="mt-auto pt-5">
          <h3 className="font-display text-base font-black leading-snug text-foreground">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 font-sans text-[13px] leading-relaxed text-muted-foreground">
            {tool.desc}
          </p>
        </div>
      </div>
    </div>
  );

  if (isSoon) {
    return <div className="h-full cursor-not-allowed opacity-55">{card}</div>;
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {card}
    </Link>
  );
};
