'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpLeft, Lock } from 'lucide-react';
import { Card } from './Card';
import { getCategoryMeta, type Tool } from '@/lib/data/tools';

/**
 * The single, canonical tool card — used both in the dense /tools grid AND the
 * home page's featured row, so the two can never drift in size or style again.
 * Built on the shared <Card> so it inherits the house physics (glass blur, 3D
 * mouse-tilt, corner radial-lighting) identical to ProjectCard. Content is
 * layered with translateZ for the 3D pop.
 *
 * Shape: the card always fills its parent (h-full). The PARENT decides the
 * footprint — the /tools grid wraps each cell in `aspect-square`; the home row
 * gives each tile a fixed height. Either way every tool tile is square and
 * identical.
 *
 * Accent defaults to the tool's CATEGORY colour so each category reads as one
 * coherent hue. Pass `accent` to override with a per-tool mix — used by the
 * «پرطرفدار» section and the home row, which are deliberately varied/colourful.
 */
export const ToolCard: React.FC<{
  tool: Tool;
  accent?: string;
  /** Short tiles (home row) — no hover expansion so content never spills the
      fixed-height tile. The /tools grid is square/tall, so it stays rich. */
  compact?: boolean;
  /** Reveal the category line on hover — only the «پرطرفدار» section wants it. */
  showCategory?: boolean;
}> = ({ tool, accent: accentProp, compact = false, showCategory = false }) => {
  const Icon = tool.icon;
  const isSoon = tool.status === 'soon';
  const accent = accentProp ?? getCategoryMeta(tool.category).color;
  const CatIcon = getCategoryMeta(tool.category).icon;
  // Hover-reveal (desc expand + category) is disabled in compact tiles and for
  // locked tools, so short fixed-height tiles never overflow.
  const canReveal = !isSoon && !compact;
  const revealCategory = canReveal && showCategory;

  const card = (
    <Card
      glowColor={`rgba(${accent}, 0.22)`}
      roundedClass="rounded-[1.75rem]"
      contentClassName="p-4 md:p-5"
      className="h-full"
      isHoverable={!isSoon}
      colorOnHoverOnly
    >
      <div
        className="relative flex h-full flex-col text-right"
        dir="rtl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* top row: open affordance / soon status. The tool icon now lives at the
            BOTTOM next to the title (like the project cards' brand mark). */}
        <div
          className="flex items-start justify-end"
          style={{ transform: 'translateZ(40px)' }}
        >
          {isSoon ? (
            <span className="inline-flex max-w-[80%] items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-bold font-display leading-tight text-muted-foreground text-right">
              <Lock className="h-3 w-3 shrink-0" aria-hidden />
              {tool.lockNote ?? 'به‌زودی'}
            </span>
          ) : (
            <ArrowUpLeft
              className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ color: `rgb(${accent})` }}
              aria-hidden
            />
          )}
        </div>

        {/* title + icon + description anchored to the bottom — same spot as the
            project cards' brand mark + title. The «آزمایشی» tag sits on its own
            line UNDER the title. */}
        <div className="mt-auto pt-4" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors duration-300 group-hover:[background-color:rgba(var(--tc),0.14)] group-hover:[color:rgb(var(--tc))]"
              style={{ '--tc': accent } as React.CSSProperties}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display text-sm md:text-base font-black leading-snug text-foreground">
              {tool.title}
            </h3>
          </div>
          {/* Description — 2 lines at rest, smoothly grows (real max-height
              animation, not a clamp jump) to reveal more on hover. Compact tiles
              stay clamped so they never overflow. */}
          {canReveal ? (
            <p
              className="mt-1.5 overflow-hidden font-sans text-xs leading-relaxed text-muted-foreground transition-[max-height] duration-300 ease-out [max-height:2.6rem] group-hover:[max-height:7rem] motion-reduce:transition-none"
            >
              {tool.desc}
            </p>
          ) : (
            <p className="mt-1.5 line-clamp-2 font-sans text-xs leading-relaxed text-muted-foreground">
              {tool.desc}
            </p>
          )}

          {/* Category — hidden at rest, slides open on hover (like the project
              cards). Only for «پرطرفدار» tools. Always open on touch (max-md). */}
          {revealCategory && (
            <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 motion-reduce:transition-none">
              <div className="min-h-0 overflow-hidden">
                <span
                  className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold font-display leading-tight"
                  style={{
                    background: `rgba(${accent}, 0.1)`,
                    color: `rgb(${accent})`,
                  }}
                >
                  <CatIcon className="h-3 w-3 shrink-0" strokeWidth={2} />
                  {tool.category}
                </span>
              </div>
            </div>
          )}
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
      className="group block h-full rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {card}
    </Link>
  );
};
