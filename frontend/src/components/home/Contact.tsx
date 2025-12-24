"use client";
import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactForm } from '@/app/actions';
import Magnetic from '@/components/effects/Magnetic';
import { Mail, Send, Check, Loader2 } from 'lucide-react';

export default function Contact() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 5000);
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    });
  };

  return (
    <section id="contact" className="py-40 relative overflow-hidden transition-colors duration-700">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Mail className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10 text-center">
        <div className="flex flex-col items-center gap-20">
          
          <div className="space-y-8 flex flex-col items-center">
            <div className="w-12 h-[2px] bg-white mb-12" />
            <h2 className="text-5xl md:text-8xl font-bold weight-plus-1 font-display leading-none text-white uppercase">
              شروع یک <br /><span className="text-zinc-800">گفتگو.</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-4xl w-full">
            <div className="text-xl md:text-3xl font-medium font-display leading-[2.5] md:leading-[2] text-white">
              <span className="inline-block">سلام، من </span>
              <input 
                type="text" name="name" required 
                placeholder="نام و نام خانوادگی"
                className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-[90%] md:w-auto block md:inline-block text-center mx-auto md:mx-1 my-4 md:my-0"
              />
              <span className="inline-block"> هستم. می‌خواهم در مورد </span>
              <input 
                type="text" name="message" required 
                placeholder="موضوع یا شرح پروژه"
                className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-[90%] md:w-auto block md:inline-block text-center mx-auto md:mx-1 my-4 md:my-0"
              />
              <span className="inline-block"> با شما همکاری کنم. </span>
              <br className="hidden md:block" />
              <span className="inline-block">می‌توانید به من در </span>
              <input 
                type="text" name="phone" required 
                placeholder="شماره تماس"
                className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-[90%] md:w-auto block md:inline-block text-center mx-auto md:mx-1 my-4 md:my-0"
                dir="ltr"
              />
              <span className="inline-block"> پیام دهید.</span>
            </div>

            <div className="mt-24 flex flex-col items-center gap-12">
              <button 
                type="submit" 
                disabled={isPending || status === 'success'}
                className="group relative px-16 py-8 bg-white !text-black rounded-full !font-black font-display text-xl overflow-hidden active:scale-95 disabled:opacity-80 transition-all flex items-center gap-4"
              >
                <span className="relative z-10 !text-black">
                  {isPending ? 'در حال ارسال...' : status === 'success' ? 'ارسال شد' : 'ارسال'}
                </span>
                
                <div className="relative w-6 h-6 z-10 text-black">
                  <AnimatePresence mode="wait">
                    {isPending ? (
                      <motion.div key="loading" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Loader2 className="w-6 h-6" />
                      </motion.div>
                    ) : status === 'success' ? (
                      <motion.div key="success" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                        <Check className="w-6 h-6 text-green-800" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle" 
                        initial={{ x: -20, opacity: 0 }} 
                        whileHover={{ x: 0, opacity: 1 }}
                        animate={{ x: -10, opacity: 0.5 }}
                        className="group-hover:opacity-100"
                      >
                        <Send className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              {status === 'error' && (
                <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-red-600 font-bold uppercase tracking-widest text-sm font-display">
                  خطا در ارسال. مجدداً تلاش کنید.
                </motion.p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
