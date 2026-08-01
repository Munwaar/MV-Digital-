import { motion } from 'framer-motion';
import { ABOUT } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_OUT_QUINT } from '@/lib/utils';

export function Studio() {
  return (
    <section id="studio" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:gap-10">
        <SectionHeading eyebrow={ABOUT.eyebrow} lines={ABOUT.heading} />

        <div className="flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
            className="text-lg font-light leading-relaxed text-paper-dim"
          >
            {ABOUT.body}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_QUINT }}
            className="text-lg font-light leading-relaxed text-paper-dim"
          >
            {ABOUT.body2}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {ABOUT.values.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_QUINT }}
            className="group bg-ink p-8 transition-colors hover:bg-ink-2 md:p-10"
          >
            <span className="font-mono text-xs text-molten">0{i + 1}</span>
            <h3 className="mt-4 font-display text-2xl text-paper">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
