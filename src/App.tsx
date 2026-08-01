import { Suspense, lazy, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader } from '@/components/layout/Loader';
import { Nav } from '@/components/layout/Nav';
import { Cursor } from '@/components/layout/Cursor';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Studio } from '@/components/sections/Studio';
import { Services } from '@/components/sections/Services';
import { useLenis } from '@/hooks/useLenis';

// Below-the-fold sections are code-split so the initial bundle stays lean.
const Work = lazy(() => import('@/components/sections/Work').then((m) => ({ default: m.Work })));
const Pricing = lazy(() => import('@/components/sections/Pricing').then((m) => ({ default: m.Pricing })));
const Process = lazy(() => import('@/components/sections/Process').then((m) => ({ default: m.Process })));
const Testimonials = lazy(() =>
  import('@/components/sections/Testimonials').then((m) => ({ default: m.Testimonials })),
);
const Contact = lazy(() => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })));
const Scene = lazy(() => import('@/components/three/Scene').then((m) => ({ default: m.Scene })));

export default function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <AnimatePresence>{loading && <Loader key="loader" onComplete={() => setLoading(false)} />}</AnimatePresence>

      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      {!loading && <Nav />}

      <main className="relative z-10 flex flex-col">
        <Hero ready={!loading} />
        <Studio />
        <Services />
        <Suspense fallback={<div className="h-96" />}>
          <Work />
          <Pricing />
          <Process />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
