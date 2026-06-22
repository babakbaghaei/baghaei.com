import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
 title: 'قوانین و مقررات',
 description: 'شرایط و قوانین استفاده از خدمات و وب‌سایت گروه فناوری بقایی.',
 alternates: { canonical: '/terms' },
 robots: { index: false },
};

export default function TermsPage() {
 return (
  <LegalLayout title="شرایط" titleAccent="استفاده." lastUpdated="۲ دی ۱۴۰۴">
     <section className="space-y-4">
      <p>
       به وب‌سایت گروه فناوری بقایی خوش آمدید. دسترسی و استفاده شما از خدمات ما مشروط به پذیرش و رعایت شرایط زیر است. این توافق‌نامه تمامی بازدیدکنندگان، کاربران و سایر افرادی که به خدمات دسترسی دارند را شامل می‌شود.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۱. مالکیت معنوی</h2>
      <p className="text-muted-foreground">
       خدمات و محتوای اصلی آن (شامل اما نه محدود به طراحی‌ها، متون، گرافیک، کدها و لوگوها) دارایی انحصاری گروه فناوری بقایی هستند.
      </p>
      <ul className="list-disc list-inside space-y-2 pr-4 text-muted-foreground mt-2">
       <li>هرگونه کپی‌برداری، بازتولید یا مهندسی معکوس بدون مجوز کتبی ممنوع است.</li>
       <li>استفاده از نام تجاری یا علائم تجاری ما در ارتباط با هر محصول یا سرویسی که متعلق به ما نیست، مجاز نمی‌باشد.</li>
      </ul>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۲. تعهدات کاربر</h2>
      <div className="space-y-4 text-muted-foreground">
       <p>شما متعهد می‌شوید که:</p>
       <ul className="list-disc list-inside space-y-2 pr-4 marker:text-muted-foreground">
        <li>از خدمات ما برای مقاصد غیرقانونی یا آسیب‌رسان استفاده نکنید.</li>
        <li>تلاشی برای نفوذ به زیرساخت‌ها، سرورها یا پایگاه داده‌های ما انجام ندهید.</li>
        <li>اطلاعات دقیق و صحیح در فرم‌های ارتباطی وارد نمایید.</li>
       </ul>
      </div>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۳. سلب مسئولیت</h2>
      <p className="text-muted-foreground">
       خدمات ما «همان‌گونه که هست» ارائه می‌شود. اگرچه ما برای پایداری و امنیت تلاش می‌کنیم، اما تضمینی مبنی بر عدم وقفه، خطا یا ویروس نمی‌دهیم. گروه فناوری بقایی در قبال خسارات غیرمستقیم، تصادفی یا تبعی ناشی از استفاده از وب‌سایت مسئولیتی ندارد.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۴. تغییرات در شرایط</h2>
      <p className="text-muted-foreground">
       ما حق اصلاح یا جایگزینی این شرایط را در هر زمان برای خود محفوظ می‌داریم. ادامه استفاده شما از خدمات پس از اعمال تغییرات، به منزله پذیرش شرایط جدید خواهد بود. توصیه می‌شود به صورت دوره‌ای این صفحه را بررسی کنید.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۵. قانون حاکم</h2>
      <p className="text-muted-foreground">
       این شرایط بر اساس قوانین جمهوری اسلامی ایران تفسیر و اجرا می‌شود. هرگونه اختلاف ناشی از این شرایط در صلاحیت دادگاه‌های تهران خواهد بود.
      </p>
     </section>

     <section className="pt-8 border-t border-border">
      <p className="text-sm text-muted-foreground text-center">
       تماس حقوقی: <a href="mailto:legal@baghaei.com" dir="ltr" className="text-foreground font-mono inline-block hover:underline">legal@baghaei.com</a>
      </p>
     </section>
  </LegalLayout>
 );
}