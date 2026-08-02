import { motion } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { HERO, STATS } from '@/data/content';
import { RevealText } from '@/components/ui/RevealText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { EASE_OUT_QUINT } from '@/lib/utils';

interface HeroProps {
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  return (
    <section id="hero" className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16">
        <div>
          <motion.span
            className="eyebrow mb-6 inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {HERO.eyebrow}
          </motion.span>

          {ready && (
            <RevealText
              lines={HERO.headline}
              as="h1"
              delay={0.15}
              className="font-display text-[13vw] font-medium leading-[0.92] tracking-tight text-paper sm:text-[9vw] md:text-[7vw] lg:text-[6.2vw]"
            />
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT_QUINT }}
            className="mt-8 max-w-lg text-lg font-light leading-relaxed text-paper-dim"
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT_QUINT }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href={HERO.ctaPrimary.href}>
              {HERO.ctaPrimary.label}
              <HiArrowUpRight />
            </MagneticButton>
            <MagneticButton href={HERO.ctaSecondary.href} variant="outline">
              {HERO.ctaSecondary.label}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl text-paper sm:text-4xl">{stat.value}</dd>
              <dd className="eyebrow mt-1 text-[0.62rem]">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <motion.div
          className="h-8 w-px bg-gradient-to-b from-molten to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
