import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { PointerState } from '@/hooks/useMousePosition';
import { lerp } from '@/lib/utils';

interface CameraRigProps {
  pointer: React.RefObject<PointerState>;
  scrollProgress: React.RefObject<number>;
}

/**
 * Drives subtle camera parallax from pointer position and a slow dolly/tilt
 * tied to page scroll progress (0..1), giving the scene a cinematic,
 * hand-operated feel without any per-frame allocations.
 */
export function CameraRig({ pointer, scrollProgress }: CameraRigProps) {
  const { camera } = useThree();
  const current = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const target = pointer.current;
    const scroll = scrollProgress.current ?? 0;

    current.current.x = lerp(current.current.x, target.nx * 0.6, 0.04);
    current.current.y = lerp(current.current.y, -target.ny * 0.35, 0.04);

    camera.position.x = current.current.x;
    camera.position.y = current.current.y + scroll * -1.2;
    camera.position.z = 6 - scroll * 1.5;
    camera.rotation.z = scroll * 0.03;
    camera.lookAt(0, 0, -2);
  });

  return null;
}
