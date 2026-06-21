'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/utils/useReducedMotion';

export default function Magnetic({ children, disabled = false }: { children: React.ReactNode, disabled?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const shouldReduceMotion = usePrefersReducedMotion();

    const handleMouse = (e: React.MouseEvent) => {
        // Skip the magnetic pull for reduced-motion users — the wrapper still
        // renders its children, just without the cursor-following displacement.
        if (disabled || shouldReduceMotion) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    }

    const { x, y } = position;

    return (
        <motion.div
            style={{ position: 'relative' }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    )
}