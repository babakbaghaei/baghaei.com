import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'خسارت تأخیر تأدیه',
  description:
    'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
  alternates: { canonical: '/tools/khesarat-takhir' },
};

export default function Page() {
  return <Client />;
}
