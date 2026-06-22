'use client';

import React from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { createService } from '../actions';
import { Card } from '../../../../components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Layout';
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/admin/AdminField';

const ICONS = [
  'SearchCode', 'Share2', 'Code2', 'ShieldCheck', 'Infinity', 'TrendingUp',
  'Zap', 'Database', 'Cloud', 'Server', 'Smartphone', 'Globe'
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} disabled={pending} className="w-full py-4 text-lg">
      ثبت خدمت
    </Button>
  );
}

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <Link href="/admin/services" className="text-muted-foreground hover:text-foreground text-sm mb-4 block font-display">
            ← بازگشت به لیست خدمات
          </Link>
          <Heading>افزودن خدمت جدید</Heading>
        </header>

        <Card className="p-8">
          <form action={createService} className="space-y-6">
            <AdminInput
              id="service-title"
              name="title"
              label="عنوان خدمت"
              required
              placeholder="مثلاً: توسعه اپلیکیشن موبایل"
            />

            <AdminTextarea
              id="service-description"
              name="description"
              label="توضیحات"
              required
              rows={4}
              placeholder="توضیحات کوتاه درباره خدمت..."
            />

            <div className="grid grid-cols-2 gap-6">
              <AdminInput
                id="service-order"
                name="order"
                type="number"
                label="ترتیب نمایش"
                defaultValue={0}
              />

              <AdminSelect id="service-icon" name="iconName" label="آیکون">
                {ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </AdminSelect>
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </Card>
    </div>
  );
}
