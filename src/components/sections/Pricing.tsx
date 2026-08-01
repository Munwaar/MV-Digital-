import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { PRICING } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useMagnetic } from '@/hooks/useMagnetic';
import { EASE_OUT_QUINT } from '@/lib/utils';

function PricingCard({ plan, index }: { plan: (typeof PRICING)[number]; index: number }) {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.25);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_OUT_QUINT }}
      className={`relative flex flex-col bg-ink p-8 transition-colors md:p-9 ${
        plan.featured ? 'border-2 border-molten' : 'border border-line'
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-molten px-3 py-1 font-mono text-[0.6rem] tracking-widest text-ink">
          MOST POPULAR
        </span>
      )}

      <span className="font-mono text-xs text-molten">0{index + 1}</span>
      <h3 className="mt-4 font-display text-2xl text-paper">{plan.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-paper-dim">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl text-paper">{plan.price}</span>
        <span className="text-xs text-paper-dim">one-time</span>
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-paper-dim">
            <HiCheck className="mt-0.5 shrink-0 text-molten" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        ref={ctaRef}
        href="#contact"
        data-cursor="link"
        className={`mt-8 inline-flex items-center justify-center rounded-full py-3 text-sm font-medium transition-colors ${
          plan.featured ? 'bg-molten text-ink hover:bg-ember' : 'border border-line text-paper hover:border-molten hover:text-molten'
        }`}
      >
        Get Started
      </a>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative w-full px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Pricing" lines={['Simple pricing,', 'built for growth.']} />
          <p className="max-w-xs text-sm text-paper-dim">
            Straightforward, one-time project pricing in INR. No hidden fees, no long-term contracts.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
