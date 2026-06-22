import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'ماشین‌حساب دیه',
  description:
    'محاسبهٔ دیهٔ کامل و دیهٔ اعضا و جراحات بر اساس نرخ رسمی قوهٔ قضاییه و مادهٔ ۵۴۹ قانون مجازات اسلامی.',
  alternates: { canonical: '/tools/diyeh' },
};

export default function Page() {
  return <Client />;
}
