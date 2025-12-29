'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface Project {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  role: string;
  imageUrl?: string;
  isLocked: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/projects') as { data: Project[] };
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    }
    void fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-display text-white text-lg">در حال دریافت پروژه‌ها...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black font-display uppercase tracking-tight">پروژه‌ها</h1>
            <p className="text-muted-foreground font-display">مدیریت و ویرایش نمونه کارهای گروه فناوری بقایی</p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="rounded-full px-8 py-6 gap-2">
              <Plus className="w-5 h-5" />
              پروژه جدید
            </Button>
          </Link>
        </header>

        <div className="flex gap-4 items-center bg-secondary/30 p-2 rounded-2xl border border-border">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input 
              type="text" 
              placeholder="جستجو در نام پروژه یا دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-3 pr-12 pl-4 outline-none font-display text-sm"
            />
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl px-4">
            <Filter className="w-4 h-4 mr-2" />
            فیلتر
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-48 h-32 rounded-2xl bg-secondary/50 flex items-center justify-center relative overflow-hidden border border-border/50 text-right">
                  {project.imageUrl ? (
                    <Image 
                      src={project.imageUrl} 
                      alt={project.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <ExternalLink className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2 text-right">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold font-display">{project.title}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${project.isLocked ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-black'}`}>
                      {project.isLocked ? 'Draft' : 'Published'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-display">{project.category} — {project.role}</p>
                </div>

                <div className="flex gap-3">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="rounded-xl px-4 py-5 border-border/50 hover:bg-white hover:text-black transition-all">
                      <Edit className="w-4 h-4 mr-2" />
                      ویرایش
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="rounded-xl px-4 py-5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4 mr-2" />
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
