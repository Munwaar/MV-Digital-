import { motion } from 'framer-motion';
import { PROCESS } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_OUT_QUINT } from '@/lib/utils';

export function Process() {
  return (
    <section id="process" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="How We Work" lines={['A process built', 'for momentum.']} className="mb-16" />

        <div className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Connecting line — real sequence, so a rail is earned here */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-line md:block" />

          {PROCESS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT_QUINT }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-molten/50 bg-ink font-mono text-sm text-molten">
                {item.step}
              </div>
              <h3 className="mt-6 font-display text-2xl text-paper">{item.title}</h3>
              <span className="eyebrow mt-1 block text-[0.6rem]">{item.duration}</span>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
