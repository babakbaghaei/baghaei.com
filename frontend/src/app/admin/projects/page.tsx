'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, ExternalLink, FolderKanban, SearchX } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState, ListSkeleton } from '@/components/admin/EmptyState';
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

type StatusFilter = 'all' | 'published' | 'draft';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'published', label: 'منتشر شده' },
  { key: 'draft', label: 'پیش‌نویس' },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/projects') as { data: Project[] };
        setProjects(res.data);
      } catch {
        setFeedback({ type: 'error', text: 'خطا در دریافت پروژه‌ها.' });
      } finally {
        setLoading(false);
      }
    }
    void fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && !p.isLocked) ||
      (statusFilter === 'draft' && p.isLocked);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('این پروژه حذف شود؟')) return;
    const prev = projects;
    setDeletingId(id);
    setFeedback(null);
    // Optimistic removal — restore on failure.
    setProjects((p) => p.filter((proj) => proj.id !== id));
    try {
      await api.delete(`/projects/${id}`);
      setFeedback({ type: 'success', text: 'پروژه با موفقیت حذف شد.' });
    } catch {
      setProjects(prev);
      setFeedback({ type: 'error', text: 'خطا در حذف پروژه.' });
    } finally {
      setDeletingId(null);
    }
  };

  const hasProjects = projects.length > 0;
  const hasFilters = searchTerm.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-12">
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

        {feedback && (
          <p
            role="alert"
            aria-live="polite"
            className={`text-sm font-display ${feedback.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}
          >
            {feedback.text}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:items-center bg-secondary/30 p-2 rounded-2xl border border-border">
          <div className="relative flex-1 group">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="جستجو در نام پروژه یا دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-3 ps-12 pe-4 outline-none font-display text-sm"
            />
          </div>
          <div className="flex gap-1 shrink-0">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                variant={statusFilter === f.key ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-xl px-4"
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <ListSkeleton count={3} />
        ) : !hasProjects ? (
          <EmptyState
            icon={FolderKanban}
            title="هنوز پروژه‌ای ثبت نشده است"
            subtitle="اولین نمونه کار را اضافه کنید تا اینجا نمایش داده شود."
            action={
              <Link href="/admin/projects/new">
                <Button className="rounded-full gap-2">
                  <Plus className="w-4 h-4" />
                  پروژه جدید
                </Button>
              </Link>
            }
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="نتیجه‌ای یافت نشد"
            subtitle={hasFilters ? 'جستجو یا فیلتر را تغییر دهید.' : undefined}
          />
        ) : (
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
                      <span className={`text-xs px-3 py-1 rounded-full font-black tracking-wider ${project.isLocked ? 'bg-secondary text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                        {project.isLocked ? 'پیش‌نویس' : 'منتشر شده'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-display">{project.category} — {project.role}</p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/admin/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl px-4 py-5 border-border/50 hover:bg-foreground hover:text-background transition-all">
                        <Edit className="w-4 h-4 me-2" />
                        ویرایش
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl px-4 py-5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                      onClick={() => handleDelete(project.id)}
                      isLoading={deletingId === project.id}
                      aria-label="حذف پروژه"
                    >
                      <Trash2 className="w-4 h-4 me-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
