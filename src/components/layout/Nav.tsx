import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBars3, HiOutlineXMark, HiArrowUpRight } from 'react-icons/hi2';
import { NAV_LINKS, STUDIO } from '@/data/content';
import { useMagnetic } from '@/hooks/useMagnetic';
import { EASE_OUT_QUINT } from '@/lib/utils';

function NavImpl() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_QUINT }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-ink/80 backdrop-blur-md border-b border-line' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a
            ref={magneticRef}
            href="#hero"
            data-cursor="link"
            className="flex items-center gap-2 font-display text-lg font-medium tracking-tight text-paper"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-molten/40 text-sm text-molten">
              M
            </span>
            <span className="hidden sm:inline">MV Digital Studio</span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="link"
                  className="eyebrow text-paper-dim transition-colors hover:text-molten"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            data-cursor="link"
            className="group hidden items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-paper transition-colors hover:border-molten md:flex"
          >
            Start a Project
            <HiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl text-paper md:hidden"
            aria-label="Open menu"
          >
            <HiOutlineBars3 />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex flex-col bg-ink px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-paper">{STUDIO.name}</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-paper"
                aria-label="Close menu"
              >
                <HiOutlineXMark />
              </button>
            </div>

            <ul className="mt-16 flex flex-1 flex-col justify-center gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE_OUT_QUINT }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl text-paper transition-colors hover:text-molten"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <a href={`mailto:${STUDIO.email}`} className="font-mono text-sm text-paper-dim">
              {STUDIO.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const Nav = memo(NavImpl);
