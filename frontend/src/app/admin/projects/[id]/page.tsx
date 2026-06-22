'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { api } from '@/lib/api';

export default function EditProjectPage() {
 const { id } = useParams();
 const [project, setProject] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProject = async () => {
   try {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data);
   } catch {
    console.error('Failed to fetch project');
   } finally {
    setLoading(false);
   }
  };
  fetchProject();
 }, [id]);

 if (loading) return <div className="py-20 text-center font-display text-foreground">در حال بارگذاری...</div>;
 if (!project) return <div className="py-20 text-center font-display text-foreground">پروژه یافت نشد.</div>;

 return (
  <div className="space-y-12">
   <header className="border-b border-border pb-8">
    <h1 className="text-3xl font-black font-display uppercase">ویرایش پروژه</h1>
   </header>
   <ProjectForm initialData={project} isEditing />
  </div>
 );
}
