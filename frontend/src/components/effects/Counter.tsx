'use client';

import React, { useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { useRef } from 'react';

interface CounterProps {
  value: string;
}

export function Counter({ value }: CounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix (e.g., "10+" -> number: 10, suffix: "+")
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, numericPart, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          let formatted;
          if (value.includes('%')) {
            formatted = latest.toFixed(1);
          } else {
            formatted = Math.floor(latest).toString();
          }
          setDisplayValue(formatted.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, numericPart, value]);

  return (
    <span ref={ref} className="font-display inline-flex flex-row-reverse items-center justify-end" dir="ltr">
      <span>{suffix.replace(/\+/g, '+').replace(/%/g, '٪')}</span>
      <span>{displayValue}</span>
    </span>
  );
}
