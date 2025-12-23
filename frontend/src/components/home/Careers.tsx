'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Upload } from 'lucide-react';

const jobs = [
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
  const [selectedJob, setSelectedProject] = useState<any | null>(null);

  return (
    <section id="careers" className="py-40 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="mb-24 space-y-6">
          <div className="w-12 h-px bg-white mb-8" />
          <h2 className="text-5xl md:text-7xl font-bold weight-plus-1 font-display text-white">
            فرصت‌های <br /><span className="text-zinc-800">رشد.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl font-sans text-lg md:text-xl leading-relaxed">
            ما همیشه به دنبال استعدادهای درخشان هستیم که مرزهای تکنولوژی را با ما جابجا کنند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {jobs.map((job) => (
            <motion.div 
              key={job.id}
              whileHover={{ y: -10 }}
              className="service-card p-12 space-y-8 relative group cursor-pointer border border-zinc-900 hover:border-zinc-700 transition-all duration-500"
              onClick={() => setSelectedProject(job)}
            >
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{job.type}</div>
              <h3 className="text-3xl font-bold font-display text-white">{job.title}</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">{job.desc}</p>
              <div className="pt-8 flex items-center gap-4 text-xs font-bold uppercase text-white border-t border-zinc-900">
                <span>ارسال درخواست</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* JOB APPLICATION MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="bg-zinc-950 w-full max-w-2xl p-12 md:p-20 rounded-[4rem] border border-zinc-800 relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-12 left-12 text-zinc-500 hover:text-white"><X /></button>
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Applying for</div>
                  <h2 className="text-4xl font-bold font-display text-white">{selectedJob.title}</h2>
                </div>
                <form className="space-y-8">
                  <input type="text" placeholder="نام و نام خانوادگی" className="w-full bg-transparent border-b border-zinc-800 py-4 text-white focus:outline-none focus:border-white transition-colors" />
                  <input type="email" placeholder="آدرس ایمیل" className="w-full bg-transparent border-b border-zinc-800 py-4 text-white focus:outline-none focus:border-white transition-colors" />
                  <div className="border-2 border-dashed border-zinc-800 p-12 rounded-3xl text-center hover:border-zinc-600 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 mx-auto mb-4 text-zinc-500 group-hover:text-white" />
                    <p className="text-zinc-500 text-sm">رزومه خود را اینجا بکشید (PDF)</p>
                  </div>
                  <button type="button" className="btn-primary w-full py-6">ثبت درخواست</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
