'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  SearchCode,
  Share2,
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Globe,
  Shield,
  TrendingUp,
  Palette,
  Code,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '../ui/Card';

// Named-import map for the dynamic `iconName` lookup. Importing only the icons
// actually referenced (static fallback list + backend seed values) keeps the
// whole lucide-react set out of the bundle. Add a new entry here if the backend
// starts returning a different icon name.
const ICONS: Record<string, LucideIcon> = {
  SearchCode,
  Share2,
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Globe,
  Shield,
  TrendingUp,
  Palette,
  Code,
};

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
      {services.map((service, index) => (
        <ServiceItem 
          key={service.id} 
          service={service} 
          index={index}
        />
      ))}
    </div>
  );
}

function ServiceItem({ service, index }: { service: Service, index: number }) {
  const Icon = ICONS[service.iconName] || HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card
        roundedClass="rounded-[1.75rem]"
        className="p-2 md:p-3"
        contentClassName="p-6 md:p-7"
        isHoverable
        colorOnHoverOnly
      >
        <div className="flex flex-col items-start gap-3 text-right" dir="rtl" style={{ transformStyle: "preserve-3d" }}>
          <div className="flex items-center gap-3 transition-colors duration-500 text-foreground group-hover:text-primary" style={{ transform: "translateZ(40px)" }}>
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-500 group-hover:scale-110" strokeWidth={1.2} />
            <h3 className="text-base md:text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors duration-500">
              {service.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm font-display leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: "translateZ(20px)" }}>
            {service.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}