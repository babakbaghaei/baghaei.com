'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Project } from '@/components/ui/ProjectCard';

export default function AdminProjects() {
 const [projects, setProjects] = useState<Project[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProjects();
 }, []);

 const fetchProjects = async () => {
  try {
   const res = await api.get('/projects');
   setProjects(res.data || []);
  } catch (error) {
   console.error('Failed to fetch projects');
  } finally {
   setLoading(false);
  }
 };

 const handleDelete = async (id: number) => {
  if (!confirm('آیا از حذف این پروژه مطمئن هستید؟')) return;
  try {
   await api.delete(`/projects/${id}`);
   setProjects(projects.filter(p => p.id !== id));
  } catch (error) {
   alert('خطا در حذف پروژه');
  }
 };

 return (
  <div className="min-h-screen bg-black text-white p-8 md:p-20">
   <div className="max-w-7xl mx-auto space-y-12">
    <header className="flex justify-between items-center border-b border-white/10 pb-8">
     <div className="flex items-center gap-4">
      <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
       <ArrowRight className="w-6 h-6" />
      </Link>
      <h1 className="text-3xl font-black font-display uppercase">مدیریت پروژه‌ها</h1>
     </div>
     <Link href="/admin/projects/new">
      <Button leftIcon={<Plus className="w-4 h-4" />}>پروژه جدید</Button>
     </Link>
    </header>

    {loading ? (
     <div className="text-center py-20 text-zinc-500 font-display">در حال بارگذاری...</div>
    ) : (
     <div className="grid grid-cols-1 gap-6">
      {projects.map((project) => (
       <Card key={project.id} className="group !p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-6 text-right w-full">
          <div 
           className="w-16 h-16 rounded-2xl shrink-0"
           style={{ backgroundColor: project.color }}
          />
          <div className="space-y-1">
           <h3 className="text-xl font-bold font-display">{project.title}</h3>
           <p className="text-zinc-500 text-xs font-display">{project.category}</p>
          </div>
         </div>
         
         <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Link href={`/admin/projects/${project.id}`}>
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all">
            <Edit3 className="w-4 h-4" />
           </button>
          </Link>
          <button 
           onClick={() => handleDelete(project.id)}
           className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600 transition-all text-red-500 hover:text-white"
          >
           <Trash2 className="w-4 h-4" />
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${project.isLocked ? 'bg-zinc-800 text-zinc-500' : 'bg-green-900/30 text-green-500'}`}>
           {project.isLocked ? 'Locked' : 'Published'}
          </span>
         </div>
        </div>
       </Card>
      ))}
     </div>
    )}
   </div>
  </div>
 );
}
