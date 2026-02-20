"use client";

import dynamic from "next/dynamic";

const Threads = dynamic(() => import("@/components/Threads"), { ssr: false });

export default function ThreadsBackground() {
  return (
    <Threads
      color={[0.08, 0.72, 0.65]}
      amplitude={1.2}
      distance={0.3}
      enableMouseInteraction={true}
    />
  );
}
