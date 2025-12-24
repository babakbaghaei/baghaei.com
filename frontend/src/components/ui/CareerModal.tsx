'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Button } from './Button';

interface CareerModalProps {
  job: any | null;
  onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" 
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 100 }}
          className="bg-zinc-950 w-full max-w-2xl p-12 md:p-20 rounded-[4rem] border border-white/10 relative z-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <button onClick={onClose} className="absolute top-12 left-12 text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-display">Applying for</div>
              <h2 className="text-4xl font-bold font-display text-white">{job.title}</h2>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="نام و نام خانوادگی" 
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-white transition-colors font-display" 
              />
              <input 
                type="email" 
                placeholder="آدرس ایمیل" 
                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-white transition-colors font-display" 
              />
              
              <div className="border-2 border-dashed border-white/10 p-12 rounded-3xl text-center hover:border-white/20 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 mx-auto mb-4 text-zinc-500 group-hover:text-white transition-colors" />
                <p className="text-zinc-500 text-sm font-display">رزومه خود را اینجا بکشید (PDF)</p>
              </div>
              
              <Button className="w-full py-6 text-xl">ثبت درخواست</Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
