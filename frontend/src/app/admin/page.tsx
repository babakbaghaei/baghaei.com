'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, MessageSquare, Users, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Layout';

const adminStats = [
  { label: 'پروژه‌ها', value: '۸', icon: FolderKanban, href: '/admin/projects' },
  { label: 'پیام‌های تماس', value: '۱۲', icon: MessageSquare, href: '/admin/messages' },
  { label: 'درخواست‌های استخدام', value: '۳', icon: Users, href: '/admin/careers' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex justify-between items-center border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-black font-display uppercase tracking-tight">پنل مدیریت</h1>
          </div>
          <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-display">
            <span>خروج</span>
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adminStats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:scale-[1.02] transition-transform cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <p className="text-zinc-500 text-sm font-display">{stat.label}</p>
                    <p className="text-5xl font-black font-display">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
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
                <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-white mt-2" />
                  <div>
                    <p className="text-sm font-display text-zinc-300">درخواست همکاری جدید از طرف "شرکت پارس"</p>
                    <p className="text-[10px] text-zinc-600 uppercase mt-1">۲ ساعت پیش</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="min-h-[400px]">
            <h3 className="text-xl font-bold font-display mb-8">وضعیت سیستم</h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                  <span>Server Load</span>
                  <span>۳۲٪</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[32%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                  <span>API Uptime</span>
                  <span>۹۹.۹٪</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[99%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
