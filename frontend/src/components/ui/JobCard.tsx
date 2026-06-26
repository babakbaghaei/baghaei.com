'use client';

import React from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface Job {
 id: string;
 title: string;
 type: string;
 desc: string;
 icon: LucideIcon;
 accent: string;
}

interface JobCardProps {
 job: Job;
 onClick: () => void;
}

// Career card — built on the shared <Card> with the same physics + accent
// language as ProjectCard / ToolCard (glass tilt, colour-on-hover, translateZ
// depth, arrow affordance) so the careers grid feels part of the same system.
export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
 const Icon = job.icon;
 const accent = job.accent;
 return (
  <div
   onClick={onClick}
   onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
     e.preventDefault();
     onClick();
    }
   }}
   role="button"
   tabIndex={0}
   dir="rtl"
   aria-label={`ارسال درخواست برای موقعیت شغلی ${job.title}`}
   className="group/card h-full cursor-pointer rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
   <Card
    glowColor={`rgba(${accent}, 0.22)`}
    roundedClass="rounded-[2rem]"
    contentClassName="p-7 md:p-9"
    className="h-full"
    isHoverable
    colorOnHoverOnly
   >
    <div
     className="flex h-full flex-col text-right"
     dir="rtl"
     style={{ transformStyle: 'preserve-3d' }}
    >
     <div className="flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
      <div
       className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
       style={{ background: `rgba(${accent}, 0.12)`, color: `rgb(${accent})` }}
      >
       <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-bold font-display leading-tight text-muted-foreground">
       {job.type}
      </span>
     </div>

     <div className="mt-6" style={{ transform: 'translateZ(30px)' }}>
      <h3 className="font-display text-2xl font-black leading-tight text-foreground">
       {job.title}
      </h3>
      <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
       {job.desc}
      </p>
     </div>

     <div
      className="mt-auto flex items-center gap-3 border-t border-border pt-6 text-xs font-black font-display text-foreground"
      style={{ transform: 'translateZ(20px)' }}
     >
      <span style={{ color: `rgb(${accent})` }}>ارسال درخواست</span>
      <ArrowLeft
       className="h-4 w-4 transition-transform group-hover/card:-translate-x-1"
       style={{ color: `rgb(${accent})` }}
       aria-hidden
      />
     </div>
    </div>
   </Card>
  </div>
 );
};
