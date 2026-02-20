"use client";

import { useEffect, useState } from "react";

interface Feature {
  title: string;
  description: string;
}

export default function AnimatedFeatureCards({ features }: { features: Feature[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sweepPhase, setSweepPhase] = useState<"sweeping" | "filled">("sweeping");

  useEffect(() => {
    const SWEEP_DURATION = 800; // left-to-right sweep time
    const HOLD_DURATION = 1200; // how long it stays filled

    let timeout: NodeJS.Timeout;

    const cycle = () => {
      // Start sweep
      setSweepPhase("sweeping");

      timeout = setTimeout(() => {
        // Sweep done, hold filled
        setSweepPhase("filled");

        timeout = setTimeout(() => {
          // Move to next card
          setActiveIndex((prev) => (prev + 1) % features.length);
        }, HOLD_DURATION);
      }, SWEEP_DURATION);
    };

    cycle();
    const interval = setInterval(cycle, SWEEP_DURATION + HOLD_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [features.length]);

  return (
    <div className="flex flex-col gap-4">
      {features.map((f, i) => {
        const isActive = i === activeIndex;

        return (
          <div
            key={f.title}
            className="relative overflow-hidden border border-teal-500/40 p-5"
          >
            {/* Sweep background */}
            <div
              className="absolute inset-0 bg-teal-500 transition-none"
              style={{
                transform: isActive
                  ? sweepPhase === "sweeping"
                    ? "translateX(0%)"
                    : "translateX(0%)"
                  : "translateX(-101%)",
                transition: isActive && sweepPhase === "sweeping"
                  ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : isActive && sweepPhase === "filled"
                    ? "none"
                    : "transform 0.3s ease-out",
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <h3
                className="text-base font-bold mb-1 transition-colors duration-300"
                style={{ color: isActive ? "#000" : "#fff" }}
              >
                {i + 1}. {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed transition-colors duration-300"
                style={{ color: isActive ? "rgba(0,0,0,0.7)" : "rgb(156,163,175)" }}
              >
                {f.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
