'use client';

import { useReducedMotion } from 'framer-motion';
import { useSyncExternalStore } from 'react';

function subscribeMobile(onStoreChange: () => void) {
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function getServerMobileSnapshot() {
  return false;
}

/** Skip enter/reveal animations on mobile and when the user prefers reduced motion. */
export function useLiteMotion(): boolean {
  const reducedMotion = useReducedMotion();
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  return !reducedMotion && !isMobile;
}

export type MotionRevealProps = {
  initial?: false | { opacity: number; y?: number; x?: number };
  animate?: { opacity: number; y?: number; x?: number };
  whileInView?: { opacity: number; y?: number; x?: number };
  transition?: { duration?: number; delay?: number };
  viewport?: { once?: boolean };
};

export function viewRevealProps(enabled: boolean, delay = 0): MotionRevealProps {
  if (!enabled) return { initial: false };
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
    viewport: { once: true },
  };
}

export function enterProps(enabled: boolean, delay = 0): MotionRevealProps {
  if (!enabled) return { initial: false };
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  };
}
