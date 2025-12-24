'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
      // Performance tweaks
      autoRaf: true, // Let Lenis handle requestAnimationFrame efficiently
    });

    // Handle frame updates efficiently
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Throttled scroll listener for lighter body classes
    const onScroll = () => {
      if (lenis.isScrolling) {
        document.body.setAttribute('data-scrolling', 'true');
      } else {
        document.body.removeAttribute('data-scrolling');
      }
    };
    lenis.on('scroll', onScroll);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}