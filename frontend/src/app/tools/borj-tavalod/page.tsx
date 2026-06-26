import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'طالع‌بینی برج تولد',
  description: 'برج فلکی (طالع) خود را از روی تاریخ تولد بیابید؛ به‌همراه عنصر، ویژگی‌های شخصیتی و سازگاری با برج‌های دیگر.',
  alternates: { canonical: '/tools/borj-tavalod' },
};

export default function Page() {
  return <Client />;
}
