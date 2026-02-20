"use client";

import { useEffect, useMemo, useState } from "react";

function formatCountdown(targetTs: number, now: number): string {
  const diff = Math.max(targetTs - now, 0);

  if (diff === 0) return "Ready now";

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
  const [nowTs, setNowTs] = useState(() => Math.floor(Date.now() / 1000));

  const display = useMemo(
    () => formatCountdown(targetTimestamp, nowTs),
    [targetTimestamp, nowTs],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-white font-medium tabular-nums">{display}</span>
  );
}
