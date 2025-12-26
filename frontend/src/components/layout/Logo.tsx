'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
 return (
  <div className={`${className} relative group flex items-center justify-center overflow-visible`}>
   <style jsx>{`
    @keyframes glitch-anim-1 {
     0% { clip-path: inset(20% 0 80% 0); transform: translate(-8px, 4px); }
     10% { clip-path: inset(60% 0 10% 0); transform: translate(8px, -4px); }
     20% { clip-path: inset(40% 0 50% 0); transform: translate(-10px, 8px); }
     30% { clip-path: inset(80% 0 5% 0); transform: translate(10px, -8px); }
     40% { clip-path: inset(10% 0 70% 0); transform: translate(-6px, 4px); }
     50% { clip-path: inset(30% 0 50% 0); transform: translate(6px, -4px); }
     60% { clip-path: inset(10% 0 70% 0); transform: translate(-8px, 4px); }
     70% { clip-path: inset(50% 0 30% 0); transform: translate(8px, -4px); }
     80% { clip-path: inset(20% 0 40% 0); transform: translate(-10px, 4px); }
     90% { clip-path: inset(60% 0 10% 0); transform: translate(10px, -4px); }
     100% { clip-path: inset(30% 0 50% 0); transform: translate(8px, -4px); }
    }
    @keyframes glitch-anim-2 {
     0% { clip-path: inset(10% 0 60% 0); transform: translate(8px, -4px); }
     10% { clip-path: inset(80% 0 5% 0); transform: translate(-8px, 8px); }
     20% { clip-path: inset(30% 0 20% 0); transform: translate(8px, 4px); }
     30% { clip-path: inset(10% 0 80% 0); transform: translate(-4px, -8px); }
     40% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 4px); }
     50% { clip-path: inset(70% 0 10% 0); transform: translate(-8px, 4px); }
     60% { clip-path: inset(20% 0 60% 0); transform: translate(8px, -4px); }
     70% { clip-path: inset(60% 0 20% 0); transform: translate(-8px, 4px); }
     80% { clip-path: inset(40% 0 40% 0); transform: translate(4px, -8px); }
     90% { clip-path: inset(80% 0 10% 0); transform: translate(-4px, 8px); }
     100% { clip-path: inset(70% 0 10% 0); transform: translate(-8px, 4px); }
    }
    .group:hover .glitch-layer-1 {
     animation: glitch-anim-1 0.2s infinite linear alternate-reverse;
     opacity: 1;
    }
    .group:hover .glitch-layer-2 {
     animation: glitch-anim-2 0.2s infinite linear alternate-reverse;
     opacity: 1;
    }
   `}</style>

   {/* Glitch Layer 1 */}
   <img 
    src="/logo.svg" 
    alt=""
    className="glitch-layer-1 absolute inset-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none transition-opacity duration-100 invert sepia(100%) saturate(500%) hue-rotate(280deg)"
   />

   {/* Glitch Layer 2 */}
   <img 
    src="/logo.svg" 
    alt=""
    className="glitch-layer-2 absolute inset-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none transition-opacity duration-100 invert sepia(100%) saturate(500%) hue-rotate(150deg)"
   />

   {/* Main Logo */}
   <img 
    src="/logo.svg" 
    alt="Logo" 
    className={`w-full h-full object-contain relative z-10 brightness-0 dark:invert`}
   />
  </div>
 );
}
