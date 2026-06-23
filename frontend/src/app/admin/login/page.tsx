'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api, ApiError } from '@/lib/api';

export default function AdminLoginPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [twoFARequired, setTwoFARequired] = useState(false);
 const [formData, setFormData] = useState({ email: '', password: '', twoFactorCode: '' });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
   const res = await api.post('/auth/login', formData);
   // Account has 2FA enabled — prompt for the code and resubmit.
   if (res?.twoFactorRequired) {
    setTwoFARequired(true);
    setError(twoFARequired ? 'کد تأیید نادرست است.' : '');
    setLoading(false);
    return;
   }
   if (res?.access_token) {
    try {
     localStorage.setItem('admin_token', res.access_token);
    } catch {
     setError('امکان ذخیره‌سازی نشست وجود ندارد (حالت ناشناس مرورگر؟).');
     return;
    }
    // Mirror the token into a cookie so the edge middleware (proxy.ts) can gate
    // /admin routes — localStorage is invisible to middleware. SameSite=Strict;
    // 7d to match the refresh window. The API still validates the JWT itself.
    document.cookie = `admin_token=${res.access_token}; path=/; max-age=604800; samesite=strict`;
    router.push('/admin');
   } else {
    setError('ایمیل یا رمز عبور اشتباه است.');
   }
  } catch (err) {
   if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
    setError('ایمیل یا رمز عبور اشتباه است.');
   } else {
    setError('خطا در برقراری ارتباط با سرور.');
   }
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
   <div className="w-full max-w-md space-y-8">
    <div className="text-center space-y-4">
     <div className="w-20 h-20 bg-foreground/5 border border-border rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
      <ShieldCheck className="w-10 h-10 text-foreground" />
     </div>
     <h1 className="text-3xl font-black font-display uppercase tracking-tighter leading-none">
      ورود به <br /><span className="text-muted-foreground">زیرساخت.</span>
     </h1>
    </div>

    <Card className="!p-8">
     <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
       <label htmlFor="admin-email" className="text-xs uppercase text-muted-foreground font-black px-1">شناسه</label>
       <div className="relative group">
        <div aria-hidden="true" className="absolute inset-y-0 start-4 flex items-center text-muted-foreground group-focus-within:text-foreground transition-colors">
         <User className="w-4 h-4" />
        </div>
        <input
         id="admin-email"
         name="email"
         type="email"
         autoComplete="email"
         placeholder="ایمیل ادمین"
         value={formData.email}
         onChange={(e) => setFormData({...formData, email: e.target.value})}
         className="w-full bg-background border border-border rounded-2xl py-4 ps-12 pe-4 text-sm outline-none focus-visible:border-foreground focus:border-foreground transition-colors"
         required
        />
       </div>
      </div>

      <div className="space-y-2">
       <label htmlFor="admin-password" className="text-xs uppercase text-muted-foreground font-black px-1">کلید دسترسی</label>
       <div className="relative group">
        <div aria-hidden="true" className="absolute inset-y-0 start-4 flex items-center text-muted-foreground group-focus-within:text-foreground transition-colors">
         <Lock className="w-4 h-4" />
        </div>
        <input
         id="admin-password"
         name="password"
         type="password"
         autoComplete="current-password"
         placeholder="رمز عبور"
         value={formData.password}
         onChange={(e) => setFormData({...formData, password: e.target.value})}
         className="w-full bg-background border border-border rounded-2xl py-4 ps-12 pe-4 text-sm outline-none focus-visible:border-foreground focus:border-foreground transition-colors"
         required
        />
       </div>
      </div>

      {twoFARequired && (
       <div className="space-y-2">
        <label htmlFor="admin-2fa" className="text-xs uppercase text-muted-foreground font-black px-1">کد دو مرحله‌ای</label>
        <input
         id="admin-2fa"
         name="twoFactorCode"
         inputMode="numeric"
         autoComplete="one-time-code"
         placeholder="کد ۶ رقمی برنامه احرازکننده"
         value={formData.twoFactorCode}
         onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
         dir="ltr"
         autoFocus
         className="w-full bg-background border border-border rounded-2xl py-4 px-4 text-center tracking-[0.3em] text-lg outline-none focus-visible:border-foreground focus:border-foreground transition-colors"
        />
       </div>
      )}

      {error && <p role="alert" aria-live="assertive" className="text-red-500 text-xs font-display text-center">{error}</p>}

      <Button type="submit" isLoading={loading} className="w-full py-4 text-lg">
       {twoFARequired ? 'تأیید کد' : 'تایید هویت'}
      </Button>
     </form>
    </Card>
   </div>
  </div>
 );
}
