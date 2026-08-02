import { useState } from 'react';

/**
 * A conservative, one-time check (not reactive to resize/rotation — device
 * class doesn't change mid-session) used to decide whether the 3D scene
 * should run its full-quality pipeline or a lighter one. Combines a coarse
 * pointer (phones/tablets) with a narrow viewport, since either alone can
 * false-positive (a touch laptop, a resized desktop window).
 */
function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrowViewport = window.matchMedia('(max-width: 820px)').matches;
  return coarsePointer && narrowViewport;
}

export function useDeviceTier() {
  const [isLowPower] = useState(detectLowPower);
  return isLowPower;
}
