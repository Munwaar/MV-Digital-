import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { TESTIMONIALS } from '@/data/content';
import { EASE_OUT_QUINT } from '@/lib/utils';

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const testimonial = TESTIMONIALS[index];

  return (
    <section className="relative w-full border-y border-line px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="eyebrow mb-10">Client Words</span>

        <div className="relative min-h-[10rem] w-full">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
            >
              <p className="font-display text-2xl font-normal leading-snug text-paper sm:text-3xl md:text-4xl">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-8 font-mono text-xs tracking-widest text-paper-dim">
                {testimonial.name.toUpperCase()} · {testimonial.title}, {testimonial.company}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <button
            aria-label="Previous testimonial"
            data-cursor="link"
            onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-molten hover:text-molten"
          >
            <HiOutlineChevronLeft />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-molten' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next testimonial"
            data-cursor="link"
            onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-molten hover:text-molten"
          >
            <HiOutlineChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
