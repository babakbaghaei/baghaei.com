'use client';

import React from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black font-display uppercase">ایجاد پروژه جدید</h1>
        </header>
        <ProjectForm />
      </div>
    </div>
  );
}
