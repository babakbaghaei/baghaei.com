'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, FileText, Home, Phone, Briefcase, Cpu, Laptop, BookOpen } from 'lucide-react';
import { useSound } from '@/lib/utils/sounds';

export function CommandMenu() {
  const router = useRouter();
  const { play } = useSound();
  const [open, setOpen] = React.useState(false);
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Fetch posts for search
    fetch('/api/blog/search').then(res => res.json()).then(data => setPosts(data)).catch(() => {});

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 backdrop-blur-sm bg-black/50">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <Command className="w-full">
          <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
            <Search className="mr-2 h-5 w-5 shrink-0 text-zinc-500" />
            <Command.Input 
              placeholder="جستجو در بخش‌ها (برای انتخاب Enter بزنید)..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-zinc-500 text-white font-display text-right pr-4"
              dir="rtl"
            />
          </div>
          
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="py-6 text-center text-sm text-zinc-500 font-display">
              نتیجه‌ای یافت نشد.
            </Command.Empty>

            <Command.Group heading={<span className="text-xs font-bold text-zinc-500 px-2 mb-2 block text-right font-display">صفحات اصلی</span>}>
              <CommandItem icon={Home} text="صفحه اصلی" onSelect={() => runCommand(() => { play('pop'); router.push('/'); })} onHover={() => play('hover')} />
              <CommandItem icon={Briefcase} text="پروژه‌ها" onSelect={() => runCommand(() => { play('pop'); router.push('/projects'); })} onHover={() => play('hover')} />
              <CommandItem icon={Cpu} text="خدمات" onSelect={() => runCommand(() => { play('pop'); router.push('/#services'); })} onHover={() => play('hover')} />
              <CommandItem icon={FileText} text="وبلاگ" onSelect={() => runCommand(() => { play('pop'); router.push('/blog'); })} onHover={() => play('hover')} />
              <CommandItem icon={Phone} text="تماس با ما" onSelect={() => runCommand(() => { play('pop'); router.push('/#contact'); })} onHover={() => play('hover')} />
            </Command.Group>

            <Command.Group heading={<span className="text-xs font-bold text-zinc-500 px-2 mt-4 mb-2 block text-right font-display">ابزارها</span>}>
              <CommandItem icon={Laptop} text="ابزارهای توسعه‌دهنده" onSelect={() => runCommand(() => router.push('/tools'))} />
            </Command.Group>

            {posts.length > 0 && (
              <Command.Group heading={<span className="text-xs font-bold text-zinc-500 px-2 mt-4 mb-2 block text-right font-display">مقالات اخیر</span>}>
                {posts.map(post => (
                  <CommandItem 
                    key={post.slug} 
                    icon={BookOpen} 
                    text={post.title} 
                    onSelect={() => runCommand(() => router.push(`/blog/${post.slug}`))} 
                  />
                ))}
              </Command.Group>
            )}
          </Command.List>
          
          <div className="border-t border-white/10 px-4 py-2 text-xs text-zinc-500 flex justify-between font-mono">
            <span>ESC to close</span>
            <span>Cmd+K</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function CommandItem({ icon: Icon, text, onSelect, onHover }: { icon: any, text: string, onSelect: () => void, onHover?: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      onMouseEnter={onHover}
      className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-sm outline-none data-[selected=true]:bg-white/10 data-[selected=true]:text-white text-zinc-400 transition-colors cursor-pointer group"
    >
      <div className="ml-auto flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <span className="font-display group-data-[selected=true]:text-primary transition-colors">{text}</span>
      </div>
    </Command.Item>
  );
}
