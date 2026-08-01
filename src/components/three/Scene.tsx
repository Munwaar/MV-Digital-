import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { FloatingShards } from './FloatingShards';
import { ParticleField } from './ParticleField';
import { CameraRig } from './CameraRig';
import { PostFX } from './PostFX';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import { useMousePosition } from '@/hooks/useMousePosition';

/**
 * Renders once, stays fixed behind the whole page. Scroll progress is read
 * from the document instead of a scroll-linked React state to avoid
 * re-rendering the tree on every scroll frame.
 */
export function Scene() {
  const pointer = useMousePosition();
  const scrollProgress = useRef(0);

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
          dpr={[1, 1.75]}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          camera={{ position: [0, 0, 6], fov: 45 }}
        >
          <color attach="background" args={['#0a0908']} />
          <fog attach="fog" args={['#0a0908', 6, 16]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[5, 3, 4]} intensity={40} color="#ff6a2b" />
          <pointLight position={[-5, -2, -2]} intensity={18} color="#7c93a3" />

          <Suspense fallback={null}>
            <Environment preset="city" environmentIntensity={0.4} />
            <FloatingShards />
            <ParticleField />
            <PostFX />
          </Suspense>

          <CameraRig pointer={pointer} scrollProgress={scrollProgress} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
