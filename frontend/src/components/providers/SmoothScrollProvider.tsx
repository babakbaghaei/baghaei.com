'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef } from 'react';

// Conservative Lenis config. `root` drives the native document scroll, so
// Framer's useScroll()/scrollYProgress (GlobalUniverse background) and native
// element.scrollIntoView({ behavior: 'smooth' }) (Navbar / Hero / planets)
// keep working unchanged. `data-lenis-prevent` (used by ProjectModal) is
// natively respected so modal inner scroll isn't hijacked.
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

  // Bridge the existing `body.lenis-stopped` scroll-lock hook (toggled by
  // ProjectModal / CommandMenu / MobileMenu) to an actual lenis.stop(). Setting
  // body { overflow: hidden } alone does NOT halt the smoothed root scroll, so
  // without this the page keeps gliding behind open overlays.
  useEffect(() => {
    const sync = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (document.body.classList.contains('lenis-stopped')) lenis.stop();
      else lenis.start();
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
