'use client';

import React from "react";
import { motion } from "framer-motion";

const items = [
  "NEXT.JS", "NESTJS", "TYPESCRIPT", "KUBERNETES", "DOCKER", "AWS", "SYSTEM ARCHITECTURE",
  "CYBERSECURITY", "AI & ML", "SCALABILITY", "UX DESIGN", "ENTERPRISE SOLUTIONS"
];

export default function TechMarquee() {
  return (
    <div className="relative flex overflow-x-hidden border-y border-white/5 bg-black py-10">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="mx-12 flex items-center gap-4">
            <span className="text-4xl md:text-6xl font-black text-transparent stroke-white/20 stroke-1 font-display" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
              {item}
            </span>
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
