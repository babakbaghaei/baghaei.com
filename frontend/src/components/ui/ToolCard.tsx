'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpLeft, Lock } from 'lucide-react';
import { Card } from './Card';
import { getCategoryMeta, type Tool } from '@/lib/data/tools';

/**
 * Tool card for the dense /tools grid.
 * Built on the shared <Card> so it inherits the exact house physics — glass
 * blur, 3D mouse-tilt, and corner radial-lighting — identical to ProjectCard
 * and the home page's SquareToolCard. Content is layered with translateZ for
 * the 3D pop. The bespoke local pointer-tracking lived here before and diverged
 * from the shared lighting; Card now owns all of it.
 */
export const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const Icon = tool.icon;
  const isSoon = tool.status === 'soon';
  const isBeta = tool.status === 'beta';
  const accent = getCategoryMeta(tool.category).color;

  const card = (
    <Card
      glowColor={`rgba(${accent}, 0.22)`}
      roundedClass="rounded-3xl"
      contentClassName="p-6"
      className="min-h-[168px]"
      isHoverable={!isSoon}
      colorOnHoverOnly
    >
      <div
        className="flex h-full flex-col text-right"
        dir="rtl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* top row: icon + status / arrow */}
        <div
          className="flex items-start justify-between"
          style={{ transform: 'translateZ(40px)' }}
        >
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
            <span className="inline-flex max-w-[60%] items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-bold font-display leading-tight text-muted-foreground text-right">
              <Lock className="h-3 w-3 shrink-0" aria-hidden />
              {tool.lockNote ?? 'به‌زودی'}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              {isBeta && (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black font-display leading-tight"
                  style={{
                    background: `rgba(${accent}, 0.12)`,
                    color: `rgb(${accent})`,
                    border: `1px solid rgba(${accent}, 0.25)`,
                  }}
                >
                  آزمایشی
                </span>
              )}
              <ArrowUpLeft
                className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: `rgb(${accent})` }}
                aria-hidden
              />
            </div>
          )}
        </div>

        {/* title + description anchored to the bottom */}
        <div className="mt-auto pt-5" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="font-display text-base font-black leading-snug text-foreground">
            {tool.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 font-sans text-[13px] leading-relaxed text-muted-foreground">
            {tool.desc}
          </p>
        </div>
      </div>
    </Card>
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
