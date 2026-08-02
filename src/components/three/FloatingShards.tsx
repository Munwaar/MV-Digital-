import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShardConfig {
  position: [number, number, number];
  scale: number;
  speed: number;
  geometry: 'icosahedron' | 'torus' | 'octahedron';
  emissive: string;
}

const SHARDS: ShardConfig[] = [
  { position: [-2.9, 1.2, -3.2], scale: 0.6, speed: 0.18, geometry: 'icosahedron', emissive: '#ff6a2b' },
  { position: [-2.6, -0.8, -2], scale: 0.65, speed: 0.24, geometry: 'octahedron', emissive: '#ffb347' },
  { position: [1.0, -1.8, -3.6], scale: 0.45, speed: 0.3, geometry: 'torus', emissive: '#ff8c42' },
  { position: [-1.6, 1.5, -2.5], scale: 0.4, speed: 0.4, geometry: 'icosahedron', emissive: '#7c93a3' },
];

interface ShardProps extends ShardConfig {
  lowPower: boolean;
}

function Shard({ position, scale, speed, geometry, emissive, lowPower }: ShardProps) {
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
      {geometry === 'torus' && <torusGeometry args={[0.8, 0.28, lowPower ? 16 : 32, lowPower ? 32 : 64]} />}
      {/*
        Uses a standard physical material (glossy clearcoat + translucency)
        instead of MeshTransmissionMaterial. Transmission materials render an
        extra scene pass *per object* every frame — with four of these plus
        scroll-driven camera movement, that was the single biggest cost on
        mid-range mobile GPUs. This reads almost identically at this scale
        (small, backgrounded, foggy) for a fraction of the render cost.
      */}
      <meshPhysicalMaterial
        color="#1d1811"
        roughness={0.3}
        metalness={0.15}
        clearcoat={lowPower ? 0 : 0.5}
        transparent
        opacity={0.85}
        emissive={emissive}
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

interface FloatingShardsProps {
  lowPower?: boolean;
}

export function FloatingShards({ lowPower = false }: FloatingShardsProps) {
  return (
    <group>
      {SHARDS.map((shard, i) => (
        <Shard key={i} {...shard} lowPower={lowPower} />
      ))}
    </group>
  );
}
