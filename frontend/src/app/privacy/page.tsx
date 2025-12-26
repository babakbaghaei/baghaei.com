import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
 return (
  <main className="min-h-screen bg-black text-white pt-48 pb-20 px-6 relative overflow-hidden">
   {/* Background Noise/Grid */}
   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
   
   <Navbar />
   
   <div className="max-w-4xl mx-auto space-y-16 relative z-10">
    <header className="space-y-6 border-b border-zinc-800 pb-12">
     <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none">
      حریم <span className="text-zinc-500">خصوصی.</span>
     </h1>
     <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
      آخرین بروزرسانی: ۲ دی ۱۴۰۴
     </p>
    </header>

    <div className="space-y-12 font-sans text-zinc-300 leading-loose text-lg text-justify">
     <section className="space-y-4">
      <p>
       در گروه فناوری بقایی، امنیت اطلاعات و حریم خصوصی شما اولویت اصلی ماست. این سند شرح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم. ما متعهد به شفافیت کامل در پردازش داده‌های شما هستیم.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۱. جمع‌آوری داده‌ها</h2>
      <div className="space-y-4 text-zinc-400">
       <p>ما اطلاعات را در دو دسته جمع‌آوری می‌کنیم:</p>
       <ul className="list-disc list-inside space-y-2 pr-4 marker:text-zinc-600">
        <li><strong className="text-zinc-200">اطلاعات هویتی:</strong> نام، ایمیل، و شماره تماس که شما داوطلبانه از طریق فرم‌های تماس برای شروع همکاری ارائه می‌دهید.</li>
        <li><strong className="text-zinc-200">داده‌های فنی:</strong> آدرس IP، نوع مرورگر، و رفتار کاربر در سایت که به صورت خودکار و ناشناس برای بهبود عملکرد سیستم ثبت می‌شوند.</li>
       </ul>
      </div>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۲. استفاده از اطلاعات</h2>
      <p className="text-zinc-400">
       داده‌های جمع‌آوری شده صرفاً برای اهداف زیر پردازش می‌شوند:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
       <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm">برقراری ارتباط و مشاوره فنی</li>
       <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm">ارسال مستندات و پروپوزال‌های پروژه</li>
       <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm">بهینه‌سازی امنیت و پایداری وب‌سایت</li>
       <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm">تحلیل آماری ترافیک (بدون هویت‌سنجی)</li>
      </ul>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۳. امنیت داده‌ها</h2>
      <p className="text-zinc-400">
       ما از پروتکل‌های رمزنگاری پیشرفته (SSL/TLS) برای انتقال داده‌ها استفاده می‌کنیم. دسترسی به پایگاه‌های داده محدود به پرسنل فنی ارشد بوده و تحت نظارت دقیق امنیتی قرار دارد. با این حال، انتقال اطلاعات در اینترنت هرگز ۱۰۰٪ امن نیست و ما تضمین می‌کنیم که استانداردهای صنعتی را رعایت کنیم.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۴. حقوق کاربر</h2>
      <p className="text-zinc-400">
       شما حق دارید در هر زمان درخواست کنید که اطلاعات شخصی شما از پایگاه داده‌های ما حذف شود یا نسخه‌ای از آن را دریافت کنید. برای اعمال این حق، لطفاً با ایمیل رسمی ما مکاتبه کنید.
      </p>
     </section>

     <section className="pt-8 border-t border-zinc-800">
      <p className="text-sm text-zinc-500 text-center">
       سوالی دارید؟ با ما تماس بگیرید: <span className="text-white font-en dir-ltr inline-block">privacy@baghaei.com</span>
      </p>
     </section>
    </div>
   </div>
   <Footer />
  </main>
 );
}