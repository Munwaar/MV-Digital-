import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: 'solid' | 'outline';
}

export function MagneticButton({ children, className, variant = 'solid', ...props }: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(0.4);

  return (
    <a
      ref={ref}
      data-cursor="link"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300',
        variant === 'solid'
          ? 'bg-molten text-ink hover:bg-ember'
          : 'border border-line text-paper hover:border-molten hover:text-molten',
        className ?? '',
      )}
      {...props}
    >
      {children}
    </a>
  );
}
