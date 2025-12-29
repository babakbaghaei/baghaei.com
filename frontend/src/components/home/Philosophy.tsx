'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';
import { StatItem } from '../ui/StatItem';

import EngineeringVisual from '@/components/effects/EngineeringVisual';

const stats = [
 { label: 'شرکت بزرگ', value: '+۵' },
 { label: 'پایداری سیستم', value: '۹۹.۹٪' },
 { label: 'پشتیبانی فنی', value: '۲۴ ساعته' }
];

export default function Philosophy() {
 const containerRef = useRef(null);
 const isInView = useInView(containerRef, { amount: 0.1 });
 
 // Counter logic - Pure state based to avoid NaN/Hydration issues
  const [years, setYears] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInView) {
      let start = 0;
      const end = 10;
      interval = setInterval(() => {
        if (start < end) {
          start += 1;
          setYears(start);
        } else {
          clearInterval(interval);
        }
      }, 80);
    } else {
      // Reset safely using a timeout to avoid synchronous setState warning
      const timeout = setTimeout(() => setYears(0), 0);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    return () => clearInterval(interval);
  }, [isInView]);

 const yearsDisplay = `${toPersianDigits(years)}+`;

 return (
  <Section id="philosophy" className="!py-0 min-h-[80vh] border-y border-border bg-background select-none overflow-hidden relative" containerClassName="h-full flex items-center justify-center py-16 relative">
   
   <div ref={containerRef} className="w-full flex flex-col lg:flex-row items-center gap-12 relative z-40">
    <div className="lg:w-[50%] space-y-10">
     <Heading align="right" subtitle="از مرز کدها">مهندسی فراتر</Heading>
     <p className="text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed max-w-2xl text-justify text-right">
      ما معتقدیم نرم‌افزار ابزار نیست؛ زیرساخت آینده است. هر خط کد، یک تصمیم راهبردی برای پایداری برند شماست. در گروه بقایی، هنر طراحی و قدرت مهندسی با هم ترکیب می‌شوند تا سیستم‌هایی خلق شوند که در مقیاس‌های میلیونی بدون وقفه عمل می‌کنند.
     </p>
     <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
      <StatItem label="سال تجربه" value={yearsDisplay} />
      {stats.map((stat, i) => <StatItem key={i} label={stat.label} value={stat.value} />)}
     </div>
    </div>

    {/* Left side with Engineering Visual */}
    <div className="lg:w-[50%] flex items-center justify-center relative min-h-[500px] z-[50]">
      <EngineeringVisual />
    </div>
   </div>
  </Section>
 );
}