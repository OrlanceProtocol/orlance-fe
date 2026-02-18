"use client";

import { useEffect, useState } from "react";

function formatCountdown(targetTs: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(targetTs - now, 0);

  if (diff === 0) return "Rolling over...";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(" ");
}

export default function RollOverCountdown({
  targetTimestamp,
}: {
  targetTimestamp: number;
}) {
  const [display, setDisplay] = useState(() => formatCountdown(targetTimestamp));

  useEffect(() => {
    setDisplay(formatCountdown(targetTimestamp));
    const interval = setInterval(() => {
      setDisplay(formatCountdown(targetTimestamp));
    }, 60_000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return (
    <span className="text-white font-medium tabular-nums">{display}</span>
  );
}
