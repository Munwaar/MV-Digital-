import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { EASE_OUT_QUINT, cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  lines: string[];
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, lines, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : '', className ?? '')}>
      <motion.span
        className="eyebrow mb-5 block"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
      >
        {eyebrow}
      </motion.span>
      <RevealText
        lines={lines}
        as="h2"
        className="font-display text-4xl font-medium leading-[1.05] text-paper sm:text-5xl md:text-6xl"
      />
    </div>
  );
}
