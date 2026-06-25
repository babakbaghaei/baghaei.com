import type { Metadata } from 'next';
import Client from './Client';

// فعال (آزمایشی): نرخ شاخص بانک مرکزی به‌صورت ورودی قابل ویرایش از کاربر گرفته
// می‌شود و نتیجه «برآورد» است. وضعیت ابزار در data/tools.ts روی 'beta' است تا
// نشان «آزمایشی» نمایش داده شود.
export const metadata: Metadata = {
  title: 'خسارت تأخیر تأدیه',
  description:
    'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
  alternates: { canonical: '/tools/khesarat-takhir' },
};

export default function Page() {
  return <Client />;
}
