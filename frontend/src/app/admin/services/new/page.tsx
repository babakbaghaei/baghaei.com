'use client';

import React from 'react';
import Link from 'next/link';
import { createService } from '../actions';
import { Card } from '../../../../components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Layout';

const ICONS = [
  'SearchCode', 'Share2', 'Code2', 'ShieldCheck', 'Infinity', 'TrendingUp', 
  'Zap', 'Database', 'Cloud', 'Server', 'Smartphone', 'Globe'
];

export default function NewServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <Link href="/admin/services" className="text-muted-foreground hover:text-foreground text-sm mb-4 block font-display">
            ← بازگشت به لیست خدمات
          </Link>
          <Heading>افزودن خدمت جدید</Heading>
        </header>

        <Card className="p-8">
          <form action={createService} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold font-display">عنوان خدمت</label>
              <input 
                name="title" 
                required 
                className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="مثلاً: توسعه اپلیکیشن موبایل"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold font-display">توضیحات</label>
              <textarea 
                name="description" 
                required 
                rows={4}
                className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="توضیحات کوتاه درباره خدمت..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold font-display">ترتیب نمایش</label>
                <input 
                  name="order" 
                  type="number" 
                  defaultValue={0}
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold font-display">آیکون</label>
                <select 
                  name="iconName" 
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  {ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full py-4 text-lg">
                ثبت خدمت
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
