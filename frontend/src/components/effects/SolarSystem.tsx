'use client';

import React from 'react';
import { motion } from 'framer-motion';

const planets = [
  { size: 8, color: '#FFD700', distance: 60, speed: 2, label: 'Core' }, // Mercury style
  { size: 12, color: '#FFA500', distance: 100, speed: 1.5, label: 'Scalability' }, // Venus style
  { size: 14, color: '#00BFFF', distance: 150, speed: 1, label: 'Security' }, // Earth style
  { size: 10, color: '#FF4500', distance: 200, speed: 0.8, label: 'Speed' }, // Mars style
  { size: 24, color: '#DEB887', distance: 280, speed: 0.5, label: 'AI' }, // Jupiter style
];

export default function SolarSystem() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Sun / Core */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-20 h-20 rounded-full bg-primary/20 blur-2xl z-0"
      />
      <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-primary/40 shadow-[0_0_40px_rgba(34,197,94,0.4)] z-10" />

      {/* Orbits & Planets */}
      {planets.map((planet, index) => (
        <div key={index} className="absolute inset-0 flex items-center justify-center">
          {/* Orbit Line */}
          <div 
            className="absolute border border-white/5 rounded-full"
            style={{ 
              width: planet.distance * 2, 
              height: planet.distance * 2 
            }}
          />
          
          {/* Planet Container (Rotates) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 / planet.speed,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute"
            style={{ width: planet.distance * 2, height: planet.distance * 2 }}
          >
            {/* Planet */}
            <div 
              className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center gap-2"
              style={{ transform: `translateX(-50%)` }}
            >
              <div 
                className="rounded-full shadow-lg"
                style={{ 
                  width: planet.size, 
                  height: planet.size, 
                  backgroundColor: planet.color,
                  boxShadow: `0 0 15px ${planet.color}66`
                }}
              />
              <span className="text-[8px] font-mono uppercase tracking-tighter text-zinc-500 whitespace-nowrap opacity-0 md:opacity-100">
                {planet.label}
              </span>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
