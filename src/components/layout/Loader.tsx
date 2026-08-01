import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

const BLADE_COUNT = 8;

/**
 * The Aperture: the studio's signature load sequence. A ring of lens-blade
 * shapes iris-open around the mark while a counter ticks to 100, then the
 * whole assembly expands past the viewport to reveal the hero.
 */
export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');
  const bladesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => setPhase('opening'),
    });

    tl.to(counter, {
      value: 100,
      duration: reduced ? 0.3 : 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.floor(counter.value)),
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'opening') return;
    const blades = bladesRef.current?.querySelectorAll<HTMLElement>('.blade');
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        onComplete();
      },
    });

    if (blades) {
      tl.to(blades, {
        scale: 2.6,
        opacity: 0,
        duration: 0.9,
        stagger: 0.035,
        ease: 'power3.in',
      });
    }
    tl.to('.loader-mark', { opacity: 0, scale: 0.8, duration: 0.4 }, '<');
    tl.to('.loader-bg', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.5');
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="loader-bg fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0 }}
        >
          <div ref={bladesRef} className="relative flex h-40 w-40 items-center justify-center sm:h-56 sm:w-56">
            {Array.from({ length: BLADE_COUNT }).map((_, i) => {
              const angle = (360 / BLADE_COUNT) * i;
              return (
                <span
                  key={i}
                  className="blade absolute h-1/2 w-[3px] origin-bottom bg-gradient-to-t from-molten to-transparent"
                  style={{
                    top: 0,
                    left: '50%',
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    transformOrigin: '50% 100%',
                  }}
                />
              );
            })}
            <span className="loader-mark absolute font-display text-4xl font-medium text-paper sm:text-5xl">
              M
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="font-mono text-xs tracking-[0.4em] text-paper-dim">LOADING STUDIO</span>
            <span className="font-mono text-2xl tabular-nums text-molten">{String(progress).padStart(3, '0')}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
