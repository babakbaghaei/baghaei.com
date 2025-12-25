'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';
import { PROJECTS_DATA } from '@/lib/data/projects';
import { ArrowLeft, Box } from 'lucide-react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Use GLOBAL scroll to avoid hydration issues with refs
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const absScroll = Math.abs(scrollLeft);
      const maxScroll = scrollWidth - clientWidth;
      setCanScrollLeft(absScroll < maxScroll - 10);
      setCanScrollRight(absScroll > 10);
    }
  };

  const selectedProjects = PROJECTS_DATA.slice(0, 4);
  const otherProjects = PROJECTS_DATA.slice(4);

  return (
    <Section id="projects" className="border-t border-zinc-900 overflow-visible !pb-20">
      <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-white" strokeWidth={0.5} />
      </motion.div>

      <Heading subtitle="منتخب">پروژه‌های</Heading>

      <div className="relative group/projects-container mb-20 -mr-2 md:-mr-4">
        {/* Scroller Fades - Dynamic based on scroll position */}
        <div 
          className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} 
        />
        <div 
          className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} 
        />

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-20 no-scrollbar relative z-10 gap-0"
        >
          {selectedProjects.map((p) => (
            <div key={p.id} className="w-[280px] md:w-[320px] h-[420px] md:h-[480px] shrink-0">
              <ProjectCard 
                project={p} 
                onClick={() => setSelectedProject(p)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Other Projects Section */}
      <div className="w-full mt-0 mb-0 relative z-10 -mx-1 md:-mx-2">
        <div className="flex items-center gap-6 mb-12 opacity-50 px-1 md:px-2">
           <div className="h-[1px] bg-white/20 flex-1" />
           <h4 className="text-white/60 font-display text-xs md:text-sm uppercase tracking-widest font-bold">دیگر پروژه‌ها</h4>
           <div className="h-[1px] bg-white/20 flex-1" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {otherProjects.map(p => (
            <div key={p.id} className="aspect-square">
              <ProjectCard 
                project={p} 
                onClick={() => setSelectedProject(p)}
                compact
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}