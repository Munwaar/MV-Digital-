import { motion } from 'framer-motion';
import { EASE_OUT_QUINT, cn } from '@/lib/utils';

interface RevealTextProps {
  lines: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  delay?: number;
  once?: boolean;
}

/**
 * Reveals each line from behind an overflow mask with a staggered
 * clip + rise, the type-focused equivalent of an image wipe reveal.
 */
export function RevealText({ lines, className, as = 'h2', delay = 0, once = true }: RevealTextProps) {
  const Tag = as;
  return (
    <Tag className={cn('overflow-hidden', className ?? '')}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once, margin: '-10%' }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE_OUT_QUINT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
