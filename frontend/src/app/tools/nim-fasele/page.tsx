import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'اصلاح نیم‌فاصله و متن فارسی',
  description:
    'نرمال‌سازی متن فارسی: اصلاح نیم‌فاصله، تبدیل ي/ك عربی به ی/ک، حذف فاصله‌های اضافی و یکدست‌سازی اعداد.',
  alternates: { canonical: '/tools/nim-fasele' },
};

export default function Page() {
  return <Client />;
}
