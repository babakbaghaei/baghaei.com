'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, MailOpen, MailWarning, Inbox } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ListSkeleton } from '../../../components/admin/EmptyState';
import { api } from '../../../lib/api';

interface Message {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = (await api.get('/contact')) as { data: Message[] };
        setMessages(res?.data || []);
      } catch (e: any) {
        setError(e?.status === 401 ? 'برای مشاهده پیام‌ها باید وارد شوید.' : 'خطا در دریافت پیام‌ها.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const toggleRead = async (msg: Message) => {
    // Optimistic update — revert on failure.
    const next = !msg.isRead;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: next } : m)));
    try {
      await api.patch(`/contact/${msg.id}/read`, { isRead: next });
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: msg.isRead } : m)));
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('این پیام حذف شود؟')) return;
    const prev = messages;
    setMessages((p) => p.filter((m) => m.id !== id));
    try {
      await api.delete(`/contact/${id}`);
    } catch {
      setMessages(prev); // restore on failure
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-border pb-8">
          <div className="flex items-center gap-4">
            <Inbox className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-black font-display uppercase tracking-tight">صندوق پیام‌ها</h1>
              {!loading && (
                <p className="text-sm text-muted-foreground font-display mt-1">
                  {unreadCount > 0 ? `${unreadCount} پیام خوانده‌نشده` : 'همه پیام‌ها خوانده شده‌اند'}
                </p>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <ListSkeleton count={4} />
        ) : error ? (
          <Card className="text-center py-20">
            <MailWarning className="w-10 h-10 mx-auto text-muted-foreground/50 mb-4" />
            <p className="font-display text-muted-foreground">{error}</p>
          </Card>
        ) : messages.length === 0 ? (
          <Card className="text-center py-20">
            <Inbox className="w-10 h-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="font-display text-muted-foreground">هنوز پیامی دریافت نشده است.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`transition-colors ${msg.isRead ? 'opacity-70' : 'border-primary/40'}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {!msg.isRead && <span aria-hidden="true" className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <h3 className="font-bold font-display text-lg">{msg.name}</h3>
                    </div>
                    <time className="text-[11px] text-muted-foreground font-display shrink-0">
                      {new Date(msg.createdAt).toLocaleString('fa-IR')}
                    </time>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{msg.message}</p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-display border-t border-border pt-3" dir="ltr">
                    <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Phone className="w-3.5 h-3.5" /> {msg.phone}
                    </a>
                    {msg.email && (
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {msg.email}
                      </a>
                    )}
                    <div className="flex items-center gap-3 ms-auto">
                      <button
                        onClick={() => toggleRead(msg)}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        aria-label={msg.isRead ? 'علامت‌گذاری به‌عنوان خوانده‌نشده' : 'علامت‌گذاری به‌عنوان خوانده‌شده'}
                      >
                        <MailOpen className="w-4 h-4" />
                        {msg.isRead ? 'خوانده‌نشده' : 'خوانده‌شده'}
                      </button>
                      <button
                        onClick={() => remove(msg.id)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="حذف پیام"
                      >
                        <Trash2 className="w-4 h-4" /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
