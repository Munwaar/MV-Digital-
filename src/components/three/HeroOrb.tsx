import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { PointerState } from '@/hooks/useMousePosition';
import { lerp } from '@/lib/utils';

interface HeroOrbProps {
  pointer: React.RefObject<PointerState>;
  scrollProgress: React.RefObject<number>;
}

/** World-space anchor for the orb — right side of the hero's camera frustum. */
const BASE = { x: 2.7, y: 0.15, z: -1.1 };
/** The orb is only meant to live in the hero; it fades out by this scroll fraction. */
const FADE_OUT_AT = 0.22;

/**
 * The studio's centerpiece: a smooth organic blob with a glass-over-matte
 * finish (clearcoat + roughness) and a warm inner glow. Distortion runs on
 * the GPU via drei's MeshDistortMaterial — cheap regardless of geometry
 * detail — while rotation, floating, breathing and parallax are driven from
 * refs in a single useFrame, so none of it triggers React renders.
 */
export function HeroOrb({ pointer, scrollProgress }: HeroOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const parallax = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const glow = glowRef.current;
    if (!group || !mesh || !glow) return;

    const t = state.clock.getElapsedTime();

    // Slow continuous rotation, with a gentle tilt drift.
    mesh.rotation.y = t * 0.12;
    mesh.rotation.x = Math.sin(t * 0.15) * 0.16;

    // Gentle floating motion.
    group.position.y = BASE.y + Math.sin(t * 0.35) * 0.22;

    // Smooth breathing-like scale.
    const breathe = 1 + Math.sin(t * 0.55) * 0.035;
    mesh.scale.setScalar(breathe);
    glow.scale.setScalar(breathe * 1.18 + Math.sin(t * 0.55 + 0.6) * 0.03);

    // Soft pulsing glow via emissive intensity + inner core opacity.
    const material = mesh.material as THREE.MeshPhysicalMaterial;
    material.emissiveIntensity = 0.42 + Math.sin(t * 0.8) * 0.1;
    const glowMaterial = glow.material as THREE.MeshBasicMaterial;
    glowMaterial.opacity = 0.14 + Math.sin(t * 0.8 + 0.4) * 0.05;

    // Slight mouse parallax — subtle, never fights the cursor.
    const target = pointer.current;
    parallax.current.x = lerp(parallax.current.x, target.nx * 0.28, 0.035);
    parallax.current.y = lerp(parallax.current.y, -target.ny * 0.18, 0.035);
    group.position.x = BASE.x + parallax.current.x;
    group.rotation.y = parallax.current.x * 0.12;
    group.rotation.x = parallax.current.y * 0.08;

    // The orb belongs to the hero — fade and shrink away as the user
    // scrolls past it, rather than following them down the page.
    const scroll = scrollProgress.current ?? 0;
    const visibility = 1 - Math.min(1, scroll / FADE_OUT_AT);
    const eased = visibility * visibility * (3 - 2 * visibility); // smoothstep
    group.visible = eased > 0.01;
    material.opacity = eased;
    glowMaterial.opacity *= eased;
  });

  return (
    <group ref={groupRef} position={[BASE.x, BASE.y, BASE.z]}>
      {/* Inner warm core — reads through the glass surface as ambient glow */}
      <mesh ref={glowRef} scale={1.18}>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial color="#ff8c42" transparent opacity={0.16} depthWrite={false} />
      </mesh>

      {/* Main organic blob — glass-over-matte via clearcoat + roughness */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.15, 4]} />
        <MeshDistortMaterial
          color="#33160c"
          emissive="#ff6a2b"
          emissiveIntensity={0.42}
          roughness={0.34}
          metalness={0.18}
          clearcoat={0.65}
          clearcoatRoughness={0.16}
          envMapIntensity={1.3}
          distort={0.32}
          speed={1.3}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}
