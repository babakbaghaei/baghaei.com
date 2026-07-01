'use client';

import React, { useRef } from 'react';
import { User, MessageSquare, Quote } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card, useCardTilt } from '../ui/Card';

const ReactiveQuote = () => {
  const { tiltX, tiltY } = useCardTilt();
  const hX = useTransform(tiltX, [-0.5, 0.5], [-10, 10]);
  const hY = useTransform(tiltY, [-0.5, 0.5], [-10, 10]);
  const sX = useTransform(tiltX, [-0.5, 0.5], [15, -15]);
  const sY = useTransform(tiltY, [-0.5, 0.5], [15, -15]);
  const filter = useMotionTemplate`drop-shadow(${hX}px ${hY}px 2px rgba(255,255,255,0.1)) drop-shadow(${sX}px ${sY}px 8px rgba(0,0,0,0.8))`;

  return (
    <motion.div aria-hidden="true" className="absolute top-4 right-4 pointer-events-none" style={{ filter }}>
      <Quote className="w-12 h-12 text-foreground opacity-[0.2]" />
    </motion.div>
  );
};

// iMessage signature blue (#007AFF) — reassuring, trustworthy bubble tone.
const IMESSAGE_BLUE = 'rgba(0, 122, 255, 0.18)';

// Natural, first-person client voices tied to real, delivered projects. Attribution
// is role-based (no invented personal names), and `company` names the actual project
// so each quote is grounded in real work. Project names are Persian, so the label
// style drops uppercase/letter-spacing that would break connected script.
const testimonials = [
  { id: 1, content: "پلتفرم باگ‌بانتی ما را از صفر ساختند؛ از داشبورد شکارچی تا پنل کارفرما. چیزی که بیش از همه برایمان ارزشمند بود، درک عمیقشان از پیچیدگی‌های امنیتی کار بود، نه صرفاً ظاهر بیرونی آن.", author: "مدیر محصول", company: "سایت راورو", color: IMESSAGE_BLUE },
  { id: 2, content: "سیستم نمایش اطلاعات پرواز باید بدون کوچک‌ترین وقفه و در هر شرایطی کار کند. پایداری و دقتی که در طراحی تابلوها و کانترهای فرودگاه تحویل گرفتیم، واقعاً در کلاس عملیاتی بود.", author: "مدیر زیرساخت فناوری", company: "طراحی FIDS فرودگاه کیش", color: IMESSAGE_BLUE },
  { id: 3, content: "ایدهٔ حذف واسطه میان صیاد و مشتری را داشتیم، اما راه اجرایش را نه. از معماری فنی تا تجربهٔ کاربری همراهمان بودند تا نخستین بازار آنلاین محصولات دریایی واقعاً شکل گرفت.", author: "بنیان‌گذار", company: "پلتفرم مالاتا", color: IMESSAGE_BLUE },
  { id: 4, content: "برای یک مجموعهٔ لوکس، هویت بصری همه‌چیز است. طراحی مینیمال و دقیقی که برای باشگاه و سیستم مدیریت مشتریانمان انجام شد، دقیقاً همان حسی را منتقل می‌کند که می‌خواستیم.", author: "مدیر برند", company: "باشگاه رویال اقدسیه", color: IMESSAGE_BLUE },
  { id: 5, content: "پلتفرم آموزش آنلاینمان به رابطی نیاز داشت که هم برای استاد و هم دانشجو ساده باشد. نتیجه فراتر از انتظارمان بود و تعامل کاربران به‌روشنی افزایش پیدا کرد.", author: "مدیر محصول", company: "سایت درسو", color: IMESSAGE_BLUE },
  { id: 6, content: "می‌خواستیم خودروهای تیونینگ‌شده‌مان را در سطحی جهانی معرفی کنیم. پیکربندی سه‌بعدی و طراحی بی‌نقصی که تحویل گرفتیم، دقیقاً در شأن یک برند بین‌المللی بود.", author: "مدیر بازاریابی", company: "سایت تیونینگ کیوانی", color: IMESSAGE_BLUE }
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <Section sectionRef={sectionRef} id="testimonials" className="border-t border-border bg-transparent">
      <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <MessageSquare className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
      </motion.div>

      <Heading subtitle="برترین‌ها">اعتماد</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: index * 0.1 }}
            className="flex flex-col h-full"
          >
            <Card
              glowColor={t.color}
              roundedClass="rounded-[2.5rem] rounded-bl-lg"
              className="flex-1"
              maskedContent={<ReactiveQuote />}
              colorOnHoverOnly
            >
              <p style={{ transform: "translateZ(30px)" }} className="text-sm md:text-base font-medium font-sans leading-relaxed text-foreground text-right relative z-10">
                «{t.content}»
              </p>
            </Card>

            <div className="mt-6 flex flex-row-reverse items-center justify-start gap-3 px-4 w-full">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-secondary-foreground shrink-0 shadow-lg bg-secondary">
                <User className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold font-display text-sm text-foreground leading-tight">{t.author}</div>
                <div className="text-xs font-bold text-muted-foreground mt-1 font-display">{t.company}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}