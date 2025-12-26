'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring, useInView } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';
import { useSound } from '@/lib/utils/sounds';
import { StatItem } from '../ui/StatItem';
import GlobalUniverse from '@/components/effects/GlobalUniverse';

const stats = [
 { label: 'شرکت بزرگ', value: '+۵' },
 { label: 'پایداری سیستم', value: '۹۹.۹٪' },
 { label: 'پشتیبانی فنی', value: '۲۴ ساعته' }
];

export default function Philosophy() {
 const { play } = useSound();
 const containerRef = useRef(null);
 
 // Counter logic - Pure state based to avoid NaN/Hydration issues
 const [years, setYears] = useState(0);
 const isVisible = useInView(containerRef, { amount: 0.3, once: false });

 useEffect(() => {
  if (isVisible) {
   const interval = setInterval(() => {
    setYears(prev => (prev < 10 ? prev + 1 : 10));
   }, 80);
   return () => clearInterval(interval);
  } else {
   setYears(0);
  }
 }, [isVisible]);

 const yearsDisplay = `${toPersianDigits(years)}+`;

 return (
  <Section id="philosophy" className="!py-0 min-h-screen border-y border-border bg-background select-none overflow-visible relative" containerClassName="h-full min-h-screen flex items-center justify-center py-20 relative">
   
   <div ref={containerRef} className="w-full flex flex-col lg:flex-row items-center gap-20 relative z-40 pointer-events-none">
    <div className="lg:w-[50%] space-y-12 pointer-events-auto">
     <Heading align="right" subtitle="از مرز کدها">مهندسی فراتر</Heading>
     <p className="text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed max-w-2xl text-justify text-right">
      ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست. در گروه بقایی، هنر طراحی و قدرت مهندسی با هم ترکیب می‌شوند تا سیستم‌هایی خلق شوند که در مقیاس‌های میلیونی بدون وقفه عمل می‌کنند.
     </p>
     <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
      <StatItem label="سال تجربه" value={yearsDisplay} />
      {stats.map((stat, i) => <StatItem key={i} label={stat.label} value={stat.value} />)}
     </div>
    </div>

    {/* Right side with Solar System */}
    <div className="lg:w-[50%] flex items-center justify-center relative min-h-[600px] pointer-events-none z-[50] overflow-visible">
      <GlobalUniverse />
    </div>
   </div>
  </Section>
 );
}