import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { SERVICES } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_OUT_QUINT } from '@/lib/utils';

export function Services() {
  const [openId, setOpenId] = useState<string>(SERVICES[0].id);

  return (
    <section id="services" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What We Do" lines={['Services built', 'around outcomes.']} className="mb-16" />

        <div className="divide-y divide-line border-y border-line">
          {SERVICES.map((service, i) => {
            const isOpen = openId === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : service.id)}
                  data-cursor="link"
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-molten">0{i + 1}</span>
                    <span className="font-display text-2xl text-paper transition-colors group-hover:text-molten sm:text-3xl">
                      {service.title}
                    </span>
                  </div>
                  <HiOutlineArrowRight
                    className={`shrink-0 text-xl text-molten transition-transform duration-500 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 pb-8 pl-0 sm:grid-cols-[1fr_auto] sm:pl-16">
                    <p className="max-w-md text-sm leading-relaxed text-paper-dim">{service.description}</p>
                    <ul className="flex flex-wrap gap-2 sm:justify-end">
                      {service.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] text-paper-dim"
                        >
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
