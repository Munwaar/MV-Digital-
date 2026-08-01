import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Replaces the default cursor with a small aperture ring on pointer devices.
 * The ring scales and fills whenever the cursor is over an interactive
 * element flagged with [data-cursor="link"].
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const ringPos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };

    function handleMove(e: PointerEvent) {
      dotPos.x = e.clientX;
      dotPos.y = e.clientY;
      gsap.to(ringPos, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
        onUpdate: () => {
          ring!.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
        },
      });
      dot!.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`;
    }

    function handleOver(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest('[data-cursor="link"]');
      gsap.to(ring, {
        scale: target ? 2.4 : 1,
        opacity: target ? 0.5 : 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-molten"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border border-molten/60"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
