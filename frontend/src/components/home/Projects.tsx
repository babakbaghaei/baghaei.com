'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { Project, ProjectCard } from '../ui/ProjectCard';
import { Section, Heading } from '../ui/Layout';
import { PROJECTS_DATA } from '@/lib/data/projects';
import { ArrowLeft, Box } from 'lucide-react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
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
    <Section sectionRef={sectionRef} id="projects" className="overflow-visible !px-0">
      <motion.div style={{ y: bgY }} className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
        <Box className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-white" strokeWidth={0.5} />
      </motion.div>

      <div className="px-6 lg:px-16">
        <Heading subtitle="منتخب">پروژه‌های</Heading>
      </div>

      <div className="relative group/projects-container">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-20 pr-4 md:pr-8 pl-12 md:pl-48 no-scrollbar relative z-10 gap-0"
        >
          {PROJECTS_DATA.map((p) => (
            <ProjectCard 
              key={p.id} 
              project={p} 
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
        

      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}
