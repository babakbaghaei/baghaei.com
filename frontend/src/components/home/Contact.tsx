'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { submitContactForm } from '@/app/actions';
import { Mail, Send, Check, Loader2 } from 'lucide-react';
import { Section, Heading } from '../ui/Layout';
import { Button } from '../ui/Button';
import Magnetic from '@/components/effects/Magnetic';
import { useSound } from '@/lib/utils/sounds';
import { toPersianDigits } from '@/lib/utils/format';
import confetti from 'canvas-confetti';

export default function Contact() {
 const [isPending, startTransition] = useTransition();
 const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
 const { play } = useSound();

 // Use GLOBAL scroll to avoid hydration issues with refs
 const { scrollYProgress } = useScroll();
 const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const form = e.currentTarget;
 const formData = new FormData(form);
 
 startTransition(async () => {
  const result = await submitContactForm(formData);
  if (result.success) {
   setStatus('success');
   form.reset();
   confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffffff', '#000000', '#cccccc']
   });
  } else {
   setStatus('error');
  }
 });
 };

 return (
 <Section id="contact" className="border-t border-border bg-transparent">
  {/* Background Icon */}
  <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Mail className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <div className="flex flex-col items-start gap-12">
  <Heading align="right" subtitle="گفتگو">شروع یک</Heading>

  <form onSubmit={handleSubmit} className="relative max-w-6xl w-full">
   <div className="text-xl md:text-4xl font-medium font-display leading-[2.2] md:leading-[1.8] text-foreground text-right">
   <span className="inline">سلام، من </span>
   <input 
    type="text" name="name" required 
    placeholder="نام و نام خانوادگی"
    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً نام خود را وارد کنید')}
    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
    className="border-b-2 border-border bg-transparent px-2 focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground w-full md:w-auto inline-block text-right mx-1 font-display text-[16px] md:text-xl lg:text-4xl"
   />
   <span className="inline"> هستم. می‌خواهم در مورد </span>
   <input 
    type="text" name="message" required 
    placeholder="موضوع یا شرح پروژه"
    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً موضوع یا متن پیام را بنویسید')}
    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
    className="border-b-2 border-border bg-transparent px-2 focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground w-full md:w-auto inline-block text-right mx-1 font-display text-[16px] md:text-xl lg:text-4xl"
   />
   <span className="inline"> با شما همکاری کنم. </span>
   <span className="inline">می‌توانید به من در </span>
   <input 
    type="text" name="phone" required 
    placeholder="شماره تماس یا ایمیل"
    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً شماره تماس یا ایمیل خود را وارد کنید')}
    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
    className="border-b-2 border-border bg-transparent px-2 focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground w-full md:w-auto inline-block text-right mx-1 font-display text-[16px] md:text-xl lg:text-4xl"
    dir="ltr"
   />
   <span className="inline"> پیام دهید.</span>
   </div>

   <div className="mt-16 flex flex-col items-start gap-12">
   <Magnetic disabled={status === 'success'}>
    <Button
    type="submit"
    isLoading={isPending}
    disabled={status === 'success'}
    className="px-12 py-6 text-lg"
    rightIcon={
     status === 'success' ? (
     <Check className="w-5 h-5 text-black" strokeWidth={3} />
     ) : (
     <Send className="w-5 h-5" />
     )
    }
    >
    {status === 'success' ? 'ارسال شد' : 'ارسال'}
    </Button>
   </Magnetic>

   <AnimatePresence>
    {status === 'success' && (
     <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 text-zinc-400 font-medium"
     >
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <p>پیام شما با موفقیت دریافت شد. به زودی با شما تماس خواهیم گرفت.</p>
     </motion.div>
    )}
   </AnimatePresence>

   {status === 'error' && (
    <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-destructive font-bold uppercase tracking-widest text-sm font-display">
    خطا در ارسال. مجدداً تلاش کنید.
    </motion.p>
   )}
   </div>
  </form>
  </div>
 </Section>
 );
}