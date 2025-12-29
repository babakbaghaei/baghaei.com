'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCcw, Printer, Share2, Landmark, Calendar, PenTool, Info, ArrowRight } from 'lucide-react';
import { numToPersian } from '@/lib/utils/num-to-persian';
import { toPersianDigits } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

export default function ChequeNevis() {
 const [amount, setAmount] = useState('');
 const [unit, setUnit] = useState<'toman' | 'rial'>('rial');
 const [copied, setCopied] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);

 const cleanNumber = useMemo(() => amount.replace(/,/g, ''), [amount]);
 
 const resultWords = useMemo(() => {
 if (!cleanNumber || cleanNumber === '0') return '....................................................................';
 const text = numToPersian(cleanNumber);
 return `${text} ${unit === 'toman' ? 'تومان' : 'ریال'} تمام.`;
 }, [cleanNumber, unit]);

 const displayAmount = useMemo(() => toPersianDigits(amount), [amount]);

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 // Convert Persian/Arabic digits to English for internal processing
 let value = e.target.value
  .replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
  .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
  .replace(/[^\d]/g, '');

 if (value.length <= 15) {
  const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  setAmount(formatted);
 }
 };

 const handleCopy = () => {
 if (!cleanNumber || cleanNumber === '0') return;
 navigator.clipboard.writeText(resultWords);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const clearAll = () => {
 setAmount('');
 inputRef.current?.focus();
 };

 // Dynamic Font Size based on input length
 const fontSize = useMemo(() => {
 const len = amount.length;
 if (len < 10) return 'text-4xl md:text-7xl';
 if (len < 13) return 'text-3xl md:text-6xl';
 if (len < 16) return 'text-2xl md:text-5xl';
 return 'text-xl md:text-4xl';
 }, [amount]);

  return (

  <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col items-center py-12 px-4 md:py-24 relative overflow-x-hidden">

   {/* Background Decorative Elements */}

   <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">

   <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />

   <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />

   </div>

 

   <div className="w-full max-w-5xl relative z-10">

   {/* Header */}

   <div className="flex flex-col items-center mb-16 text-center">

    <motion.div 

    initial={{ scale: 0.9, opacity: 0 }}

    animate={{ scale: 1, opacity: 1 }}

    className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-6"

    >

    <PenTool className="w-6 h-6 text-primary-foreground" />

    </motion.div>

    <h1 className="text-4xl font-black font-display tracking-tight mb-2">دستیار چک‌نویس</h1>

    <p className="text-muted-foreground text-sm font-medium">شبیه‌ساز هوشمند و دقیق چک‌های صیادی</p>

   </div>

 

   {/* The Simplified Cheque - Focus on Conversion */}

   <motion.div 

    initial={{ y: 30, opacity: 0 }}

    animate={{ y: 0, opacity: 1 }}

    className="relative bg-card rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] border border-border overflow-hidden w-full flex flex-col p-8 md:p-16"

   >

    {/* Guilloche Pattern Overlay (Subtle) */}

    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 

     style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/graphy.png")` }} />

    

    {/* Main Content */}

    <div className="relative z-10 space-y-12">

    {/* 1. Amount in Numbers & Unit Toggle */}

    <div className="flex flex-col items-center gap-8">

     {/* Unit Switcher */}

     <div className="flex bg-muted p-1 rounded-xl border border-border">

     {(['toman', 'rial'] as const).map((u) => (

      <button

      key={u}

      onClick={() => setUnit(u)}

      className={`px-8 py-2 rounded-lg text-xs font-black transition-all ${unit === u ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}

      >

      {u === 'toman' ? 'تومان' : 'ریال'}

      </button>

     ))}

     </div>

 

     {/* Numeric Input Box */}

     <div className="relative w-full max-w-2xl">

     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/30">

      {unit === 'toman' ? 'تومان' : 'ریال'}

     </div>

     <input 

      ref={inputRef}

      type="text"

      inputMode="numeric"

      value={displayAmount}

      onChange={handleInputChange}

      placeholder="۰"

      dir="ltr"

      className={`w-full bg-background border-2 border-border rounded-[2rem] py-6 md:py-10 px-12 font-bold font-display text-center focus:border-primary transition-all outline-none text-foreground placeholder:text-muted/30 ${fontSize}`}

     />

     <button 

      onClick={clearAll}

      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-muted text-muted-foreground transition-all"

     >

      <RefreshCcw className="w-6 h-6" />

     </button>

     </div>

    </div>

 

    {/* 2. Amount in words */}

    <div className="relative pt-8 border-t border-border">

     <div className="flex flex-col items-center gap-6">

     <span className="text-xs font-black text-muted-foreground uppercase">مبلغ به حروف</span>

     <div className="w-full text-center">

      <motion.p 

      key={resultWords}

      initial={{ opacity: 0, y: 10 }}

      animate={{ opacity: 1, y: 0 }}

      className={`text-2xl md:text-4xl font-bold font-display leading-relaxed ${amount ? 'text-primary' : 'text-muted/20'}`}

      >

      {resultWords}

      </motion.p>

     </div>

     </div>

    </div>

    </div>

   </motion.div>

 

   {/* Action Controls */}

   <div className="mt-12 flex flex-col items-center gap-16">

    {/* Educational Section */}

    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">

    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 text-right">

     <div className="flex items-center justify-start gap-3 text-primary font-bold font-display">

     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">

      <Check className="w-4 h-4" />

     </div>

     <span>تطبیق عدد و حروف</span>

     </div>

     <p className="text-muted-foreground text-sm leading-relaxed">

     همیشه مبلغ عددی و حروفی را دو بار چک کنید. در صورت وجود اختلاف، بانک مبلغ حروفی را ملاک قرار می‌دهد اما معمولاً چک را جهت اطمینان برگشت می‌زند.

     </p>

    </div>

 

    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 text-right">

     <div className="flex items-center justify-start gap-3 text-primary font-bold font-display">

     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">

      <PenTool className="w-4 h-4" />

     </div>

     <span>استفاده از چسب نواری</span>

     </div>

     <p className="text-muted-foreground text-sm leading-relaxed">

     روی مبلغ عددی و حروفی را با چسب نواری شیشه‌ای بپوشانید تا امکان جعل و تغییر مبالغ پس از صدور چک به حداقل برسد.

     </p>

    </div>

 

    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 text-right">

     <div className="flex items-center justify-start gap-3 text-primary font-bold font-display">

     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">

      <Info className="w-4 h-4" />

     </div>

     <span>بستن انتهای مبالغ</span>

     </div>

     <p className="text-muted-foreground text-sm leading-relaxed">

     در انتهای مبلغ حروفی حتماً کلمه «تمام» را قید کرده و فضای خالی باقی‌مانده در کادر را با یک خط ممتد ببندید تا چیزی به آن اضافه نشود.

     </p>

    </div>

 

    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 text-right">

     <div className="flex items-center justify-start gap-3 text-primary font-bold font-display">

     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">

      <Landmark className="w-4 h-4" />

     </div>

     <span>ثبت در سامانه صیاد</span>

     </div>

     <p className="text-muted-foreground text-sm leading-relaxed">

     فراموش نکنید که طبق قوانین جدید، چک باید حتماً در سامانه صیاد ثبت شود؛ در غیر این صورت چک فاقد اعتبار بانکی بوده و پاس نخواهد شد.

     </p>

    </div>

    </div>

   </div>

 

   {/* Tools Notice */}

   <div className="mt-20 flex items-center justify-center gap-3 text-muted-foreground text-xs font-medium">

    <Info className="w-4 h-4 text-primary" />

    <span>تمامی محاسبات به صورت آفلاین در مرورگر شما انجام می‌شود.</span>

   </div>

 

   {/* Back Link */}

   <div className="mt-24 text-center pb-20">

              <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-display mb-8">

                <ArrowRight className="w-4 h-4" /> بازگشت به خانه

              </Link>

   </div>

   </div>

 

   <style jsx global>{`

   @media print {

    nav, button, .action-controls, .no-print { display: none !important; }

    main { background: white !important; padding: 0 !important; }

    .max-w-5xl { max-width: 100% !important; }

   }

   `}</style>

  </main>

  );

 
}


