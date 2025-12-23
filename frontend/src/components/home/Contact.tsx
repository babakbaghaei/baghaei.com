"use client";
import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '@/app/actions';
import Magnetic from '@/components/effects/Magnetic';
import { Mail } from 'lucide-react';

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

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 text-center">
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
                disabled={isPending}
                className="group relative px-16 py-8 bg-white text-black rounded-full font-bold text-xl overflow-hidden active:scale-95 disabled:opacity-50 transition-transform"
              >
                <span className="relative z-10">{isPending ? 'در حال ارسال...' : 'ارسال بیانیه'}</span>
                <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              {status === 'success' && (
                <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-green-600 font-bold uppercase tracking-widest text-sm">
                  دریافت شد. به زودی تماس می‌گیریم.
                </motion.p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
