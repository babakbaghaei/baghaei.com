'use client';

import React from 'react';

export default function Annotations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] hidden xl:block">
      {/* Top Left */}
      <div className="absolute top-12 left-12 text-[9px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
        Precision Engineering / Vol. 2025
      </div>
      
      {/* Bottom Left */}
      <div className="absolute bottom-12 left-12 text-[9px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
        36.5651° N, 53.0590° E
      </div>

      {/* Top Right */}
      <div className="absolute top-48 right-12 text-[9px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
        BTG — Data Authority
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-12 right-12 text-[9px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
        Scalable Systems / Legacy
      </div>
    </div>
  );
}
