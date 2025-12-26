'use client';

import React from 'react';
import ErrorLayout from '@/components/layout/ErrorLayout';

export default function NotFound() {
 return (
  <ErrorLayout 
   code="۴۰۴" 
   title="مسیر پیدا نشد." 
   description="متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است."
  />
 );
}
