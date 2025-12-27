'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, MessageSquare, Users, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Layout';
import { toPersianDigits } from '@/lib/utils/format';

const adminStats = [
 { label: 'پروژه‌ها', value: '۸', icon: FolderKanban, href: '/admin/projects' },
 { label: 'پیام‌های تماس', value: '۱۲', icon: MessageSquare, href: '/admin/messages' },
 { label: 'درخواست‌های استخدام', value: '۳', icon: Users, href: '/admin/careers' },
];

export default function AdminDashboard() {
 return (
  <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
   <div className="max-w-7xl mx-auto space-y-16">
    <header className="flex justify-between items-center border-b border-border pb-8">
     <div className="flex items-center gap-4">
      <LayoutDashboard className="w-8 h-8 text-primary" />
      <h1 className="text-3xl font-black font-display uppercase tracking-tight">پنل مدیریت</h1>
     </div>
     <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display">
      <span>خروج</span>
      <LogOut className="w-5 h-5" />
     </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
     {adminStats.map((stat) => (
      <Link key={stat.label} href={stat.href}>
       <Card className="hover:scale-[1.02] transition-transform cursor-pointer group hover:border-primary/50">
        <div className="flex justify-between items-start">
         <div className="space-y-4">
          <p className="text-muted-foreground text-sm font-display">{stat.label}</p>
          <p className="text-5xl font-black font-display">{toPersianDigits(stat.value)}</p>
         </div>
         <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
          <stat.icon className="w-6 h-6" />
         </div>
        </div>
       </Card>
      </Link>
     ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
     <Card className="min-h-[400px]">
      <h3 className="text-xl font-bold font-display mb-8">آخرین فعالیت‌ها</h3>
      <div className="space-y-6">
       {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start border-b border-border pb-4 last:border-0">
         <div className="w-2 h-2 rounded-full bg-primary mt-2" />
         <div>
          <p className="text-sm font-display text-foreground opacity-80">درخواست همکاری جدید از طرف "شرکت پارس"</p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">۲ ساعت پیش</p>
         </div>
        </div>
       ))}
      </div>
     </Card>
     
     <Card className="min-h-[400px]">
      <h3 className="text-xl font-bold font-display mb-8">وضعیت سیستم</h3>
      <div className="space-y-8">
       <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
         <span>Server Load</span>
         <span>{toPersianDigits('32')}٪</span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
         <div className="h-full bg-primary w-[32%]" />
        </div>
       </div>
       <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
         <span>API Uptime</span>
         <span>{toPersianDigits('99.9')}٪</span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
         <div className="h-full bg-primary w-[99%]" />
        </div>
       </div>
      </div>
     </Card>
    </div>
   </div>
  </div>
 );
}
