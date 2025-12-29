'use client';

import React from 'react';
import ErrorLayout from '@/components/layout/ErrorLayout';

export default function Forbidden() {
 return (
  <ErrorLayout 
   code="۴۰۳" 
   title="دسترسی غیرمجاز." 
   description="شما اجازه دسترسی به این بخش از زیرساخت را ندارید."
  />
 );
}
