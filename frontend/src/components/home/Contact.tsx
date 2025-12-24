'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactForm } from '@/app/actions';
import { Mail, Send, Check, Loader2 } from 'lucide-react';
import { Section, Heading } from '../ui/Layout';
import { Button } from '../ui/Button';

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
    <Section id="contact">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Mail className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <div className="flex flex-col items-start gap-12">
        <Heading align="right" subtitle="گفتگو">شروع یک</Heading>

        <form onSubmit={handleSubmit} className="relative max-w-6xl w-full">
          <div className="text-xl md:text-4xl font-medium font-display leading-[2] md:leading-[1.8] text-white text-right">
            <span className="inline-block">سلام، من </span>
            <input 
              type="text" name="name" required 
              placeholder="نام و نام خانوادگی"
              className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-full md:w-auto block md:inline-block text-right md:mx-2 my-2 md:my-0"
            />
            <span className="inline-block"> هستم. می‌خواهم در مورد </span>
            <input 
              type="text" name="message" required 
              placeholder="موضوع یا شرح پروژه"
              className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-full md:w-auto block md:inline-block text-right md:mx-2 my-2 md:my-0"
            />
            <span className="inline-block"> با شما همکاری کنم. </span>
            <span className="inline-block">می‌توانید به من در </span>
            <input 
              type="text" name="phone" required 
              placeholder="شماره تماس"
              className="border-b-2 border-zinc-800 bg-transparent px-2 focus:outline-none focus:border-white transition-colors placeholder:text-zinc-800 w-full md:w-auto block md:inline-block text-right md:mx-2 my-2 md:my-0"
              dir="ltr"
            />
            <span className="inline-block"> پیام دهید.</span>
          </div>

          <div className="mt-16 flex flex-col items-start gap-12">
            <Button
              type="submit"
              isLoading={isPending}
              disabled={status === 'success'}
              className="px-16 py-8 text-xl"
              rightIcon={
                status === 'success' ? (
                  <Check className="w-6 h-6 text-green-800" strokeWidth={3} />
                ) : (
                  <Send className="w-6 h-6" />
                )
              }
            >
              {status === 'success' ? 'ارسال شد' : 'ارسال'}
            </Button>

            {status === 'error' && (
              <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-red-600 font-bold uppercase tracking-widest text-sm font-display">
                خطا در ارسال. مجدداً تلاش کنید.
              </motion.p>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}