"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const DitherBackground = dynamic(() => import("./DitherBackground"), { ssr: false });

interface Feature {
  title: string;
  description: string;
}

/* ── Mock panels for each feature ── */
function SwapPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs">
      <div className="w-full bg-black/40 border border-white/10 p-4">
        <div className="text-xs text-gray-400 mb-1">From</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">1.00</span>
          <span className="text-sm font-medium text-teal-400 bg-teal-500/10 px-3 py-1 border border-teal-500/20">stETH</span>
        </div>
      </div>
      <div className="w-8 h-8 flex items-center justify-center border border-white/10 bg-black/40">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
      <div className="w-full bg-black/40 border border-white/10 p-4">
        <div className="text-xs text-gray-400 mb-1">To</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">0.98</span>
          <span className="text-sm font-medium text-teal-400 bg-teal-500/10 px-3 py-1 border border-teal-500/20">PT</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">Rate: 1 stETH = 0.98 PT</div>
    </div>
  );
}

function LiquidityPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full max-w-xs">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Pool Liquidity</div>
      <div className="text-4xl font-black text-white">$2.4M</div>
      <div className="w-full flex justify-between text-xs text-gray-400 mt-3">
        <span>TPS</span>
        <span>stETH</span>
      </div>
      <div className="w-full h-3 bg-black/40 border border-white/10 overflow-hidden flex">
        <div className="h-full bg-teal-500" style={{ width: "58%" }} />
        <div className="h-full bg-teal-300" style={{ width: "42%" }} />
      </div>
      <div className="w-full flex justify-between text-xs">
        <span className="text-teal-400">58%</span>
        <span className="text-teal-300">42%</span>
      </div>
      <div className="w-full bg-black/40 border border-white/10 p-3 mt-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">APR</span>
          <span className="text-teal-400 font-bold">12.4%</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-400">24h Volume</span>
          <span className="text-white font-medium">$184K</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Portfolio</div>
      <div className="w-full bg-black/40 border border-white/10 p-4">
        <div className="text-xs text-gray-400 mb-1">Total Value</div>
        <div className="text-3xl font-black text-white">$12,480</div>
        <div className="text-xs text-teal-400 mt-1">+3.2% this week</div>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="bg-black/40 border border-white/10 p-3">
          <div className="text-xs text-gray-400">PT Value</div>
          <div className="text-sm font-bold text-white">$7,200</div>
        </div>
        <div className="bg-black/40 border border-white/10 p-3">
          <div className="text-xs text-gray-400">YT Value</div>
          <div className="text-sm font-bold text-white">$5,280</div>
        </div>
      </div>
      <Link
        href="/dashboard"
        className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold text-center uppercase tracking-wide transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

function MaturityPanel() {
  const pools = [
    { months: 1, apr: "8.2%", tvl: "$420K" },
    { months: 2, apr: "11.5%", tvl: "$890K" },
    { months: 3, apr: "14.8%", tvl: "$1.1M" },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full max-w-xs">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Select Maturity</div>
      {pools.map((pool) => (
        <div
          key={pool.months}
          className="w-full bg-black/40 border border-white/10 hover:border-teal-500/40 p-3 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div>
            <div className="text-sm font-bold text-white">{pool.months} Month{pool.months > 1 ? "s" : ""}</div>
            <div className="text-xs text-gray-400">TVL: {pool.tvl}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-teal-400">{pool.apr}</div>
            <div className="text-xs text-gray-500">Fixed APR</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PANELS = [SwapPanel, LiquidityPanel, DashboardPanel, MaturityPanel];

export default function AnimatedFeatureCards({ features }: { features: Feature[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sweepPhase, setSweepPhase] = useState<"sweeping" | "filled">("sweeping");

  useEffect(() => {
    const SWEEP_DURATION = 800;
    const HOLD_DURATION = 1200;

    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setSweepPhase("sweeping");

      timeout = setTimeout(() => {
        setSweepPhase("filled");

        timeout = setTimeout(() => {
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

  const ActivePanel = PANELS[activeIndex];

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Left — Dynamic panel */}
      <div className="border border-white/[0.08] overflow-hidden relative min-h-[480px]">
        <div className="absolute inset-0">
          <DitherBackground />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <ActivePanel />
        </div>
      </div>

      {/* Right — Feature cards */}
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
                    ? "translateX(0%)"
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
    </div>
  );
}
