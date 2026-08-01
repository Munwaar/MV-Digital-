import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

/**
 * Initializes Lenis smooth scrolling and syncs it with GSAP's ticker so
 * ScrollTrigger-based animations stay perfectly in step with scroll position.
 *
 * SCROLL BUG FIX — root cause & resolution:
 * The previous setup called `gsap.ticker.lagSmoothing(0)`, which fully disables
 * GSAP's frame-time clamping. Whenever the main thread stalled for a moment
 * (a lazy-loaded chunk parsing, a GC pause, a tab losing focus), the very next
 * tick handed Lenis a large, uncompensated `deltaTime`. Lenis's animate loop
 * integrates scroll position over real elapsed time, so that one oversized
 * delta made the scroll animation jump ahead and "catch up" on its own —
 * exactly the "scroll continues automatically" / "delayed then lurches"
 * behavior that was reported. On top of that, `touchMultiplier` was set to
 * 1.5 (50% above Lenis's default of 1), which over-amplified touch/trackpad
 * momentum and made it noticeably harder to reverse direction and scroll
 * back up before that excess momentum had bled off.
 *
 * Fix: let GSAP clamp lag with its default (sane) threshold instead of
 * disabling it, and use Lenis's default multipliers/duration so momentum
 * stays proportional to actual input. `autoResize` (Lenis default: on) is
 * left untouched, so content that mounts later — e.g. lazily-loaded
 * below-the-fold sections — is measured correctly without any manual
 * `resize()` calls or duplicate listeners.
 */
export function useLenis(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Guard against a stray double-instance (e.g. React StrictMode's
    // dev-only double-invoke of effects) ever leaving two rAF loops alive.
    if (lenisRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.1 : 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
    }
    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}

