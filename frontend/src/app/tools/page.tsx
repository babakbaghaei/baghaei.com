import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: 'جعبه ابزار',
  description:
    'مجموعه ابزارهای رایگان آنلاین: ماشین‌حساب‌های حقوقی، مالی، ملکی و کمکی. همه محاسبات در مرورگر شما.',
  alternates: { canonical: '/tools' },
};

export default function Page() {
  return <ToolsClient />;
}
