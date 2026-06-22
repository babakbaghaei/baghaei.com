import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'عیدی و سنوات',
  description:
    'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
  alternates: { canonical: '/tools/eidi-sanavat' },
};

export default function Page() {
  return <Client />;
}
