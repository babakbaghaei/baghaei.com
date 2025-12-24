'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, Heading } from '@/components/ui/Layout';
import { JobCard } from '@/components/ui/JobCard';
import { CareerModal } from '@/components/ui/CareerModal';

const detailedJobs = [
  { 
    id: 'fullstack', 
    title: 'توسعه‌دهنده ارشد Full-stack', 
    type: 'تمام وقت / دورکاری', 
    desc: 'تسلط کامل به Next.js، NestJS و معماری میکروسرویس. تجربه کار با سیستم‌های توزیع شده و دیتابیس‌های مقیاس‌پذیر.',
    requirements: [
      'حداقل ۵ سال سابقه کار حرفه‌ای در اکوسیستم JavaScript/TypeScript',
      'تسلط عمیق بر Next.js (App Router) و مفاهیم SSR/SSG',
      'تجربه کار با NestJS و معماری‌های مدرن بک‌اِند',
      'شناخت کامل دیتابیس‌های PostgreSQL و Redis',
      'آشنایی با مفاهیم DevOps و کانتینرایزیشن (Docker)'
    ],
    benefits: [
      'امکان دورکاری کامل و ساعات کاری منعطف',
      'حقوق رقابتی و پاداش‌های مبتنی بر عملکرد',
      'بیمه تکمیلی و مزایای رفاهی',
      'محیط کاری حرفه‌ای با دسترسی به آخرین تکنولوژی‌ها'
    ]
  },
  { 
    id: 'ai-eng', 
    title: 'مهندس هوش مصنوعی (LLM)', 
    type: 'تمام وقت / حضوری', 
    desc: 'تجربه در پیاده‌سازی مدل‌های زبانی بزرگ، RAG و بهینه‌سازی مدل‌ها برای کاربردهای تجاری.',
    requirements: [
      'تسلط بر مفاهیم یادگیری عمیق و معماری ترنسفورمرها',
      'تجربه کار با OpenAI API و مدل‌های Open-source مثل Llama',
      'توانایی پیاده‌سازی سیستم‌های RAG و Vector Databases',
      'تسلط بر Python و فریم‌ورک‌های مثل LangChain یا LlamaIndex',
      'سابقه بهینه‌سازی مدل‌ها برای محیط‌های عملیاتی'
    ],
    benefits: [
      'فرصت کار روی پروژه‌های لبه تکنولوژی هوش مصنوعی',
      'بودجه آموزشی و شرکت در کنفرانس‌های بین‌المللی',
      'امکانات رفاهی و ورزشی ویژه',
      'مسیر رشد شغلی شفاف در بخش تحقیق و توسعه (R&D)'
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <Section className="pt-48 pb-20">
        <Heading subtitle="رشد">فرصت‌های</Heading>
        
        <p className="text-zinc-400 max-w-2xl font-sans text-lg md:text-xl leading-relaxed mb-24 text-right ml-auto">
          در گروه فناوری بقایی، ما به دنبال بهترین‌ها هستیم تا با هم آینده‌ای هوشمندتر بسازیم. محیط ما بر پایه تخصص، خلاقیت و رشد مستمر بنا شده است.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {detailedJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => setSelectedJob(job)} 
            />
          ))}
        </div>
      </Section>

      {/* Reusing CareerModal but could be enhanced for requirements/benefits */}
      <CareerModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />
      
      <Footer />
    </main>
  );
}
