import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'محاسبه‌گر خمس',
  description:
    'برآورد خمس سود سالانه (مازاد بر مئونه) بر پایهٔ نرخ یک‌پنجم.',
  alternates: { canonical: '/tools/khoms' },
};

export default function Page() {
  return <Client />;
}
