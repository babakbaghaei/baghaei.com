import React from 'react';
import Link from 'next/link';
import { Plus, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/admin/EmptyState';
import { toPersianDigits } from '@/lib/utils/format';
import { apiV1Url } from '@/lib/apiBase';

export const dynamic = 'force-dynamic';

interface Service {
  id: string | number;
  title: string;
  description: string;
  order: number;
  iconName: string;
}

// This is a Server Component
export default async function ServicesAdmin() {
  const serverBase = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

  let services: Service[] = [];
  try {
    const res = await fetch(apiV1Url('/services', serverBase), { cache: 'no-store' });
    if (res.ok) {
      services = await res.json() as Service[];
    }
  } catch (error) {
    console.error('Failed to fetch services for admin:', error);
  }

  return (
    <div className="space-y-16">
        <header className="flex justify-between items-center border-b border-border pb-8">
          <h1 className="text-3xl font-black font-display uppercase tracking-tight">مدیریت خدمات</h1>
          <Link href="/admin/services/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              افزودن خدمت
            </Button>
          </Link>
        </header>

        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-6">
              <h3 className="text-xl font-bold font-display">{service.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">{service.description}</p>
              <p className="mt-3 text-[11px] text-muted-foreground/60 font-display">
                ترتیب نمایش: {toPersianDigits(service.order)}
              </p>
            </Card>
          ))}

          {services.length === 0 && (
            <EmptyState
              icon={Layers}
              title="هنوز خدمتی ثبت نشده است"
              subtitle="اولین خدمت گروه فناوری بقایی را اضافه کنید."
            />
          )}
        </div>
    </div>
  );
}
