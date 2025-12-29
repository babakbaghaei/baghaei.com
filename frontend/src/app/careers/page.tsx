'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, Heading } from '@/components/ui/Layout';
import { JobCard } from '@/components/ui/JobCard';
import { CareerModal } from '@/components/ui/CareerModal';
import { motion } from 'framer-motion';

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
   
   <Section className="pt-48 pb-40">
    <div className="max-w-4xl">
     <Heading subtitle="رشد">فرصت‌های</Heading>
     
     <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-zinc-400 max-w-2xl font-sans text-xl md:text-2xl leading-relaxed mb-24 text-right"
     >
      ما به دنبال مهندسانی هستیم که کدنویسی را فراتر از یک ابزار، و آن را به عنوان یک هنر و دانش معماری می‌بینند. در گروه بقایی، چالش‌های بزرگ منتظر راه‌حل‌های هوشمندانه شماست.
     </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
     {detailedJobs.map((job, index) => (
      <motion.div
       key={job.id}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.3 + (index * 0.1) }}
      >
       <JobCard 
        job={job} 
        onClick={() => setSelectedJob(job)} 
       />
      </motion.div>
     ))}
    </div>

    <motion.div 
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ delay: 0.6 }}
     className="mt-32 p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] text-center"
    >
     <h3 className="text-2xl font-bold text-white mb-4 font-display">موقعیتی که دنبالش هستید را نمی‌بینید؟</h3>
     <p className="text-zinc-500 max-w-xl mx-auto mb-8 font-sans">
      اگر فکر می‌کنید تخصص شما می‌تواند به گروه ما کمک کند، رزومه خود را برای ما بفرستید. ما همیشه برای استعدادهای واقعی جا داریم.
     </p>
     <a href="mailto:hr@baghaei.com" className="text-white border-b border-white/20 pb-1 hover:border-white transition-colors font-display">
      hr@baghaei.com
     </a>
    </motion.div>
   </Section>

   <CareerModal 
    job={selectedJob} 
    onClose={() => setSelectedJob(null)} 
   />
   
   <Footer />
  </main>
 );
}