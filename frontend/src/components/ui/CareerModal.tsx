'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface CareerModalProps {
 job: any | null;
 onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({ job, onClose }) => {
 if (!job) return null;

 return (
  <AnimatePresence>
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
    <motion.div 
     initial={{ opacity: 0 }} 
     animate={{ opacity: 1 }} 
     exit={{ opacity: 0 }} 
     onClick={onClose} 
     className="absolute inset-0 bg-black/95 cursor-pointer" 
    />
    
    <motion.div 
     initial={{ opacity: 0, y: 100 }} 
     animate={{ opacity: 1, y: 0 }} 
     exit={{ opacity: 0, y: 100 }}
     className="bg-zinc-950 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 relative z-10 overflow-y-auto custom-scrollbar"
    >
     <button onClick={onClose} className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors z-20">
      <X className="w-6 h-6" />
     </button>
     
     <div className="p-8 md:p-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
       {/* Job Details */}
       <div className="space-y-10 text-right">
        <div className="space-y-4">
         <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-display">{job.type}</div>
         <h2 className="text-4xl font-bold font-display text-white leading-tight">{job.title}</h2>
        </div>

        {job.requirements && (
         <div className="space-y-4">
          <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">نیازمندی‌های کلیدی</h4>
          <ul className="space-y-3">
           {job.requirements.map((req: string, i: number) => (
            <li key={i} className="flex items-start gap-3 justify-end text-zinc-400 text-sm leading-relaxed">
             <span>{req}</span>
             <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0 mt-1" />
            </li>
           ))}
          </ul>
         </div>
        )}

        {job.benefits && (
         <div className="space-y-4">
          <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">مزایای همکاری</h4>
          <ul className="space-y-3">
           {job.benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-start gap-3 justify-end text-zinc-400 text-sm leading-relaxed">
             <span>{benefit}</span>
             <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0 mt-1" />
            </li>
           ))}
          </ul>
         </div>
        )}
       </div>

       {/* Application Form */}
       <div className="space-y-10 bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/5">
        <h3 className="text-xl font-bold font-display text-white text-right">ثبت درخواست همکاری</h3>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
         <input 
          type="text" 
          placeholder="نام و نام خانوادگی" 
          className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-white transition-colors font-display text-right" 
         />
         <input 
          type="email" 
          placeholder="آدرس ایمیل" 
          className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-white transition-colors font-display text-right" 
         />
         
         <div className="border-2 border-dashed border-white/10 p-10 rounded-3xl text-center hover:border-white/20 transition-colors cursor-pointer group">
          <Upload className="w-8 h-8 mx-auto mb-4 text-zinc-500 group-hover:text-white transition-colors" />
          <p className="text-zinc-500 text-xs font-display">رزومه خود را آپلود کنید (PDF)</p>
         </div>
         
         <Button className="w-full py-5 !text-black">ارسال درخواست</Button>
        </form>
       </div>
      </div>
     </div>
    </motion.div>
   </div>
  </AnimatePresence>
 );
};