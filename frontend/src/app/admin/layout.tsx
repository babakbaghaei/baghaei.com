'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'داشبورد', href: '/admin', icon: LayoutDashboard },
  { label: 'پروژه‌ها', href: '/admin/projects', icon: FolderKanban },
  { label: 'خدمات', href: '/admin/services', icon: Layers },
  { label: 'پیام‌ها', href: '/admin/messages', icon: MessageSquare },
  { label: 'امنیت', href: '/admin/security', icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === '/admin/login';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Light client-side guard (UI layer only — server auth is unchanged).
  useEffect(() => {
    if (isLoginRoute) return;
    try {
      if (!localStorage.getItem('admin_token')) {
        router.replace('/admin/login');
      }
    } catch {
      router.replace('/admin/login');
    }
  }, [isLoginRoute, pathname, router]);

  // Lock body scroll, close on Escape, and close on any route change while the
  // drawer is open. Guarding on `mobileOpen` avoids an unconditional setState in
  // the effect body (cascading-render lint rule).
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      // Cleanup runs on route change (pathname dep) → drawer closes on navigation.
      setMobileOpen(false);
    };
  }, [mobileOpen, pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('admin_token');
    } catch {
      // ignore — private mode / disabled storage
    }
    // Clear the edge-guard cookie too (set by the login page) so middleware
    // bounces further /admin hits back to login.
    document.cookie = 'admin_token=; path=/; max-age=0; samesite=strict';
    router.push('/admin/login');
  };

  // Login page renders bare, without the sidebar shell.
  if (isLoginRoute) {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile top bar (< md): logo + hamburger to open the nav drawer. */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-border bg-background/95 backdrop-blur">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black font-display">
            B
          </div>
          <span className="font-black font-display uppercase tracking-tight text-sm">پنل مدیریت</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="باز کردن منو"
          aria-expanded={mobileOpen}
          className="p-2 -me-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile slide-in drawer (< md). */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="منوی مدیریت"
            className="absolute inset-y-0 end-0 w-72 max-w-[80%] bg-background border-s border-border flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-border">
              <span className="font-black font-display uppercase tracking-tight">پنل مدیریت</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="بستن منو"
                className="p-2 -me-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-display transition-colors ${
                      active
                        ? 'bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-display text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sticky top-0 h-screen w-64 shrink-0 border-e border-border bg-foreground/[0.02] hidden md:flex flex-col">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-6 h-20 border-b border-border"
        >
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black font-display">
            B
          </div>
          <span className="font-black font-display uppercase tracking-tight">پنل مدیریت</span>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-display transition-colors ${
                  active
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-display text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-12 lg:p-16">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
