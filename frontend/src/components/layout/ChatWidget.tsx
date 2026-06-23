'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, CalendarClock } from 'lucide-react';

// Business hours in Tehran: 09:00–21:00 reads as live "online"; outside that we
// promise a quick reply instead of faking presence. Computed client-side from the
// real Tehran wall-clock (independent of the visitor's own timezone) and only
// after mount, so SSR and first paint agree (no hydration mismatch).
export function tehranHour(now: Date = new Date()): number {
  const h = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    hour12: false,
  }).format(now);
  // '24' can surface at midnight in some ICU builds — normalize to 0.
  return parseInt(h, 10) % 24;
}

export const isOnlineAt = (hour: number) => hour >= 9 && hour < 21;

// Real contacts as defaults; env vars can still override per-environment.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '989115790013'; // digits only
const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'Babak_Baghaei'; // without leading @
const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL;

interface Channel {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  // `null` until mounted → server and first client paint render no presence claim,
  // avoiding a hydration mismatch on the time-dependent label/dot.
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOnline(isOnlineAt(tehranHour()));
    tick();
    // Re-evaluate on the hour boundary so a long-open tab flips presence correctly.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const channels: Channel[] = [];
  if (CALENDLY) channels.push({ href: CALENDLY, label: 'رزرو مشاوره', icon: <CalendarClock className="w-4 h-4" />, color: '99, 102, 241' });
  if (WHATSAPP) channels.push({ href: `https://wa.me/${WHATSAPP}`, label: 'واتساپ', icon: <Phone className="w-4 h-4" />, color: '34, 197, 94' });
  if (TELEGRAM) channels.push({ href: `https://t.me/${TELEGRAM}`, label: 'تلگرام', icon: <Send className="w-4 h-4" />, color: '14, 165, 233' });

  if (channels.length === 0) return null;

  return (
    <div className="no-print fixed bottom-8 start-8 z-[100] flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex flex-col gap-2.5"
          >
            {online !== null && (
              <li
                data-testid="chat-presence"
                data-online={online ? 'true' : 'false'}
                className="flex items-center gap-2.5 rounded-full bg-card/90 backdrop-blur-xl border border-border ps-4 pe-3.5 py-2.5 shadow-xl text-xs font-bold font-display"
              >
                {online ? (
                  <>
                    <span className="text-emerald-500">آنلاین</span>
                    <span className="relative flex w-2.5 h-2.5">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/70 animate-ping" />
                      <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">معمولاً سریع پاسخ می‌دهیم</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
                  </>
                )}
              </li>
            )}
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-full bg-card/90 backdrop-blur-xl border border-border ps-4 pe-3 py-2.5 shadow-xl text-sm font-bold font-display hover:scale-105 transition-transform"
                  style={{ color: `rgb(${c.color})` }}
                >
                  {c.label}
                  <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `rgba(${c.color}, 0.15)` }}>
                    {c.icon}
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'بستن گفتگو' : 'باز کردن گفتگو'}
        aria-expanded={open}
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
      >
        {/* Live presence cue on the launcher — only when online and collapsed. */}
        {online && !open && (
          <span aria-hidden className="absolute top-1 end-1 flex w-3 h-3">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/70 animate-ping" />
            <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500 border-2 border-primary" />
          </span>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
