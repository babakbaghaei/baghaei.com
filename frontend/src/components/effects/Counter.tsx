'use client';

import React, { useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { useRef } from 'react';

interface CounterProps {
  value: string;
}

export function Counter({ value }: CounterProps) {
  const [displayValue, setDisplayValue] = useState('۰');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Normalize value: convert Persian digits to English for calculation
  const strValue = value ? value.toString() : '0';
  const normalized = strValue.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  const numericPart = parseFloat(normalized.replace(/[^0-9.]/g, '')) || 0;
  const suffix = strValue.replace(/[0-9.۰-۹]/g, '');

  useEffect(() => {
    if (isInView && !isNaN(numericPart)) {
      const controls = animate(0, numericPart, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          const val = Math.floor(latest);
          setDisplayValue(val.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, numericPart]);

  return (
    <span ref={ref} className="font-display">
      {displayValue}{suffix}
    </span>
  );
}
