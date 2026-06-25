import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'خسارت تأخیر چک برگشتی',
  description:
    'برآورد خسارت تأخیر تأدیه مبلغ چک برگشتی بر مبنای نرخ شاخص و تعداد روز تأخیر.',
  alternates: { canonical: '/tools/khesarat-cheque' },
};

export default function Page() {
  return <Client />;
}
