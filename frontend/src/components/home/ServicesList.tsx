'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Section, Heading } from '../ui/Layout';
import { Card, useCardTilt } from '../ui/Card';
import * as Icons from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';

// Dynamic Icon Component
const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  const { tiltX, tiltY } = useCardTilt();
 
  const hX = useTransform(tiltX, [-0.5, 0.5], [10, -10]);
  const hY = useTransform(tiltY, [-0.5, 0.5], [10, -10]);
  const sX = useTransform(tiltX, [-0.5, 0.5], [-15, 15]);
  const sY = useTransform(tiltY, [-0.5, 0.5], [-15, 15]);
  
  const hOpacity = useTransform(tiltX, [-0.5, 0, 0.5], [0.6, 0.1, 0.6]);
  const iconScale = useTransform(tiltX, [-0.5, 0.5], [0.9, 0.8]);

  const filter = useMotionTemplate`drop-shadow(${hX}px ${hY}px 4px rgba(255,255,255,${hOpacity})) drop-shadow(${sX}px ${sY}px 20px rgba(0,0,0,0.95))`;

  return (
    <motion.div 
      className="absolute -bottom-8 -left-8 opacity-[0.12] pointer-events-none"
      style={{ 
        transform: "translateZ(20px) rotate(12deg)",
        scale: iconScale,
        filter
      }}
    >
      <Icon className="w-64 h-64 text-foreground" strokeWidth={2} />
    </motion.div>
  );
};

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export default function ServicesList({ services }: { services: Service[] }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ 
    target: sectionRef, 
    offset: ["start end", "end start"] 
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <Section sectionRef={sectionRef} id="services" className="border-t border-border">
      {/* Section Background Icon */}
      <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <Icons.Layers className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-muted-foreground" strokeWidth={0.5} />
      </motion.div>

      <Heading subtitle="خدمات">تخصص و</Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ 
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.215, 0.61, 0.355, 1]
            }}
          >
            <Card 
              className="group h-full" 
              glowColor="rgba(148, 163, 184, 0.3)"
              maskedContent={<DynamicIcon name={service.iconName} />}
            >
              <div 
                style={{ transform: "translateZ(40px)" }} 
                className="text-sm font-bold font-display text-muted-foreground mb-8 group-hover:text-foreground transition-colors"
              >
                {toPersianDigits(String(index + 1).padStart(2, '0'))}
              </div>
              <div style={{ transformStyle: "preserve-3d" }} className="space-y-4">
                <h3 
                  style={{ transform: "translateZ(30px)" }} 
                  className="text-2xl font-bold font-display text-foreground"
                >
                  {service.title}
                </h3>
                <p 
                  style={{ transform: "translateZ(15px)" }} 
                  className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors"
                >
                  {service.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
