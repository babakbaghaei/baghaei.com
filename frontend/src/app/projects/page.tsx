'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Section, Heading } from '@/components/ui/Layout';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { PROJECTS_DATA } from '@/lib/data/projects';
import ProjectModal from '@/components/home/ProjectModal';
import { Project } from '@/components/ui/ProjectCard';

export default function AllProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <Section className="pt-48 pb-20">
        <Heading subtitle="تمام آثار">پروژه‌های</Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-20">
          {PROJECTS_DATA.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
            />
          ))}
        </div>
      </Section>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      
      <Footer />
    </main>
  );
}
