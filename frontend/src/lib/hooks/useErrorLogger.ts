'use client';

import { useEffect } from 'react';

export const useErrorLogger = (error: Error) => {
 useEffect(() => {
  // Placeholder for Sentry/LogRocket integration
  console.error('[Error Logger]:', {
   message: error.message,
   stack: error.stack,
   timestamp: new Date().toISOString(),
   url: window.location.href
  });
  
  // Example: Sentry.captureException(error);
 }, [error]);
};
