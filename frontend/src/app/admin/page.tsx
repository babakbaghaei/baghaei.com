'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FolderKanban, MessageSquare, Users, LogOut, Layers, Activity } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { toPersianDigits } from '../../lib/utils/format';
import { api } from '../../lib/api';

interface Stats {
  projects: number;
  services: number;
  messages: number;
  careers: number;
  systemStatus: {
    serverLoad: number;
    uptime: number;
  };
}

interface ActivityItem {
  id: string | number;
  title: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/dashboard/stats') as Promise<{ data: Stats }>,
          api.get('/dashboard/activities') as Promise<{ data: ActivityItem[] }>
        ]);
        setStats(statsRes?.data || null);
        setActivities(activitiesRes?.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setActivities([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-display text-white text-lg">در حال اتصال به زیرساخت...</div>;
  }

  const adminStats = [
    { label: 'پروژه‌ها', value: stats?.projects || 0, icon: FolderKanban, href: '/admin/projects' },
    { label: 'خدمات', value: stats?.services || 0, icon: Layers, href: '/admin/services' },
    { label: 'پیام‌ها', value: stats?.messages || 0, icon: MessageSquare, href: '/admin/messages' },
    { label: 'استخدام', value: stats?.careers || 0, icon: Users, href: '/admin/careers' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
      <div className="max-w-5xl mx-auto space-y-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adminStats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:scale-[1.02] transition-transform cursor-pointer group hover:border-primary/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm font-display">{stat.label}</p>
                    <p className="text-5xl font-black font-display">{toPersianDigits(String(stat.value))}</p>
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
            <h3 className="text-xl font-bold font-display mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              آخرین فعالیت‌ها
            </h3>
            <div className="space-y-6">
              {activities.length > 0 ? activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start border-b border-border pb-4 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm font-display text-foreground opacity-80">{activity.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">
                      {new Date(activity.time).toLocaleTimeString('fa-IR')}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-muted-foreground font-display">هیچ فعالیتی ثبت نشده است.</div>
              )}
            </div>
          </Card>
          
          <Card className="min-h-[400px]">
            <h3 className="text-xl font-bold font-display mb-8">وضعیت سیستم</h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                  <span>Server Load</span>
                  <span>{toPersianDigits(String(stats?.systemStatus?.serverLoad || 0))}٪</span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${stats?.systemStatus?.serverLoad || 0}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                  <span>API Uptime</span>
                  <span>{toPersianDigits(String(stats?.systemStatus?.uptime || 0))}٪</span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${stats?.systemStatus?.uptime || 0}%` }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
