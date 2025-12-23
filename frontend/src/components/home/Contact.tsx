"use client";
import React, { useState } from 'react';
import { Reveal } from '@/components/effects/Reveal';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-40 bg-zinc-50/30 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          <div className="lg:col-span-5 space-y-12">
            <Reveal>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight font-display text-black uppercase">شروع همکاری</h2>
                <p className="text-zinc-400 font-sans text-lg md:text-xl leading-relaxed">
                  تیم ما آماده است تا پیچیده‌ترین چالش‌های فنی شما را به راهکارهایی هوشمند تبدیل کند. با ما در تماس باشید.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="space-y-10 pt-6">
                <div className="group">
                  <div className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-2">ارتباط مستقیم</div>
                  <a href="mailto:business@baghaei.group" className="text-2xl md:text-4xl font-en font-black text-black hover:text-zinc-400 transition-colors tracking-tighter">business@baghaei.group</a>
                </div>
                <div className="group">
                  <div className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-2">تلفن تماس</div>
                  <a href="tel:+989115790013" className="text-2xl md:text-4xl font-en font-black text-black hover:text-zinc-400 transition-colors tracking-tighter">+98 911 579 0013</a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">نام و نام خانوادگی *</label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange} required 
                      className="w-full bg-zinc-50 border border-transparent p-5 rounded-2xl text-black focus:outline-none focus:bg-white focus:border-zinc-200 transition-all font-sans text-base" 
                      placeholder="نام خود را وارد کنید..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">آدرس ایمیل</label>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full bg-zinc-50 border border-transparent p-5 rounded-2xl text-black focus:outline-none focus:bg-white focus:border-zinc-200 transition-all font-sans text-base" 
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">شماره تلفن</label>
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full bg-zinc-50 border border-transparent p-5 rounded-2xl text-black focus:outline-none focus:bg-white focus:border-zinc-200 transition-all font-sans text-base" 
                        placeholder="۰۹..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">شرح درخواست یا پروژه</label>
                    <textarea 
                      name="message" value={formData.message} onChange={handleChange} rows={4}
                      className="w-full bg-zinc-50 border border-transparent p-5 rounded-2xl text-black focus:outline-none focus:bg-white focus:border-zinc-200 transition-all font-sans text-base resize-none" 
                      placeholder="جزئیات درخواست خود را بنویسید..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'sending'} 
                    className="w-full py-6 bg-black text-white rounded-[1.5rem] font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-zinc-800 shadow-xl shadow-zinc-200"
                  >
                    {status === 'sending' ? 'در حال ارسال اطلاعات...' : 'ارسال درخواست مشاوره'}
                  </button>

                  {status === 'success' && <p className="text-xs font-bold text-green-600 text-center animate-pulse uppercase tracking-widest pt-2">درخواست شما با موفقیت ارسال شد.</p>}
                  {status === 'error' && <p className="text-xs font-bold text-red-500 text-center pt-2">خطا در ارسال. لطفاً مجدداً تلاش کنید.</p>}
                </form>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
