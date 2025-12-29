import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toPersianDigits } from '@/lib/utils/format';

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  let services: Service[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/v1/services`, { cache: 'no-store' });
    if (res.ok) {
      services = await res.json() as Service[];
    }
  } catch (error) {
    console.error('Failed to fetch services for admin:', error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="flex justify-between items-center border-b border-border pb-8">
          <div>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm mb-2 block font-display">
              ← بازگشت به داشبورد
            </Link>
            <h1 className="text-3xl font-black font-display uppercase tracking-tight">مدیریت خدمات</h1>
          </div>
          <Link href="/admin/services/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              افزودن خدمت
            </Button>
          </Link>
        </header>

        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.id} className="flex justify-between items-center p-6">
              <div>
                <h3 className="text-xl font-bold font-display">{service.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">{service.description}</p>
                <div className="flex gap-4 mt-4 text-xs font-mono text-muted-foreground/50">
                  <span>ID: {toPersianDigits(service.id)}</span>
                  <span>Order: {toPersianDigits(service.order)}</span>
                  <span>Icon: {service.iconName}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          
          {services.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-display">
              هیچ خدمتی یافت نشد. اولین خدمت را اضافه کنید!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
