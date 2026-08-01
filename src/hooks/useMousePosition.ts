import { useEffect, useRef } from 'react';

export interface PointerState {
  x: number; // px
  y: number; // px
  nx: number; // -1..1 normalized from center
  ny: number; // -1..1 normalized from center
}

/**
 * Tracks pointer position in a ref (no re-renders) so consumers such as
 * R3F scenes or GSAP tickers can read the latest value on their own loop.
 */
export function useMousePosition() {
  const pointer = useRef<PointerState>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const x = e.clientX;
      const y = e.clientY;
      pointer.current = {
        x,
        y,
        nx: (x / window.innerWidth) * 2 - 1,
        ny: (y / window.innerHeight) * 2 - 1,
      };
    }
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return pointer;
}
