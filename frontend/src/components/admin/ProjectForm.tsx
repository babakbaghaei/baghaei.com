'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Plus, Trash } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEditing }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    role: initialData?.role || '',
    desc: initialData?.desc || '',
    color: initialData?.color || 'rgba(255,255,255,0.1)',
    borderColor: initialData?.borderColor || 'rgba(255,255,255,0.2)',
    isLocked: initialData?.isLocked ?? true,
    metrics: initialData?.metrics || [{ label: '', value: '' }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/projects/${initialData.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      alert('خطا در ذخیره اطلاعات');
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
            <div>
              <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Project Title</label>
              <input 
                type="text" value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" required 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Category</label>
              <input 
                type="text" value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" required 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Role</label>
              <input 
                type="text" value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" required 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Description</label>
              <textarea 
                rows={4} value={formData.desc} 
                onChange={(e) => setFormData({...formData, desc: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-white transition-colors outline-none" required 
              />
            </div>
          </div>
        </Card>

        {/* Appearance & Metrics */}
        <div className="space-y-8">
          <Card className="space-y-6">
            <h3 className="text-xl font-bold font-display">ظاهر و وضعیت</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Primary Color</label>
                <input 
                  type="text" value={formData.color} 
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-zinc-500 font-black mb-2 block">Border Color</label>
                <input 
                  type="text" value={formData.borderColor} 
                  onChange={(e) => setFormData({...formData, borderColor: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none" 
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <input 
                type="checkbox" checked={formData.isLocked} 
                onChange={(e) => setFormData({...formData, isLocked: e.target.checked})}
                className="w-5 h-5 accent-white" 
              />
              <span className="text-sm font-display">پروژه قفل باشد (در حال توسعه)</span>
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold font-display">شاخص‌های کلیدی</h3>
              <button type="button" onClick={addMetric} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-zinc-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {formData.metrics.map((metric: any, index: number) => (
                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1">
                    <input 
                      placeholder="Label" value={metric.label} 
                      onChange={(e) => updateMetric(index, 'label', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none" 
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      placeholder="Value" value={metric.value} 
                      onChange={(e) => updateMetric(index, 'value', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none" 
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

      <div className="flex justify-end gap-4 border-t border-white/10 pt-8">
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
