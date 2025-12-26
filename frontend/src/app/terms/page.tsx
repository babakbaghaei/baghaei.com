import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
 return (
  <main className="min-h-screen bg-black text-white pt-48 pb-20 px-6 relative overflow-hidden">
    {/* Background Noise/Grid */}
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

   <Navbar />
   
   <div className="max-w-4xl mx-auto space-y-16 relative z-10">
    <header className="space-y-6 border-b border-zinc-800 pb-12">
     <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none">
      شرایط <span className="text-zinc-500">استفاده.</span>
     </h1>
     <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
      آخرین بروزرسانی: ۲ دی ۱۴۰۴
     </p>
    </header>

    <div className="space-y-12 font-sans text-zinc-300 leading-loose text-lg text-justify">
     <section className="space-y-4">
      <p>
       به وب‌سایت گروه فناوری بقایی خوش آمدید. دسترسی و استفاده شما از خدمات ما مشروط به پذیرش و رعایت شرایط زیر است. این توافق‌نامه تمامی بازدیدکنندگان، کاربران و سایر افرادی که به خدمات دسترسی دارند را شامل می‌شود.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۱. مالکیت معنوی</h2>
      <p className="text-zinc-400">
       خدمات و محتوای اصلی آن (شامل اما نه محدود به طراحی‌ها، متون، گرافیک، کدها و لوگوها) دارایی انحصاری گروه فناوری بقایی هستند.
      </p>
      <ul className="list-disc list-inside space-y-2 pr-4 text-zinc-400 mt-2">
       <li>هرگونه کپی‌برداری، بازتولید یا مهندسی معکوس بدون مجوز کتبی ممنوع است.</li>
       <li>استفاده از نام تجاری یا علائم تجاری ما در ارتباط با هر محصول یا سرویسی که متعلق به ما نیست، مجاز نمی‌باشد.</li>
      </ul>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۲. تعهدات کاربر</h2>
      <div className="space-y-4 text-zinc-400">
       <p>شما متعهد می‌شوید که:</p>
       <ul className="list-disc list-inside space-y-2 pr-4 marker:text-zinc-600">
        <li>از خدمات ما برای مقاصد غیرقانونی یا آسیب‌رسان استفاده نکنید.</li>
        <li>تلاشی برای نفوذ به زیرساخت‌ها، سرورها یا پایگاه داده‌های ما انجام ندهید.</li>
        <li>اطلاعات دقیق و صحیح در فرم‌های ارتباطی وارد نمایید.</li>
       </ul>
      </div>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۳. سلب مسئولیت</h2>
      <p className="text-zinc-400">
       خدمات ما «همان‌گونه که هست» ارائه می‌شود. اگرچه ما برای پایداری و امنیت تلاش می‌کنیم، اما تضمینی مبنی بر عدم وقفه، خطا یا ویروس نمی‌دهیم. گروه فناوری بقایی در قبال خسارات غیرمستقیم، تصادفی یا تبعی ناشی از استفاده از وب‌سایت مسئولیتی ندارد.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۴. تغییرات در شرایط</h2>
      <p className="text-zinc-400">
       ما حق اصلاح یا جایگزینی این شرایط را در هر زمان برای خود محفوظ می‌داریم. ادامه استفاده شما از خدمات پس از اعمال تغییرات، به منزله پذیرش شرایط جدید خواهد بود. توصیه می‌شود به صورت دوره‌ای این صفحه را بررسی کنید.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-display border-r-2 border-white pr-4">۵. قانون حاکم</h2>
      <p className="text-zinc-400">
       این شرایط بر اساس قوانین جمهوری اسلامی ایران تفسیر و اجرا می‌شود. هرگونه اختلاف ناشی از این شرایط در صلاحیت دادگاه‌های تهران خواهد بود.
      </p>
     </section>

     <section className="pt-8 border-t border-zinc-800">
      <p className="text-sm text-zinc-500 text-center">
       تماس حقوقی: <span className="text-white font-en dir-ltr inline-block">legal@baghaei.com</span>
      </p>
     </section>
    </div>
   </div>
   <Footer />
  </main>
 );
}