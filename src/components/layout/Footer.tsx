import { memo } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi2';
import { NAV_LINKS, SOCIALS, STUDIO } from '@/data/content';

function FooterImpl() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink px-6 py-16 md:px-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute bottom-0 h-10 w-px bg-gradient-to-t from-molten/50 to-transparent"
          style={{ left: `${8 + i * 16}%` }}
          animate={{ y: [0, -90], opacity: [0, 0.6, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="font-display text-3xl text-paper">{STUDIO.name}</span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper-dim">
            A boutique digital studio designing and engineering cinematic web experiences for brands with
            something worth saying.
          </p>
        </div>

        <div>
          <span className="eyebrow">Navigate</span>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-paper-dim transition-colors hover:text-molten">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow">Connect</span>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={`mailto:${STUDIO.email}`} className="text-sm text-paper-dim transition-colors hover:text-molten">
                {STUDIO.email}
              </a>
            </li>
            {SOCIALS.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-paper-dim transition-colors hover:text-molten"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-line pt-8 text-xs text-paper-dim md:flex-row">
        <span>&copy; {new Date().getFullYear()} {STUDIO.name}. All rights reserved.</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          data-cursor="link"
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 transition-colors hover:border-molten hover:text-molten"
        >
          Back to top <HiArrowUp />
        </button>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterImpl);
