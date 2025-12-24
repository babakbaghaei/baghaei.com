'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <div onClick={onClick} className="cursor-pointer h-full">
      <Card 
        className="group space-y-8 h-full flex flex-col"
        glowColor="rgba(255,255,255,0.03)"
      >
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-display">
          {job.type}
        </div>
        <h3 className="text-3xl font-bold font-display text-white">
          {job.title}
        </h3>
        <p className="text-zinc-400 font-sans leading-relaxed">
          {job.desc}
        </p>
        <div className="pt-8 mt-auto flex items-center gap-4 text-xs font-black uppercase text-white border-t border-white/5 font-display">
          <span>ارسال درخواست</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
        </div>
      </Card>
    </div>
  );
};
