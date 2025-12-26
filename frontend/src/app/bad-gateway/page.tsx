'use client';

import React from 'react';
import ErrorLayout from '@/components/layout/ErrorLayout';

export default function BadGateway() {
 return (
  <ErrorLayout 
   code="۵۰۲" 
   title="خطای درگاه." 
   description="ارتباط با سرور اصلی برقرار نشد. لطفاً چند لحظه دیگر تلاش کنید."
  />
 );
}
