import React from 'react';
import { Settings } from 'lucide-react';
import ErrorLayout from '@/components/layout/ErrorLayout';

export default function MaintenancePage() {
  return (
    <ErrorLayout
      code="۵۰۳"
      title="در حال بروزرسانی"
      description="ما در حال ارتقای سیستم هستیم تا تجربه بهتری برای شما بسازیم. لطفاً چند دقیقه دیگر برگردید."
    />
  );
}
