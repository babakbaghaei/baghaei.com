'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as Icons from 'lucide-react';

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export default function ServicesList({ services }: { services: Service[] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">
      {services.map((service, index) => (
        <ServiceItem 
          key={service.id} 
          service={service} 
          index={index} 
          scrollYProgress={scrollYProgress} 
        />
      ))}
    </div>
  );
}

function ServiceItem({ service, index, scrollYProgress }: { service: Service, index: number, scrollYProgress: any }) {
  const Icon = (Icons as any)[service.iconName] || Icons.HelpCircle;
  
  // Staggered parallax logic: Higher multiplier for lower indices (Right side)
  const multiplier = 4 - (index % 4);
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [20 * multiplier, -20 * multiplier]
  );

  return (
    <motion.div
      style={{ y }}
      className="group flex flex-col items-start gap-3"
    >
      <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-500">
        <Icon className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={1.2} />
        <h3 className="text-base md:text-lg font-bold font-display text-zinc-200 group-hover:text-white">
          {service.title}
        </h3>
      </div>

      <p className="text-zinc-500 text-xs md:text-sm font-display leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
        {service.description}
      </p>
    </motion.div>
  );
}
