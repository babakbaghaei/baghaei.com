'use client';

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion';

export default function Magnetic({ children, intensity = 0.3 }: { children: React.ReactNode, intensity?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent) => {

            const { clientX, clientY } = e;

            const { height, width, left, top } = ref.current!.getBoundingClientRect();

            

            // Calculate distance from center

            const middleX = clientX - (left + width / 2)

            const middleY = clientY - (top + height / 2)

            

            // Apply intensity

            setPosition({ x: middleX * intensity, y: middleY * intensity })

        }

    

        const reset = () => {

            setPosition({ x: 0, y: 0 })

        }

    

        const { x, y } = position;

        return (

            <motion.div

                style={{ position: "relative", padding: "100px", margin: "-100px" }} // Invisible large hit area

                ref={ref}

                onMouseMove={handleMouseMove}

                onMouseLeave={reset}

                animate={{ x, y }}

                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}

            >

                {children}

            </motion.div>

        )

    }

    