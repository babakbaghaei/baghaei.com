'use client';

// Z-INDEX LADDER (project-wide stacking scale — keep these in sync):
//   page content / background ........ z-[-2] .. z-10
//   fixed chrome (navbar, etc.) ...... z-40 .. z-60
//   ChatWidget ....................... z-[100]
//   CookieConsent .................... z-[9000]
//   overlays / menus (CommandMenu,
//     MobileMenu, ProjectModal) ...... z-[9990]+
//   preloader / skip-link top ........ z-[10000]+
// This dialog must sit ABOVE ChatWidget and CookieConsent, so it uses z-[9990].

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, FileText, Home, Phone, Briefcase, Laptop, BookOpen, Info, type LucideIcon } from 'lucide-react';
import { useSound } from '@/lib/utils/sounds';
import { navLinks } from '@/lib/nav';
import { TOOLS } from '@/lib/data/tools';

interface BlogSearchResult {
  slug: string;
  title: string;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Resolve each shared nav id to its command-palette icon + navigation target.
// Single source for the nav set (src/lib/nav.ts); routing/icon detail lives here.
const NAV_COMMAND_META: Record<string, { icon: LucideIcon; go: (r: ReturnType<typeof useRouter>) => void }> = {
  hero: { icon: Home, go: (r) => r.push('/') },
  projects: { icon: Briefcase, go: (r) => r.push('/projects') },
  tools: { icon: Laptop, go: (r) => r.push('/tools') },
  about: { icon: Info, go: (r) => r.push('/about') },
};

export function CommandMenu() {
  const router = useRouter();
  const { play } = useSound();
  const [open, setOpen] = React.useState(false);
  const [posts, setPosts] = React.useState<BlogSearchResult[]>([]);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    // Fetch posts for search
    fetch('/api/blog/search')
      .then(res => res.json())
      .then((data: BlogSearchResult[]) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    // Visible affordances (e.g. the navbar search button) dispatch this so the
    // palette is discoverable on mouse/touch, not just via Cmd/Ctrl+K.
    const openFromEvent = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('command-menu:open', openFromEvent);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('command-menu:open', openFromEvent);
    };
  }, []);

  // Body scroll-lock + autofocus + focus-trap while the dialog is open.
  // Mirrors the proven patterns in ProjectModal.tsx (scroll-lock) and
  // MobileMenu.tsx (Tab trap + focus restore).
  React.useEffect(() => {
    if (!open) return;

    // Scroll-lock (compensate for the scrollbar gap so layout doesn't jump).
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.classList.add('lenis-stopped');

    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const focusTimer = window.setTimeout(() => {
      (inputRef.current ?? dialogRef.current)?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === root
      );
      if (items.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('lenis-stopped');
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="جستجوی سریع"
      tabIndex={-1}
      className="fixed inset-0 z-[9990] flex items-start justify-center pt-[20vh] px-4 backdrop-blur-sm bg-black/50 outline-none"
    >
      <button
        type="button"
        aria-label="بستن جستجو"
        className="fixed inset-0 cursor-default"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-popover/90 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <Command className="w-full">
          <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
            <Search className="me-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input
              ref={inputRef}
              placeholder="جستجو در بخش‌ها (برای انتخاب Enter بزنید)..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground text-foreground font-display text-right ps-4"
              dir="rtl"
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-display">
              نتیجه‌ای یافت نشد.
            </Command.Empty>

            <Command.Group heading={<span className="text-xs font-bold text-muted-foreground px-2 mb-2 block text-right font-display">صفحات اصلی</span>}>
              {navLinks.map((link) => {
                const meta = NAV_COMMAND_META[link.id];
                if (!meta) return null;
                return (
                  <CommandItem
                    key={link.id}
                    icon={meta.icon}
                    text={link.label}
                    onSelect={() => runCommand(() => { play('pop'); meta.go(router); })}
                    onHover={() => play('hover')}
                  />
                );
              })}
              <CommandItem icon={FileText} text="وبلاگ" onSelect={() => runCommand(() => { play('pop'); router.push('/blog'); })} onHover={() => play('hover')} />
              <CommandItem icon={Phone} text="تماس با ما" onSelect={() => runCommand(() => { play('pop'); router.push('/#contact'); })} onHover={() => play('hover')} />
            </Command.Group>

            <Command.Group heading={<span className="text-xs font-bold text-muted-foreground px-2 mt-4 mb-2 block text-right font-display">ابزارها</span>}>
              {TOOLS.filter((t) => t.status !== 'soon').map((tool) => (
                <CommandItem
                  key={tool.slug}
                  icon={tool.icon ?? Laptop}
                  text={tool.title}
                  value={`${tool.title} ${tool.category ?? ''} ${tool.desc ?? ''}`}
                  onSelect={() => runCommand(() => router.push(`/tools/${tool.slug}`))}
                />
              ))}
            </Command.Group>

            {posts.length > 0 && (
              <Command.Group heading={<span className="text-xs font-bold text-muted-foreground px-2 mt-4 mb-2 block text-right font-display">مقالات اخیر</span>}>
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

          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex justify-between font-mono">
            <span>ESC to close</span>
            <span>Cmd+K</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function CommandItem({ icon: Icon, text, value, onSelect, onHover }: { icon: LucideIcon, text: string, value?: string, onSelect: () => void, onHover?: () => void }) {
  return (
    <Command.Item
      value={value ?? text}
      onSelect={onSelect}
      onMouseEnter={onHover}
      className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-sm outline-none data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground text-muted-foreground transition-colors cursor-pointer group"
    >
      <div className="ml-auto flex items-center gap-3">
        <Icon aria-hidden="true" className="h-4 w-4" />
        <span className="font-display group-data-[selected=true]:text-primary transition-colors">{text}</span>
      </div>
    </Command.Item>
  );
}
