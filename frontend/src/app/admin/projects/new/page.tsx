'use client';

import React from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
 return (
  <div className="space-y-12">
   <header className="border-b border-border pb-8">
    <h1 className="text-3xl font-black font-display uppercase">ایجاد پروژه جدید</h1>
   </header>
   <ProjectForm />
  </div>
 );
}
