import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface HeroOrbAccentsProps {
  scrollProgress: React.RefObject<number>;
}

const CENTER: [number, number, number] = [2.7, 0.15, -1.1];
const FADE_OUT_AT = 0.22;
const PARTICLE_COUNT = 42;

type ShapeKind = 'ring' | 'cube' | 'sphere';

interface ShapeConfig {
  kind: ShapeKind;
  position: [number, number, number];
  scale: number;
  speed: number;
}

const SHAPES: ShapeConfig[] = [
  { kind: 'ring', position: [1.15, 1.05, -0.3], scale: 0.24, speed: 0.5 },
  { kind: 'cube', position: [-0.95, -0.65, 0.55], scale: 0.15, speed: 0.7 },
  { kind: 'sphere', position: [0.35, -1.2, 0.65], scale: 0.11, speed: 0.9 },
  { kind: 'ring', position: [-1.35, 0.55, -0.85], scale: 0.17, speed: 0.4 },
  { kind: 'cube', position: [1.5, -0.35, 0.9], scale: 0.1, speed: 0.6 },
];

/** Two gentle arcs used as very subtle, slow-pulsing light trails. */
const TRAILS: [number, number, number][][] = [
  [
    [-1.9, 0.9, 0.4],
    [-0.6, 1.5, -0.2],
    [0.9, 1.35, -0.9],
    [1.9, 0.7, -0.6],
  ],
  [
    [-1.6, -1.1, 0.7],
    [-0.3, -1.6, 0.1],
    [1.1, -1.3, -0.5],
    [2.0, -0.5, -0.3],
  ],
];

export function HeroOrbAccents({ scrollProgress }: HeroOrbAccentsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const shapeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trailRefs = useRef<(THREE.Line | null)[]>([]);
  const lineMaterialRefs = useRef<(THREE.Material | null)[]>([]);

  const { basePositions, seeds } = useMemo(() => {
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 1.6 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      basePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      basePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      basePositions[i * 3 + 2] = radius * Math.cos(phi) * 0.6;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { basePositions, seeds };
  }, []);

  const livePositions = useMemo(() => basePositions.slice(), [basePositions]);

  // Thin connective lines from a few shapes back toward the orb's core.
  const connectionLines = useMemo(
    () =>
      SHAPES.filter((_, i) => i % 2 === 0).map((shape) => [
        [0, 0, 0] as [number, number, number],
        shape.position,
      ]),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.getElapsedTime();

    const scroll = scrollProgress.current ?? 0;
    const visibility = 1 - Math.min(1, scroll / FADE_OUT_AT);
    const eased = visibility * visibility * (3 - 2 * visibility);
    group.visible = eased > 0.01;
    group.scale.setScalar(Math.max(0.001, eased));

    // Drift particles in slow, independent loops.
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const seed = seeds[i];
        arr[i * 3] = livePositions[i * 3] + Math.cos(t * 0.3 + seed) * 0.12;
        arr[i * 3 + 1] = livePositions[i * 3 + 1] + Math.sin(t * 0.4 + seed) * 0.16;
      }
      posAttr.needsUpdate = true;
      pointsRef.current.rotation.y = t * 0.03;
      const pMat = pointsRef.current.material as THREE.PointsMaterial;
      pMat.opacity = 0.5 + Math.sin(t * 0.6) * 0.15;
    }

    // Tiny floating geometric shapes — each spins and bobs independently.
    shapeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const cfg = SHAPES[i];
      mesh.rotation.x = t * cfg.speed * 0.6;
      mesh.rotation.y = t * cfg.speed;
      mesh.position.y = cfg.position[1] + Math.sin(t * cfg.speed + i) * 0.14;
      mesh.position.x = cfg.position[0] + Math.cos(t * cfg.speed * 0.7 + i) * 0.08;
    });

    // Light trails: very slow opacity pulse, never a hard flash.
    trailRefs.current.forEach((line, i) => {
      if (!line) return;
      const mat = line.material as THREE.Material & { opacity: number };
      mat.opacity = 0.08 + Math.max(0, Math.sin(t * 0.25 + i * 2.4)) * 0.14;
    });

    // Connection lines: faint, slow shimmer.
    lineMaterialRefs.current.forEach((mat, i) => {
      if (!mat) return;
      (mat as THREE.Material & { opacity: number }).opacity = 0.12 + Math.sin(t * 0.5 + i) * 0.06;
    });
  });

  return (
    <group ref={groupRef} position={CENTER}>
      {/* Glowing particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[livePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#ffb347"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Thin animated connection lines back to the core */}
      {connectionLines.map((points, i) => (
        <Line
          key={`connection-${i}`}
          points={points}
          color="#ff8c42"
          lineWidth={1}
          transparent
          opacity={0.15}
          ref={(el) => {
            if (el) lineMaterialRefs.current[i] = (el as unknown as THREE.Line).material as THREE.Material;
          }}
        />
      ))}

      {/* Tiny floating geometric shapes: rings, cubes, sphere */}
      {SHAPES.map((shape, i) => (
        <mesh
          key={`shape-${i}`}
          ref={(el) => {
            shapeRefs.current[i] = el;
          }}
          position={shape.position}
          scale={shape.scale}
        >
          {shape.kind === 'ring' && <torusGeometry args={[1, 0.28, 12, 32]} />}
          {shape.kind === 'cube' && <boxGeometry args={[1, 1, 1]} />}
          {shape.kind === 'sphere' && <sphereGeometry args={[1, 16, 16]} />}
          <meshStandardMaterial
            color="#ff8c42"
            emissive="#ff6a2b"
            emissiveIntensity={0.5}
            roughness={0.4}
            metalness={0.3}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}

      {/* Very subtle light trails */}
      {TRAILS.map((points, i) => (
        <Line
          key={`trail-${i}`}
          points={points}
          color="#ffb347"
          lineWidth={1.5}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          ref={(el) => {
            trailRefs.current[i] = el as unknown as THREE.Line;
          }}
        />
      ))}
    </group>
  );
}
