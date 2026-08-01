import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.65}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.6}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.15} darkness={0.9} />
    </EffectComposer>
  );
}
