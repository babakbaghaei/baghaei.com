'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, Plus, Trash, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AdminInput, AdminTextarea } from './AdminField';

interface ProjectFormProps {
 initialData?: any;
 isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEditing }) => {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [formData, setFormData] = useState({
  title: initialData?.title || '',
  category: initialData?.category || '',
  role: initialData?.role || '',
  desc: initialData?.desc || '',
  imageUrl: initialData?.imageUrl || '',
  color: initialData?.color || 'rgba(255,255,255,0.1)',
  borderColor: initialData?.borderColor || 'rgba(255,255,255,0.2)',
  isLocked: initialData?.isLocked ?? true,
  metrics: initialData?.metrics || [{ label: '', value: '' }]
 });

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  setFeedback(null);
  try {
   const fd = new FormData();
   fd.append('file', file);
   const res = (await api.upload('/upload/image', fd)) as { data: { url: string } };
   setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
  } catch {
   setFeedback({ type: 'error', text: 'خطا در آپلود تصویر.' });
  } finally {
   setUploading(false);
   if (fileInputRef.current) fileInputRef.current.value = '';
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setFeedback(null);
  try {
   if (isEditing) {
    await api.put(`/projects/${initialData.id}`, formData);
   } else {
    await api.post('/projects', formData);
   }
   setFeedback({ type: 'success', text: 'اطلاعات با موفقیت ذخیره شد.' });
   router.push('/admin/projects');
   router.refresh();
  } catch {
   setFeedback({ type: 'error', text: 'خطا در ذخیره اطلاعات.' });
  } finally {
   setLoading(false);
  }
 };

 const addMetric = () => {
  setFormData({ ...formData, metrics: [...formData.metrics, { label: '', value: '' }] });
 };

 const removeMetric = (index: number) => {
  const newMetrics = [...formData.metrics];
  newMetrics.splice(index, 1);
  setFormData({ ...formData, metrics: newMetrics });
 };

 const updateMetric = (index: number, field: string, value: string) => {
  const newMetrics = [...formData.metrics];
  newMetrics[index] = { ...newMetrics[index], [field]: value };
  setFormData({ ...formData, metrics: newMetrics });
 };

 return (
  <form onSubmit={handleSubmit} className="space-y-8">
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Main Info */}
    <Card className="space-y-6">
     <h3 className="text-xl font-bold font-display">اطلاعات اصلی</h3>
     <div className="space-y-4">
      <AdminInput
       id="project-title" label="عنوان پروژه" type="text" value={formData.title}
       onChange={(e) => setFormData({...formData, title: e.target.value})}
       required
      />
      <AdminInput
       id="project-category" label="دسته‌بندی" type="text" value={formData.category}
       onChange={(e) => setFormData({...formData, category: e.target.value})}
       required
      />
      <AdminInput
       id="project-role" label="نقش" type="text" value={formData.role}
       onChange={(e) => setFormData({...formData, role: e.target.value})}
       required
      />
      <AdminTextarea
       id="project-desc" label="توضیحات" rows={4} value={formData.desc}
       onChange={(e) => setFormData({...formData, desc: e.target.value})}
       required
      />
     </div>
    </Card>

    {/* Appearance & Metrics */}
    <div className="space-y-8">
     <Card className="space-y-6">
      <h3 className="text-xl font-bold font-display">ظاهر و وضعیت</h3>
      <div className="grid grid-cols-2 gap-4">
       <AdminInput
        id="project-color" label="رنگ اصلی" type="text" dir="ltr" value={formData.color}
        onChange={(e) => setFormData({...formData, color: e.target.value})}
       />
       <AdminInput
        id="project-border-color" label="رنگ حاشیه" type="text" dir="ltr" value={formData.borderColor}
        onChange={(e) => setFormData({...formData, borderColor: e.target.value})}
       />
      </div>
      <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-xl border border-border">
       <input
        type="checkbox" checked={formData.isLocked}
        onChange={(e) => setFormData({...formData, isLocked: e.target.checked})}
        className="w-5 h-5 accent-primary"
       />
       <span className="text-sm font-display">پروژه قفل باشد (در حال توسعه)</span>
      </div>
     </Card>

     <Card className="space-y-6">
      <h3 className="text-xl font-bold font-display">تصویر پروژه</h3>
      <div className="flex items-center gap-5">
       <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-border bg-foreground/5 flex items-center justify-center shrink-0">
        {formData.imageUrl ? (
         <Image src={formData.imageUrl} alt="پیش‌نمایش تصویر پروژه" fill sizes="112px" className="object-cover" />
        ) : (
         <ImageIcon className="w-7 h-7 text-muted-foreground/40" />
        )}
       </div>
       <div className="flex-1 space-y-3">
        <input
         ref={fileInputRef}
         type="file"
         accept="image/*"
         onChange={handleUpload}
         className="hidden"
         id="project-image-upload"
        />
        <button
         type="button"
         onClick={() => fileInputRef.current?.click()}
         disabled={uploading}
         className="inline-flex items-center gap-2 rounded-xl bg-foreground/5 border border-border px-4 py-2.5 text-sm font-display hover:bg-foreground/10 transition-colors disabled:opacity-50"
        >
         {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
         {uploading ? 'در حال آپلود...' : 'آپلود تصویر'}
        </button>
        <input
         type="text"
         value={formData.imageUrl}
         onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
         placeholder="یا آدرس تصویر را وارد کنید"
         dir="ltr"
         className="w-full bg-foreground/5 border border-border rounded-xl p-3 text-xs text-foreground outline-none"
        />
       </div>
      </div>
     </Card>

     <Card className="space-y-6">
      <div className="flex justify-between items-center">
       <h3 className="text-xl font-bold font-display">شاخص‌های کلیدی</h3>
       <button type="button" onClick={addMetric} className="p-2 bg-foreground/5 rounded-lg hover:bg-foreground/10 text-muted-foreground">
        <Plus className="w-4 h-4" />
       </button>
      </div>
      <div className="space-y-4">
       {formData.metrics.map((metric: any, index: number) => (
        <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
         <div className="flex-1">
          <input
           aria-label="برچسب" placeholder="برچسب" value={metric.label}
           onChange={(e) => updateMetric(index, 'label', e.target.value)}
           className="w-full bg-foreground/5 border border-border rounded-xl p-3 text-xs text-foreground outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
          />
         </div>
         <div className="flex-1">
          <input
           aria-label="مقدار" placeholder="مقدار" value={metric.value}
           onChange={(e) => updateMetric(index, 'value', e.target.value)}
           className="w-full bg-foreground/5 border border-border rounded-xl p-3 text-xs text-foreground outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
          />
         </div>
         <button type="button" onClick={() => removeMetric(index)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
          <Trash className="w-4 h-4" />
         </button>
        </div>
       ))}
      </div>
     </Card>
    </div>
   </div>

   <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4 border-t border-border pt-8">
    {feedback && (
     <p
      role="alert"
      aria-live="polite"
      className={`text-sm font-display me-auto ${feedback.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}
     >
      {feedback.text}
     </p>
    )}
    <Button
     type="button" variant="outline"
     onClick={() => router.push('/admin/projects')}
    >
     انصراف
    </Button>
    <Button type="submit" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
     {isEditing ? 'بروزرسانی پروژه' : 'انتشار پروژه'}
    </Button>
   </div>
  </form>
 );
};
