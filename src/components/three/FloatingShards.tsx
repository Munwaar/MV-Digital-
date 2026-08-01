import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ShardConfig {
  position: [number, number, number];
  scale: number;
  speed: number;
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  emissive: string;
}

const SHARDS: ShardConfig[] = [
  { position: [2.4, 0.6, -1], scale: 1.1, speed: 0.18, geometry: 'icosahedron', emissive: '#ff6a2b' },
  { position: [-2.6, -0.8, -2], scale: 0.75, speed: 0.24, geometry: 'octahedron', emissive: '#ffb347' },
  { position: [1.2, -1.6, -3], scale: 0.55, speed: 0.3, geometry: 'torus', emissive: '#ff8c42' },
  { position: [-1.6, 1.5, -2.5], scale: 0.4, speed: 0.4, geometry: 'icosahedron', emissive: '#7c93a3' },
];

function Shard({ position, scale, speed, geometry, emissive }: ShardConfig) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initial = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.6;
    meshRef.current.rotation.y = t * 0.9;
    meshRef.current.position.y = initial.y + Math.sin(t * 1.4) * 0.35;
    meshRef.current.position.x = initial.x + Math.cos(t * 1.1) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
      {geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
      {geometry === 'torus' && <torusGeometry args={[0.8, 0.28, 32, 64]} />}
      <MeshTransmissionMaterial
        thickness={0.6}
        roughness={0.15}
        transmission={0.94}
        ior={1.3}
        chromaticAberration={0.04}
        emissive={emissive}
        emissiveIntensity={0.4}
        color="#1d1811"
        distortion={0.2}
        resolution={256}
        samples={4}
      />
    </mesh>
  );
}

export function FloatingShards() {
  return (
    <group>
      {SHARDS.map((shard, i) => (
        <Shard key={i} {...shard} />
      ))}
    </group>
  );
}
