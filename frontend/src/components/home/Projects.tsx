'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Box } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';
import { PROJECTS_DATA } from '@/lib/data/projects';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Global Mouse Tracking for Cross-Card Lighting
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const absScroll = Math.abs(scrollLeft);
      const maxScroll = scrollWidth - clientWidth;
      
      setCanScrollLeft(absScroll < maxScroll - 10);
      setCanScrollRight(absScroll > 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const multiplier = direction === 'left' ? -1 : 1;
      scrollContainerRef.current.scrollBy({
        left: multiplier * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section id="projects">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0">
        <Box className="w-[600px] h-[600px] text-white" strokeWidth={0.5} />
      </div>

      <Heading subtitle="منتخب">پروژه‌های</Heading>

      <div className="relative overflow-hidden" onMouseMove={handleGlobalMouseMove}>
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-20 pl-8 md:pl-48 no-scrollbar relative z-10"
        >
          {PROJECTS_DATA.map((p) => (
            <ProjectCard 
              key={p.id} 
              project={p} 
              onClick={() => setSelectedProject(p)}
              globalMouseX={mouseX}
              globalMouseY={mouseY}
            />
          ))}
        </div>
        
        {/* Left Scroll Button */}
        <div 
          className={`absolute left-0 top-0 bottom-20 w-32 md:w-64 bg-gradient-to-r from-black via-black/60 to-transparent z-20 pointer-events-none flex items-center justify-start pl-6 transition-opacity duration-700 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
        >
          <motion.button 
            onClick={() => scroll('left')}
            className="pointer-events-auto"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        </div>

        {/* Right Scroll Button */}
        <div 
          className={`absolute right-0 top-0 bottom-20 w-32 md:w-64 bg-gradient-to-l from-black via-black/60 to-transparent z-20 pointer-events-none flex items-center justify-end pr-6 transition-opacity duration-700 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
        >
          <motion.button 
            onClick={() => scroll('right')}
            className="pointer-events-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white rotate-180" />
            </div>
          </motion.button>
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}
