'use client';

import { MotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Centralized accessibility gate for all Framer Motion animations.
 * `reducedMotion="user"` makes every <motion.*> component automatically drop
 * transform/layout animations (x, y, scale, rotate, layout) when the visitor
 * has `prefers-reduced-motion: reduce` set — while preserving opacity fades,
 * which are WCAG-safe. This covers the bulk of the site's entrance/hover
 * animations from a single point; manual useTransform/spring effects still
 * guard themselves with the useReducedMotion() hook where needed.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
