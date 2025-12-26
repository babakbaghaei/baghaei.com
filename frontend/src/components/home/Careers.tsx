'use client';

import React, { useState } from 'react';
import { Section, Heading } from '../ui/Layout';
import { JobCard } from '../ui/JobCard';
import { CareerModal } from '../ui/CareerModal';

const jobsData = [
 { 
  id: 'fullstack', 
  title: 'توسعه‌دهنده ارشد Full-stack', 
  type: 'تمام وقت / دورکاری', 
  desc: 'تسلط کامل به Next.js، NestJS و معماری میکروسرویس. تجربه کار با سیستم‌های توزیع شده و دیتابیس‌های مقیاس‌پذیر.' 
 },
 { 
  id: 'ai-eng', 
  title: 'مهندس هوش مصنوعی (LLM)', 
  type: 'تمام وقت / حضوری', 
  desc: 'تجربه در پیاده‌سازی مدل‌های زبانی بزرگ، RAG و بهینه‌سازی مدل‌ها برای کاربردهای تجاری.' 
 }
];

export default function Careers() {
 const [selectedJob, setSelectedJob] = useState<any | null>(null);

 return (
  <Section id="careers" className="border-t border-zinc-900">
   <Heading subtitle="رشد">فرصت‌های</Heading>
   
   <p className="text-zinc-400 max-w-2xl font-sans text-lg md:text-xl leading-relaxed mb-24 text-right ml-auto">
    ما همیشه به دنبال استعدادهای درخشان هستیم که مرزهای تکنولوژی را با ما جابجا کنند.
   </p>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    {jobsData.map((job) => (
     <JobCard 
      key={job.id} 
      job={job} 
      onClick={() => setSelectedJob(job)} 
     />
    ))}
   </div>

   <CareerModal 
    job={selectedJob} 
    onClose={() => setSelectedJob(null)} 
   />
  </Section>
 );
}