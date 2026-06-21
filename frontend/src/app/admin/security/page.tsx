'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Smartphone, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function AdminSecurity() {
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'enabled' | 'disabled'>('idle');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const res = (await api.post('/auth/2fa/generate', {})) as { qrDataUrl: string };
      setQr(res.qrDataUrl);
    } catch {
      setError('برای فعال‌سازی باید وارد شوید.');
    } finally {
      setBusy(false);
    }
  };

  const enable = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/2fa/enable', { code });
      setStatus('enabled');
      setQr(null);
      setCode('');
    } catch {
      setError('کد واردشده نادرست است.');
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/2fa/disable', {});
      setStatus('disabled');
    } catch {
      setError('خطا در غیرفعال‌سازی.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-20">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-border pb-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black font-display uppercase tracking-tight">امنیت حساب</h1>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display">
            <span>داشبورد</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </header>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">احراز هویت دو مرحله‌ای (2FA)</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            با فعال‌سازی 2FA، هنگام ورود علاوه بر رمز عبور، یک کد یک‌بارمصرف از برنامه احرازکننده (مانند Google Authenticator) لازم است.
          </p>

          {status === 'enabled' && (
            <div className="flex items-center gap-2 text-emerald-500 font-display text-sm">
              <Check className="w-5 h-5" /> احراز هویت دو مرحله‌ای فعال شد.
            </div>
          )}
          {status === 'disabled' && (
            <p className="text-muted-foreground font-display text-sm">احراز هویت دو مرحله‌ای غیرفعال شد.</p>
          )}

          {!qr && status !== 'enabled' && (
            <div className="flex gap-3">
              <Button onClick={start} isLoading={busy}>شروع فعال‌سازی</Button>
              <Button variant="outline" onClick={disable} isLoading={busy}>غیرفعال‌سازی</Button>
            </div>
          )}

          {qr && (
            <div className="space-y-5 border-t border-border pt-6">
              <p className="text-sm font-display">۱. این کد QR را با برنامه احرازکننده اسکن کنید:</p>
              <div className="bg-white p-3 rounded-2xl w-fit">
                <Image src={qr} alt="کد QR احراز هویت دو مرحله‌ای" width={180} height={180} unoptimized />
              </div>
              <p className="text-sm font-display">۲. کد ۶ رقمی نمایش‌داده‌شده را وارد کنید:</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                dir="ltr"
                placeholder="------"
                className="w-full bg-background border border-border rounded-2xl py-4 px-4 text-center tracking-[0.3em] text-lg outline-none focus:border-foreground transition-colors"
              />
              <Button onClick={enable} isLoading={busy} disabled={code.length < 6}>تأیید و فعال‌سازی</Button>
            </div>
          )}

          {error && <p role="alert" className="text-red-500 text-xs font-display">{error}</p>}
        </Card>
      </div>
    </div>
  );
}
