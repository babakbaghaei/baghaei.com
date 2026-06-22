import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'اجرت‌المثل ایام تصرف',
  description:
    'برآورد اجرت‌المثل تصرف غیرمجاز ملک و خسارت تأخیر در تخلیه بر مبنای ارزش اجارهٔ ماهانه.',
  alternates: { canonical: '/tools/ajrat-mesl' },
};

export default function Page() {
  return <Client />;
}
