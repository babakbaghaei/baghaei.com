'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [formData, setFormData] = useState({ email: '', password: '' });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
   const res = await api.post('/auth/login', formData);
   if (res.access_token) {
    localStorage.setItem('admin_token', res.access_token);
    router.push('/admin');
   } else {
    setError('ایمیل یا رمز عبور اشتباه است.');
   }
  } catch (err) {
   setError('خطا در برقراری ارتباط با سرور.');
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
   <div className="w-full max-w-md space-y-8">
    <div className="text-center space-y-4">
     <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
      <ShieldCheck className="w-10 h-10 text-white" />
     </div>
     <h1 className="text-3xl font-black font-display uppercase tracking-tighter leading-none">
      ورود به <br /><span className="text-zinc-800">زیرساخت.</span>
     </h1>
    </div>

    <Card className="!p-8">
     <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
       <label className="text-[10px] uppercase text-zinc-500 font-black px-1">Identity</label>
       <div className="relative group">
        <div className="absolute inset-y-0 right-4 flex items-center text-zinc-600 group-focus-within:text-white transition-colors">
         <User className="w-4 h-4" />
        </div>
        <input 
         type="email" 
         placeholder="ایمیل ادمین"
         value={formData.email}
         onChange={(e) => setFormData({...formData, email: e.target.value})}
         className="w-full bg-black border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-white transition-all"
         required
        />
       </div>
      </div>

      <div className="space-y-2">
       <label className="text-[10px] uppercase text-zinc-500 font-black px-1">Access Key</label>
       <div className="relative group">
        <div className="absolute inset-y-0 right-4 flex items-center text-zinc-600 group-focus-within:text-white transition-colors">
         <Lock className="w-4 h-4" />
        </div>
        <input 
         type="password" 
         placeholder="رمز عبور"
         value={formData.password}
         onChange={(e) => setFormData({...formData, password: e.target.value})}
         className="w-full bg-black border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-white transition-all"
         required
        />
       </div>
      </div>

      {error && <p className="text-red-500 text-xs font-display text-center">{error}</p>}

      <Button type="submit" isLoading={loading} className="w-full py-4 text-lg">
       تایید هویت
      </Button>
     </form>
    </Card>
   </div>
  </div>
 );
}
