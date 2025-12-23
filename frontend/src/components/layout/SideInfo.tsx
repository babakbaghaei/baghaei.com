'use client';

import React from 'react';

export default function SideInfo() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] hidden 2xl:block px-12 py-20">
      <div className="h-full w-full flex justify-between items-start">
        {/* Left Side */}
        <div className="flex flex-col gap-20">
          <div className="space-y-2">
            <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Version</div>
            <div className="text-[10px] font-black font-en text-black dark:text-white">BTG_SYS_2025_V4</div>
          </div>
          <div className="space-y-2">
            <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Architecture</div>
            <div className="text-[10px] font-black font-en text-black dark:text-white">DISTRIBUTED_SCALE</div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-20 items-end">
          <div className="space-y-2 text-right">
            <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Coordinates</div>
            <div className="text-[10px] font-black font-en text-black dark:text-white">36.5651° N, 53.0590° E</div>
          </div>
          <div className="space-y-2 text-right">
            <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Status</div>
            <div className="text-[10px] font-black font-en text-green-600 uppercase tracking-widest">Stable_Release</div>
          </div>
        </div>
      </div>
    </div>
  );
}
