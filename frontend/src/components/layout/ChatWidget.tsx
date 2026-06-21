'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, CalendarClock } from 'lucide-react';

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
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
      >
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
