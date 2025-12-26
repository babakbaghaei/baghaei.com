'use client';

import React, { useRef } from 'react';
import { Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from './Logo';
import { toPersianDigits } from '@/lib/utils/format';
import { SocialLinks } from '../ui/SocialLinks';
import { FooterGroup } from '../ui/FooterGroup';

const navLinks = [
 { label: 'خانه', href: '#hero' },
 { label: 'خدمات و تخصص', href: '#services' },
 { label: 'پروژه‌های منتخب', href: '#projects' },
 { label: 'فلسفه و رویکرد', href: '#philosophy' },
 { label: 'اعتماد مشتریان', href: '#testimonials' },
 { label: 'فرصت‌های رشد', href: '/careers' },
 { label: 'شروع همکاری', href: '#contact' },
];

const legalLinks = [
 { label: 'شرایط استفاده', href: '/terms' },
 { label: 'حریم خصوصی', href: '/privacy' },
];

export default function Footer() {
 return (
 <footer className="bg-background pt-60 pb-20 relative overflow-hidden transition-colors duration-700">
  <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
  <div className="flex flex-col lg:flex-row justify-between gap-32 mb-40">
   {/* Brand Column */}
   <div className="space-y-12 max-w-xl">
   <div className="flex items-center gap-6 text-right">
    <Logo className="w-16 h-16 text-foreground" />
    <h3 className="text-4xl font-black font-display text-foreground uppercase leading-none">
    گروه فناوری <br />بقایی.
    </h3>
   </div>
   <p className="text-lg md:text-xl text-muted-foreground font-sans leading-loose text-justify pl-8 border-l border-border">
    گروه فناوری بقایی از سال ۱۳۹۴ با تمرکز بر مهندسی دقیق و معماری سیستم‌های توزیع‌شده، همراه کسب‌وکارهای بزرگ در مسیر تحول دیجیتال بوده است. ماموریت ما ارتقای سطح کیفی نرم‌افزار در مقیاس سازمانی است.
   </p>
   </div>

   {/* Links Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-24 flex-1">
   <FooterGroup title="دسترسی سریع" links={navLinks} />

   <div className="space-y-10 text-left flex flex-col items-end w-full">
    <h4 className="text-[10px] font-black text-muted-foreground uppercase self-end text-right">راه‌های ارتباطی</h4>
    <div className="flex flex-col gap-6 text-xl font-display text-foreground w-full items-end">
    <a href="tel:+989115790013" className="flex items-center justify-end gap-3 hover:text-muted-foreground transition-all font-display font-medium text-lg md:text-xl whitespace-nowrap" dir="ltr">
     <Phone className="w-5 h-5 text-muted-foreground" />
     <span>{toPersianDigits('+۹۸ ۹۱۱ ۵۷۹ ۰۰۱۳')}</span>
    </a>
    
    <SocialLinks />
    </div>
   </div>
   </div>
  </div>

  {/* Massive Background Text */}
  <div 
   style={{ 
   WebkitTextStroke: '1px var(--foreground)'
   }}
   className="text-[12vw] md:text-[18vw] font-black text-transparent leading-none select-none pointer-events-none mb-12 tracking-tighter uppercase opacity-10 text-right w-full"
  >
   BAGHAEI TECH
  </div>

  {/* Bottom Bar */}
  <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
   <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center md:text-right font-display">
   &copy; {toPersianDigits(1404)} تمامی حقوق برای گروه فناوری بقایی محفوظ است.
   </div>
   <div className="flex gap-12 text-xs font-medium text-muted-foreground uppercase">
   {legalLinks.map(link => (
    <a key={link.label} href={link.href} className="hover:text-foreground cursor-pointer transition-colors font-display">
    {link.label}
    </a>
   ))}
   </div>
  </div>
  </div>
 </footer>
 );
}
