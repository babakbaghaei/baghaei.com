'use client';

import React, { useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

interface CounterProps {
 value: string;
}

const toFa = (n: number) => Math.floor(n).toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

export function Counter({ value }: CounterProps) {
 const [displayValue, setDisplayValue] = useState('۰');
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true });
 const prefersReducedMotion = usePrefersReducedMotion();

 // Normalize value: convert Persian digits to English for calculation
 const strValue = value ? value.toString() : '0';
 const normalized = strValue.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
 const numericPart = parseFloat(normalized.replace(/[^0-9.]/g, '')) || 0;
 const suffix = strValue.replace(/[0-9.۰-۹]/g, '');

 useEffect(() => {
  // Reduced motion: no count-up tween — the final value is rendered directly.
  if (!isInView || isNaN(numericPart) || prefersReducedMotion) return;
  const controls = animate(0, numericPart, {
   duration: 2,
   ease: [0.16, 1, 0.3, 1] as any,
   onUpdate: (latest) => {
    setDisplayValue(toFa(latest));
   },
  });
  return () => controls.stop();
 }, [isInView, numericPart, prefersReducedMotion]);

 return (
  <span ref={ref} className="font-display">
   {prefersReducedMotion ? toFa(numericPart) : displayValue}{suffix}
  </span>
 );
}
