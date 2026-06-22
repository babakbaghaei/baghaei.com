import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مبدل عدد به حروف',
  description: 'تبدیل مبلغ عددی به حروف فارسی برای نوشتن چک، قرارداد و اسناد مالی.',
  alternates: { canonical: '/tools/adad-be-horoof' },
};

export default function Page() {
  return <Client />;
}
