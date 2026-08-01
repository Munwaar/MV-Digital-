import { motion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { PROJECTS } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_OUT_QUINT } from '@/lib/utils';

export function Work() {
  return (
    <section id="work" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Selected Work" lines={['Recent projects,', 'shipped and live.']} />
          <p className="max-w-xs text-sm text-paper-dim">
            A handful of engagements from the last three years across fintech, hardware and product design.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.a
              key={project.id}
              href="#contact"
              data-cursor="link"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE_OUT_QUINT }}
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden bg-ink p-8 md:p-10"
            >
              {/* Frame corners — viewfinder motif, echoes the studio mark */}
              <span className="frame-corners absolute inset-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="fc-tr" />
                <span className="fc-bl" />
              </span>

              {/* Ambient glow on hover */}
              <div
                className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,106,43,0.1), transparent 60%)' }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <span className="font-mono text-xs text-paper-dim">{project.category}</span>
                <span className="font-mono text-xs text-paper-dim">{project.year}</span>
              </div>

              <div className="relative z-10">
                <h3 className="font-display text-4xl text-paper transition-transform duration-500 group-hover:-translate-y-1 md:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper-dim">{project.description}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] text-paper-dim">
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line text-molten transition-colors group-hover:border-molten">
                    <HiArrowUpRight />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
