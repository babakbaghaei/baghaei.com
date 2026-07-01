import React from 'react';
import type { Metadata } from 'next';
import LegalLayout from '@/components/layout/LegalLayout';

export const metadata: Metadata = {
 title: 'حریم خصوصی',
 description: 'سیاست حریم خصوصی گروه فناوری بقائی؛ نحوه جمع‌آوری، استفاده و محافظت از اطلاعات شما.',
 alternates: { canonical: '/privacy' },
 robots: { index: false },
};

export default function PrivacyPage() {
 return (
  <LegalLayout
   title="حریم"
   titleAccent="خصوصی."
   lastUpdated="۲ دی ۱۴۰۴"
   contactLabel="سوالی دارید؟ با ما در تماس باشید:"
   contactEmail="privacy@baghaei.com"
  >
     <section className="space-y-4">
      <p>
       در گروه فناوری بقائی، امنیت اطلاعات و حریم خصوصی شما اولویت اصلی ماست. این سند شرح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم. ما متعهد به شفافیت کامل در پردازش داده‌های شما هستیم.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۱. جمع‌آوری داده‌ها</h2>
      <div className="space-y-4 text-muted-foreground">
       <p>ما اطلاعات را در دو دسته جمع‌آوری می‌کنیم:</p>
       <ul className="list-disc list-inside space-y-2 pr-4 marker:text-muted-foreground">
        <li><strong className="text-foreground">اطلاعات هویتی:</strong> نام، ایمیل، و شماره تماس که شما داوطلبانه از طریق فرم‌های تماس برای شروع همکاری ارائه می‌دهید.</li>
        <li><strong className="text-foreground">داده‌های فنی:</strong> آدرس IP، نوع مرورگر، و رفتار کاربر در سایت که به صورت خودکار و ناشناس برای بهبود عملکرد سیستم ثبت می‌شوند.</li>
       </ul>
      </div>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۲. استفاده از اطلاعات</h2>
      <p className="text-muted-foreground">
       داده‌های جمع‌آوری شده صرفاً برای اهداف زیر پردازش می‌شوند:
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
       <li className="bg-card/50 p-4 rounded-xl border border-border text-sm">برقراری ارتباط و مشاوره فنی</li>
       <li className="bg-card/50 p-4 rounded-xl border border-border text-sm">ارسال مستندات و پروپوزال‌های پروژه</li>
       <li className="bg-card/50 p-4 rounded-xl border border-border text-sm">بهینه‌سازی امنیت و پایداری وب‌سایت</li>
       <li className="bg-card/50 p-4 rounded-xl border border-border text-sm">تحلیل آماری ترافیک (بدون هویت‌سنجی)</li>
      </ul>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۳. امنیت داده‌ها</h2>
      <p className="text-muted-foreground">
       ما از پروتکل‌های رمزنگاری پیشرفته (SSL/TLS) برای انتقال داده‌ها استفاده می‌کنیم. دسترسی به پایگاه‌های داده محدود به پرسنل فنی ارشد بوده و تحت نظارت دقیق امنیتی قرار دارد. با این حال، انتقال اطلاعات در اینترنت هرگز ۱۰۰٪ امن نیست و ما تضمین می‌کنیم که استانداردهای صنعتی را رعایت کنیم.
      </p>
     </section>

     <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground font-display border-s-2 border-primary ps-4">۴. حقوق کاربر</h2>
      <p className="text-muted-foreground">
       شما حق دارید در هر زمان درخواست کنید که اطلاعات شخصی شما از پایگاه داده‌های ما حذف شود یا نسخه‌ای از آن را دریافت کنید. برای اعمال این حق، لطفاً با ایمیل رسمی ما مکاتبه کنید.
      </p>
     </section>
  </LegalLayout>
 );
}