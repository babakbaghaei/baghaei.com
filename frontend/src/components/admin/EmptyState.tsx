'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, subtitle, action }) => (
  <Card isHoverable={false} className="text-center">
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
        <Icon className="w-7 h-7 text-muted-foreground/50" />
      </div>
      <div className="space-y-1.5">
        <p className="font-display text-foreground font-bold">{title}</p>
        {subtitle && <p className="font-display text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  </Card>
);

interface SkeletonProps {
  count?: number;
  className?: string;
}

// Simple list/card skeleton — a stack of pulsing placeholder bars on-brand.
export const ListSkeleton: React.FC<SkeletonProps> = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-[3rem] border border-border bg-foreground/5 p-10 animate-pulse"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-foreground/10 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 rounded-full bg-foreground/10" />
            <div className="h-3 w-2/3 rounded-full bg-foreground/5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
