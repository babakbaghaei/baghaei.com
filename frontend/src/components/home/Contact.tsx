"use client";
import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="about" className="py-32">
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <div className="mb-12">
                    <h2 className="text-xl font-black font-display mb-3">درباره ما</h2>
                </div>
                <div className="space-y-6 text-sm text-gray-700 font-sans leading-relaxed">
                    <p>
                        ما از سال ۱۳۹۴ نرم‌افزارهای سازمانی می‌سازیم. سیستم‌هایی که با تعداد زیاد کاربر هم کار می‌کنند.
                    </p>
                    <p>
                        با بیش از ۱۰ سال تجربه، برای شرکت‌های بزرگ نرم‌افزار می‌سازیم. ۱۴+ شرکت بزرگ به ما اعتماد کرده‌اند.
                    </p>
                    <p>
                        ما سیستم‌های بزرگ، امن و قابل اعتماد می‌سازیم که همیشه در دسترس هستند.
                    </p>
                </div>

                <div className="mt-12 pt-12">
                    <h3 className="text-lg font-black font-display mb-6">اطلاعات تماس</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <a href="mailto:baabakbaghaaei@gmail.com" className="text-sm text-gray-700 hover:text-black transition-all font-sans">baabakbaghaaei@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="tel:+989115790013" className="text-sm text-gray-700 hover:text-black transition-all font-sans">+98 911 579 0013</a>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-12">
                    <h2 className="text-xl font-black font-display mb-3">دریافت مشاوره</h2>
                    <p className="text-sm text-gray-600 font-sans mb-6">لطفا اطلاعات تماس خود را وارد کنید تا با شما تماس بگیریم.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="consultation-name" className="block text-xs font-black text-gray-900 mb-2 font-sans">نام و نام خانوادگی *</label>
                        <input type="text" id="consultation-name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 border-2 border-gray-200 bg-white focus:outline-none focus:border-black transition-all text-sm font-sans" style={{ borderRadius: 0 }} placeholder="نام و نام خانوادگی" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="consultation-email" className="block text-xs font-black text-gray-900 mb-2 font-sans">ایمیل <span className="text-gray-500 font-normal">(اختیاری)</span></label>
                            <input type="email" id="consultation-email" name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 border-2 border-gray-200 bg-white focus:outline-none focus:border-black transition-all text-sm font-sans" style={{ borderRadius: 0 }} placeholder="example@email.com" />
                        </div>

                        <div>
                            <label htmlFor="consultation-phone" className="block text-xs font-black text-gray-900 mb-2 font-sans">شماره تماس <span className="text-gray-500 font-normal">(اختیاری)</span></label>
                            <input type="tel" id="consultation-phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 border-2 border-gray-200 bg-white focus:outline-none focus:border-black transition-all text-sm font-sans" style={{ borderRadius: 0 }} placeholder="09123456789" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="consultation-message" className="block text-xs font-black text-gray-900 mb-2 font-sans">پیام یا توضیحات (اختیاری)</label>
                        <textarea id="consultation-message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-6 py-4 border-2 border-gray-200 bg-white focus:outline-none focus:border-black transition-all text-sm font-sans resize-none" style={{ borderRadius: 0 }} placeholder="هر توضیح یا پیام اضافی که می‌خواهید با ما به اشتراک بگذارید..."></textarea>
                    </div>

                    <button type="submit" disabled={status === 'sending'} className="w-full px-8 py-3 bg-black text-white text-sm font-black hover:opacity-80 transition-all duration-300">
                        {status === 'sending' ? 'در حال ارسال...' : 'ارسال درخواست مشاوره'}
                    </button>
                    {status === 'success' && <p className="text-green-600 text-xs mt-2">پیام شما با موفقیت ارسال شد.</p>}
                    {status === 'error' && <p className="text-red-600 text-xs mt-2">خطا در ارسال پیام.</p>}
                </form>
            </div>
        </div>
            </div>
        </div>
    </section>
  );
}
