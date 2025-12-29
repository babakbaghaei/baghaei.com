'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section } from '../ui/Layout';
import * as Icons from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/format';

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">
      {services.map((service, index) => {
        const Icon = (Icons as any)[service.iconName] || Icons.HelpCircle;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group flex flex-col items-start gap-3"
          >
            {/* Title & Icon Row */}
            <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-500">
              <Icon className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={1.2} />
              <h3 className="text-base md:text-lg font-bold font-display text-zinc-200 group-hover:text-white">
                {service.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-zinc-500 text-xs md:text-sm font-display leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
              {service.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}