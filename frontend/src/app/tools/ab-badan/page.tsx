import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'آب موردنیاز بدن',
  description:
    'برآورد میزان آب روزانهٔ موردنیاز بدن بر اساس وزن و سطح فعالیت.',
  alternates: { canonical: '/tools/ab-badan' },
};

export default function Page() {
  return <Client />;
}
