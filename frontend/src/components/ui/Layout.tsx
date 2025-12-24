'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'right' | 'left' | 'center';
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  subtitle, 
  className = "", 
  align = 'right' 
}) => {
  const alignmentClasses = {
    right: "text-right items-end",
    left: "text-left items-start",
    center: "text-center items-center"
  };

  return (
    <div className={`flex flex-col gap-6 mb-20 ${alignmentClasses[align]} ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        className="h-[2px] bg-white"
      />
      <h2 className="text-5xl md:text-8xl font-bold weight-plus-1 font-display text-white leading-none uppercase">
        {children}
        {subtitle && (
          <>
            <br />
            <span className="text-zinc-800">{subtitle}.</span>
          </>
        )}
      </h2>
    </div>
  );
};

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = "", containerClassName = "" }) => {
  return (
    <section id={id} className={`py-40 relative overflow-hidden transition-colors duration-700 ${className}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-16 relative z-10 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};
