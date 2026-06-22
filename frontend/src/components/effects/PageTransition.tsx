'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// DECISION: enter-only fade (no AnimatePresence exit).
// The previous `exit` variant never played — there was no <AnimatePresence
// mode="wait"> keyed on the route to drive it. Adding one would keep the
// outgoing page mounted during its exit while Lenis (now mounted at the root)
// is re-anchoring scroll for the incoming route, which risks visible
// double-content / scroll jank on navigation. Keying the element on the
// pathname already remounts it per route, so this gives a clean cross-fade-in
// with zero exit risk. Lower-risk option chosen deliberately.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
    >
      {children}
    </motion.div>
  );
}
