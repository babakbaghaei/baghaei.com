'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { submitContactForm } from '@/app/actions';
import { Mail, Rocket, Check } from 'lucide-react';
import { Section, Heading } from '../ui/Layout';
import { Button } from '../ui/Button';
import Magnetic from '@/components/effects/Magnetic';

// اثبات اجتماعی کنارِ فرم تماس (R51 — CRO): نامِ کارفرمایان/پروژه‌های واقعیِ
// تحویل‌شده، همان‌جا که کاربر تصمیم به همکاری می‌گیرد. با نام‌های واقعی پروژه‌ها
// (همسو با بخش «اعتماد») هم‌خوان است تا هیچ ادعای ساختگی در کار نباشد.
const TRUSTED_CLIENTS = [
  'سایت راورو',
  'FIDS فرودگاه کیش',
  'باشگاه رویال اقدسیه',
  'سایت درسو',
  'تیونینگ کیوانی',
  'پلتفرم مالاتا',
];

export default function Contact() {
 const [isPending, startTransition] = useTransition();
 const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

 // Use GLOBAL scroll to avoid hydration issues with refs
 const { scrollYProgress } = useScroll();
 const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 const form = e.currentTarget;
 const formData = new FormData(form);

 // Anti-bot: only the hidden honeypot ("company") flags a bot. We mimic success
 // so the bot gets no signal — but a real user submitting fast (autofill+Enter)
 // never trips this, so they never get a false "sent". No time-based gate.
 if ((formData.get('company') as string)?.trim()) {
  setStatus('success');
  form.reset();
  return;
 }

 startTransition(async () => {
  const result = await submitContactForm(formData);
  if (result.success) {
   setStatus('success');
   form.reset();
   // Load confetti only on success — keeps it out of the initial bundle.
   const confetti = (await import('canvas-confetti')).default;
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

 const inputClass = "border-b-2 border-border bg-transparent px-2 focus:outline-none focus-visible:border-foreground focus:border-foreground transition-colors placeholder:text-muted-foreground/40 w-full md:w-auto md:inline-block text-right md:mx-1 font-display text-[16px] md:text-xl lg:text-4xl";
 // Persistent field label: a block caption on mobile (so the user always knows
 // what each underlined field is), collapsed to sr-only inside the md+ sentence.
 const labelClass = "block md:sr-only mb-2 md:mb-0 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground";
 // Connective sentence fragments — shown only on md+ where the mad-libs prose
 // reads naturally; hidden on mobile where fields stack as a labeled form.
 const connector = "hidden md:inline";

 return (
 <Section id="contact" className="border-t border-border bg-transparent">
  {/* Background Icon */}
  <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
  <Mail className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
  </motion.div>

  <div className="flex flex-col items-start gap-12">
  <Heading align="right" subtitle="گفتگو">شروع یک</Heading>

  {/* اثبات اجتماعی درست کنارِ فراخوانِ همکاری (R51) */}
  <div className="-mt-8 flex flex-col gap-3.5">
   <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
    مورد اعتمادِ کارفرمایانی از
   </span>
   <div className="flex flex-wrap gap-2.5">
    {TRUSTED_CLIENTS.map((c) => (
     <span
      key={c}
      className="rounded-full border border-border bg-card/40 px-4 py-1.5 font-display text-xs font-bold text-foreground/80"
     >
      {c}
     </span>
    ))}
   </div>
  </div>

  <form onSubmit={handleSubmit} className="relative max-w-6xl w-full">
   {/* Honeypot — hidden from real users, auto-filled by bots. Do not remove. */}
   <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" style={{ opacity: 0 }}>
    <label htmlFor="contact-company">Company</label>
    <input id="contact-company" type="text" name="company" tabIndex={-1} autoComplete="off" />
   </div>

   {/* One field set, two readings: stacked labeled fields on mobile, the mad-libs
       inline sentence on md+. Fields are blocks on mobile (gap from flex-col) and
       inline within the prose on md+ — no duplicate inputs, so no validation or
       FormData ambiguity. */}
   <div className="flex flex-col gap-8 md:block text-xl md:text-4xl font-medium font-display leading-[2.2] md:leading-[1.8] text-foreground text-right">
   <span className={connector}>سلام، من </span>
   <span className="flex flex-col gap-2 md:inline">
    <label htmlFor="contact-name" className={labelClass}>نام و نام خانوادگی</label>
    <input
     id="contact-name"
     type="text" name="name" required
     autoComplete="name"
     placeholder="نام و نام خانوادگی"
     onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً نام خود را وارد کنید')}
     onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
     className={inputClass}
    />
   </span>
   <span className={connector}> هستم. می‌خواهم در مورد </span>
   <span className="flex flex-col gap-2 md:inline">
    <label htmlFor="contact-message" className={labelClass}>موضوع یا شرح پروژه</label>
    <input
     id="contact-message"
     type="text" name="message" required
     placeholder="موضوع یا شرح پروژه"
     onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً موضوع یا متن پیام را بنویسید')}
     onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
     className={inputClass}
    />
   </span>
   <span className={connector}> با شما همکاری کنم. می‌توانید به من در </span>
   <span className="flex flex-col gap-2 md:inline">
    <label htmlFor="contact-phone" className={labelClass}>شماره تماس یا ایمیل</label>
    <input
     id="contact-phone"
     type="text" name="phone" required
     autoComplete="tel"
     placeholder="شماره تماس یا ایمیل"
     onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('لطفاً شماره تماس یا ایمیل خود را وارد کنید')}
     onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
     className={inputClass}
     dir="ltr"
    />
   </span>
   <span className={connector}> پیام دهید.</span>
   </div>

   <div className="mt-16 flex flex-col items-start gap-12">
   <Magnetic disabled={status === 'success' || isPending}>
    <Button
    type="submit"
    disabled={isPending || status === 'success'}
    className="px-12 py-6 text-lg"
    rightIcon={
     status === 'success' ? (
     <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
     ) : (
     // موشک ارسال: در حالت ارسال، موشک با شعلهٔ احتراق به‌سمت بالا-راست پرتاب می‌شود.
     <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <motion.span
       className="absolute"
       animate={
        isPending
         ? { x: [0, 3, 16], y: [0, -4, -22], opacity: [1, 1, 0] }
         : { x: 0, y: 0, opacity: 1 }
       }
       transition={
        isPending
         ? { duration: 0.7, ease: 'easeIn', repeat: Infinity, repeatDelay: 0.1 }
         : { duration: 0.3 }
       }
      >
       <Rocket className="h-5 w-5" />
      </motion.span>
      {isPending && (
       <motion.span
        aria-hidden="true"
        className="absolute bottom-0 right-1 h-2.5 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-transparent blur-[1px]"
        animate={{ opacity: [0.2, 0.9, 0], scaleY: [0.5, 1.3, 0.4], x: [0, -3, -10], y: [0, 6, 14] }}
        transition={{ duration: 0.7, ease: 'easeIn', repeat: Infinity, repeatDelay: 0.1 }}
       />
      )}
     </span>
     )
    }
    >
    {status === 'success' ? 'ارسال شد' : isPending ? 'در حال ارسال…' : 'ارسال'}
    </Button>
   </Magnetic>

   <div aria-live="polite" role="status">
   <AnimatePresence>
    {status === 'success' && (
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 text-muted-foreground font-medium"
     >
      <div aria-hidden="true" className="w-2 h-2 rounded-full bg-current animate-pulse" />
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
   </div>
  </form>
  </div>
 </Section>
 );
}
