import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostFXProps {
  lowPower?: boolean;
}

/**
 * On low-power devices, mip-mapped bloom blur and the full-screen noise pass
 * are dropped — those are the two most expensive parts of this pipeline —
 * while keeping a lighter bloom and the (cheap) vignette so the scene still
 * reads as premium rather than flat.
 */
export function PostFX({ lowPower = false }: PostFXProps) {
  const effects: React.JSX.Element[] = [
    <Bloom
      key="bloom"
      intensity={lowPower ? 0.45 : 0.65}
      luminanceThreshold={0.2}
      luminanceSmoothing={0.9}
      mipmapBlur={!lowPower}
      radius={0.6}
    />,
  ];

  if (!lowPower) {
    effects.push(<Noise key="noise" opacity={0.02} blendFunction={BlendFunction.OVERLAY} />);
  }

  effects.push(<Vignette key="vignette" eskil={false} offset={0.15} darkness={0.9} />);

  return <EffectComposer multisampling={0}>{effects}</EffectComposer>;
}
