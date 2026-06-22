'use client';

import React from 'react';

type BackgroundGridVariant = 'lines' | 'dots';

interface BackgroundGridProps {
  /**
   * 'lines' (default) — fine line grid with a soft radial mask + primary glow.
   *   Used on content pages (blog) that want an ambient top-of-page halo.
   * 'dots' — subtle radial-dot lattice spanning the full viewport.
   *   Used as the global app background in layout.tsx.
   */
  variant?: BackgroundGridVariant;
}

export default function BackgroundGrid({ variant = 'lines' }: BackgroundGridProps) {
  if (variant === 'dots') {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
    </div>
  );
}
