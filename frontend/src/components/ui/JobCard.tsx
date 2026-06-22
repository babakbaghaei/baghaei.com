'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from './Card';

interface Job {
 id: string;
 title: string;
 type: string;
 desc: string;
}

interface JobCardProps {
 job: Job;
 onClick: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
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
   aria-label={`ارسال درخواست برای موقعیت شغلی ${job.title}`}
   className="cursor-pointer h-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
   <Card
    className="group space-y-8 h-full flex flex-col"
    glowColor="var(--glass-fill)"
   >
    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-display">
     {job.type}
    </div>
    <h3 className="text-3xl font-bold font-display text-foreground">
     {job.title}
    </h3>
    <p className="text-muted-foreground font-sans leading-relaxed">
     {job.desc}
    </p>
    <div className="pt-8 mt-auto flex items-center gap-4 text-xs font-black uppercase text-foreground border-t border-border font-display">
     <span>ارسال درخواست</span>
     <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
    </div>
   </Card>
  </div>
 );
};
