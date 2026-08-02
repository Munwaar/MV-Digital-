import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { FloatingShards } from './FloatingShards';
import { ParticleField } from './ParticleField';
import { HeroOrb } from './HeroOrb';
import { HeroOrbAccents } from './HeroOrbAccents';
import { CameraRig } from './CameraRig';
import { PostFX } from './PostFX';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * Renders once, stays fixed behind the whole page. Scroll progress is read
 * from the document instead of a scroll-linked React state to avoid
 * re-rendering the tree on every scroll frame.
 *
 * PERFORMANCE: on touch + narrow-viewport devices (`useDeviceTier`), the
 * scene switches to a lighter pipeline — fewer lights, fewer particles, a
 * cheaper Bloom pass, no full-screen noise, no orbiting accent layer, and a
 * capped device pixel ratio. Everything that was making scrolling feel
 * laggy on phones (see FloatingShards + PostFX comments) is either removed
 * or scaled down here rather than in each component individually.
 */
export function Scene() {
  const pointer = useMousePosition();
  const scrollProgress = useRef(0);
  const isLowPower = useDeviceTier();

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <WebGLErrorBoundary>
        <Canvas
          dpr={isLowPower ? 1 : [1, 1.75]}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          camera={{ position: [0, 0, 6], fov: 45 }}
        >
          <color attach="background" args={['#0a0908']} />
          <fog attach="fog" args={['#0a0908', 6, 16]} />

          <ambientLight intensity={0.32} />
          <pointLight position={[5, 3, 4]} intensity={40} color="#ff6a2b" />
          {/* Local warm light for the hero orb's orange → coral gradient */}
          <pointLight position={[3.9, 1.1, 0.2]} intensity={isLowPower ? 20 : 26} color="#ffb347" distance={7} decay={2} />
          {/* The cool counter-fill and the deep-red rim light are the least
              essential to the read of the scene, so they're the first to go
              on constrained hardware — dropping two of five dynamic lights
              meaningfully cuts per-fragment lighting cost across every
              material in the scene. */}
          {!isLowPower && <pointLight position={[-5, -2, -2]} intensity={18} color="#7c93a3" />}
          {!isLowPower && <pointLight position={[1.6, -0.9, -2.1]} intensity={16} color="#c1272d" distance={7} decay={2} />}

          <Suspense fallback={null}>
            <Environment preset="city" environmentIntensity={0.4} resolution={isLowPower ? 64 : 256} />
            <FloatingShards lowPower={isLowPower} />
            <ParticleField count={isLowPower ? 260 : 700} />
            <HeroOrb pointer={pointer} scrollProgress={scrollProgress} />
            {!isLowPower && <HeroOrbAccents scrollProgress={scrollProgress} />}
            <PostFX lowPower={isLowPower} />
          </Suspense>

          <CameraRig pointer={pointer} scrollProgress={scrollProgress} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
