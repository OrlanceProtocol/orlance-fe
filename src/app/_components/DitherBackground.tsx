"use client";

import dynamic from "next/dynamic";

const DitherCanvas = dynamic(() => import("@/components/Dither"), { ssr: false });

export default function DitherBackground() {
  return (
    <DitherCanvas
      waveColor={[0.08, 0.72, 0.65]}
      colorNum={4}
      pixelSize={2}
      waveSpeed={0.05}
      waveFrequency={3}
      waveAmplitude={0.3}
      enableMouseInteraction={true}
      mouseRadius={1}
    />
  );
}
