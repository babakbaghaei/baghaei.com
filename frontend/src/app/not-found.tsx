'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import BackgroundGrid from '@/components/ui/effects/BackgroundGrid';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      <BackgroundGrid />
      
      {/* Glitch Effect Text */}
      <h1 className="text-[150px] md:text-[250px] font-black font-display leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-muted-foreground to-muted select-none absolute z-0 opacity-50">
        404
      </h1>

      <div className="z-10 text-center space-y-8 backdrop-blur-sm p-12 rounded-3xl border border-border bg-card/50">
        <h2 className="text-4xl md:text-5xl font-bold font-display">
          مسیر یافت نشد
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto font-sans leading-relaxed">
          صفحه‌ای که به دنبال آن هستید ممکن است حذف شده باشد یا آدرس آن تغییر کرده باشد. نگران نباشید، راه خانه همیشه باز است.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 gap-2">
              <Home className="w-4 h-4" />
              بازگشت به خانه
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" size="lg" className="rounded-full px-8 gap-2">
              مطالعه وبلاگ
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}