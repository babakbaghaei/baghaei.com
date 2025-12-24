'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TextDecrypt from '../effects/TextDecrypt';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const alignmentClasses = {
    right: "text-right items-start",
    left: "text-left items-end",
    center: "text-center items-center"
  };

  return (
    <div ref={ref} className={`flex flex-col gap-6 mb-20 ${alignmentClasses[align]} ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        className="h-[2px] bg-white"
      />
      <h2 className="text-5xl md:text-8xl font-bold weight-plus-1 font-display text-white leading-none uppercase">
        {typeof children === 'string' ? (
          <TextDecrypt text={children} trigger={isInView} />
        ) : (
          children
        )}
        {subtitle && (
          <>
            <br />
            <span className="text-zinc-800">
              <TextDecrypt text={`${subtitle}.`} trigger={isInView} delay={300} />
            </span>
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
