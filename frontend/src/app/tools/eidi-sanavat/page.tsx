import type { Metadata } from 'next';
import Client from './Client';

// فعال (آزمایشی): حداقل دستمزد/پارامترها به‌صورت ورودی قابل ویرایش گرفته می‌شوند
// و نتیجه «برآورد» است. وضعیت ابزار در data/tools.ts روی 'beta' است تا نشان
// «آزمایشی» نمایش داده شود.
export const metadata: Metadata = {
  title: 'عیدی و سنوات',
  description:
    'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
  alternates: { canonical: '/tools/eidi-sanavat' },
};

export default function Page() {
  return <Client />;
}
