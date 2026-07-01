import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'بازی دوز (ایکس و او)',
  description:
    'بازی کلاسیک دوز (ایکس و او) به‌صورت آنلاین و رایگان در برابر رایانه؛ با سه سطح سختی آسان، متوسط و حرفه‌ای، انتخاب نفر شروع‌کننده، جدول امتیاز برد و باخت و مساوی، و حرکت‌های روان و انیمیشن‌دار. سطح حرفه‌ای هرگز نمی‌بازد.',
  alternates: { canonical: '/tools/dooz' },
};

export default function Page() {
  return <Client />;
}
