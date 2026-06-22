'use client';

import React, { useState } from 'react';
import { Link2, Check, Send, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  /** Absolute canonical URL of the post. */
  url: string;
  /** Post title — used as the share text. */
  title: string;
}

const baseBtn =
  'flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/40 text-muted-foreground transition-colors duration-300 hover:text-primary hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context / permissions) — fail quietly.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const links = [
    {
      label: 'اشتراک در تلگرام',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      Icon: Send,
    },
    {
      label: 'اشتراک در ایکس',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      Icon: Twitter,
    },
    {
      label: 'اشتراک در لینکدین',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      label: 'اشتراک در واتساپ',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
  ];

  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-display text-muted-foreground ms-1">اشتراک‌گذاری</span>

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'لینک کپی شد' : 'کپی لینک'}
        className={baseBtn}
      >
        {copied ? <Check className="w-4 h-4 text-primary" /> : <Link2 className="w-4 h-4" />}
      </button>

      {copied && (
        <span className="text-xs font-mono text-primary" aria-live="polite">
          کپی شد
        </span>
      )}

      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={baseBtn}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
