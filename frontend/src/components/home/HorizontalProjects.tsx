'use client';

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import Image from "next/link";
import { ArrowLeft } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
}

const projects: Project[] = [
  { id: 1, title: "پلتفرم راورو", description: "بزرگترین پلتفرم باگ‌بانتی ملی", category: "Cybersecurity" },
  { id: 2, title: "سامانه مالاتا", description: "بازار هوشمند محصولات دریایی", category: "E-commerce" },
  { id: 3, title: "رویال اقدسیه", description: "مدیریت هوشمند مجتمع‌های لوکس", category: "PropTech" },
  { id: 4, title: "دستیار مالی", description: "سیستم مدیریت تراکنش‌های ارزی", category: "FinTech" },
];

export default function HorizontalProjects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-20 right-20 z-10">
            <span className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4 block">نمونه کارهای برتر</span>
            <h2 className="text-6xl md:text-8xl font-black font-display text-white">پروژه‌های شاخص</h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-12 px-20">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative h-[450px] w-[450px] md:h-[600px] md:w-[800px] overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm flex flex-col justify-end p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Decorative Number */}
              <span className="absolute top-10 left-10 text-9xl font-black text-white/5 font-display select-none">
                0{project.id}
              </span>

              <div className="relative z-20 space-y-4">
                <span className="text-primary font-mono text-xs uppercase tracking-widest">{project.category}</span>
                <h3 className="text-4xl md:text-6xl font-black font-display text-white group-hover:translate-x-2 transition-transform duration-500">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-lg max-w-md font-display opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                  {project.description}
                </p>
                <div className="pt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="inline-flex items-center gap-2 text-white font-bold font-display border-b border-white/20 pb-2">
                        مشاهده جزئیات <ArrowLeft className="w-4 h-4" />
                    </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Final Call to Action Card */}
          <div className="h-[450px] w-[450px] md:h-[600px] md:w-[600px] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-8">
             <h3 className="text-3xl font-bold font-display text-zinc-500">پروژه بعدی شما؟</h3>
             <button className="px-12 py-6 bg-white text-black rounded-full font-bold font-display hover:scale-105 transition-transform">
                شروع گفتگو
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
