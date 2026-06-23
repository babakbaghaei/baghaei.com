'use client';

import React, { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { Section, Heading } from '@/components/ui/Layout';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { PROJECTS_DATA } from '@/lib/data/projects';
import ProjectModal from '@/components/home/ProjectModal';
import { Project } from '@/components/ui/ProjectCard';
import { Card } from '@/components/ui/Card';

// Hidden (NDA) projects are excluded from every public listing.
const VISIBLE_PROJECTS = PROJECTS_DATA.filter((project) => !project.hidden);

const ALL_FILTER = 'همه';

export default function ProjectsGrid() {
 const [selectedProject, setSelectedProject] = useState<Project | null>(null);
 const [originRect, setOriginRect] = useState<DOMRect | null>(null);
 const [activeCategory, setActiveCategory] = useState<string>(ALL_FILTER);

 // Derive the chip list from the projects' categories (deduped, in source order).
 const categories = useMemo(
  () => [ALL_FILTER, ...Array.from(new Set(VISIBLE_PROJECTS.map((p) => p.category).filter(Boolean)))],
  [],
 );

 const filteredProjects = useMemo(
  () =>
   activeCategory === ALL_FILTER
    ? VISIBLE_PROJECTS
    : VISIBLE_PROJECTS.filter((p) => p.category === activeCategory),
  [activeCategory],
 );

 const openProject = (p: Project, e: React.MouseEvent<HTMLDivElement>) => {
  // Measure the clean, untransformed card frame so the modal grows out of the
  // clicked card's true on-screen rectangle (mirrors the homepage slider).
  const frame = (e.currentTarget as HTMLElement).closest('[data-project-frame]') as HTMLElement | null;
  setOriginRect((frame ?? e.currentTarget).getBoundingClientRect());
  setSelectedProject(p);
 };

 return (
  <>
   <Section className="pt-48 pb-20">
    <Heading subtitle="تمام آثار">پروژه‌های</Heading>

    {VISIBLE_PROJECTS.length > 0 && categories.length > 2 && (
     <div className="mt-12 flex flex-wrap justify-center gap-2.5" dir="rtl" role="group" aria-label="فیلتر دسته‌بندی">
      {categories.map((cat) => {
       const isActive = cat === activeCategory;
       return (
        <button
         key={cat}
         type="button"
         onClick={() => setActiveCategory(cat)}
         aria-pressed={isActive}
         data-test="project-filter"
         className={`rounded-full border px-4 py-1.5 text-xs font-display transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[44px] ${
          isActive
           ? 'border-primary/50 bg-primary/10 text-primary'
           : 'border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/30'
         }`}
        >
         {cat}
        </button>
       );
      })}
     </div>
    )}

    {VISIBLE_PROJECTS.length === 0 ? (
     <div className="mt-20 mx-auto max-w-xl">
      <Card
       roundedClass="rounded-[2rem]"
       className="p-2 md:p-3"
       contentClassName="p-12 md:p-16"
       isHoverable={false}
      >
       <div className="flex flex-col items-center justify-center gap-5 text-center" dir="rtl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
         <Lock className="h-7 w-7" strokeWidth={1.6} />
        </div>
        <h3 className="text-2xl font-bold font-display text-foreground">
         نمونه‌کاری برای نمایش عمومی موجود نیست
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
         بخشی از پروژه‌های ما تحت توافق‌نامه‌های محرمانگی (NDA) قرار دارند. برای آشنایی با سوابق ما مستقیماً در تماس باشید.
        </p>
       </div>
      </Card>
     </div>
    ) : (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-16 mt-20 justify-items-center">
      {filteredProjects.map((project) => (
       <div key={project.id} data-project-frame className="w-full max-w-[360px] min-h-[360px] md:min-h-[380px]">
        <ProjectCard
         project={project}
         onClick={(e) => openProject(project, e)}
        />
       </div>
      ))}
     </div>
    )}
   </Section>

   <ProjectModal
    project={selectedProject}
    originRect={originRect}
    isOpen={!!selectedProject}
    onClose={() => setSelectedProject(null)}
   />
  </>
 );
}
