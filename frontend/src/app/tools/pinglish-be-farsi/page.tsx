import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'مبدل پینگلیش به فارسی',
  description:
    'تبدیل متن فینگلیش (فارسی با حروف لاتین) به خط فارسی بر پایهٔ نگاشت آوایی.',
  alternates: { canonical: '/tools/pinglish-be-farsi' },
};

export default function Page() {
  return <Client />;
}
