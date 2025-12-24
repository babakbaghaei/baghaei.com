'use client';

import React, { useEffect } from 'react';
import ErrorLayout from '@/components/layout/ErrorLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorLayout 
      code="۵۰۰" 
      title="اختلال فنی." 
      description="خطایی در پردازش درخواست رخ داد. تیم فنی در حال بررسی موضوع است."
    />
  );
}
