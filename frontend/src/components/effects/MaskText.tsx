'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function MaskText({ phrases, className = "" }: { phrases: string[], className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.75, once: true });

  const animation = {
    initial: { y: "100%" },
    enter: (i: number) => ({ 
        y: "0", 
        transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * i } 
    })
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <motion.p
            custom={index}
            variants={animation}
            initial="initial"
            animate={isInView ? "enter" : "initial"}
            className="m-0"
          >
            {phrase}
          </motion.p>
        </div>
      ))}
    </div>
  );
}