'use client';

import React, { useRef, useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion';

export default function Magnetic({ children, intensity = 0.3 }: { children: React.ReactNode, intensity?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        
        const { clientX, clientY } = e;
        const rect = ref.current.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        
        x.set(distanceX * intensity);
        y.set(distanceY * intensity);
    }, [intensity, x, y]);

    const reset = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            style={{ x, y }}
            className="inline-block relative z-50 p-12 -m-12" // Increased magnetic hit area
        >
            {children}
        </motion.div>
    )
}