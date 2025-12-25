'use client';

import React from 'react';
import { Counter } from '@/components/effects/Counter';

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-3xl font-bold font-display text-white">
        {/[^\d\.\%\+\s]/.test(value.replace(/[۰-۹]/g, '0')) ? value : <Counter value={value} />}
      </div>
      <div className="text-[10px] text-zinc-500 font-black uppercase font-display">
        {label}
      </div>
    </div>
  );
};

