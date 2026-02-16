interface PositionChartProps {
  principals: number;
  yields: number;
}

export default function PositionChart({ principals, yields }: PositionChartProps) {
  const total = principals + yields;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="20" />
        </svg>
        <span className="text-sm text-gray-400 mt-2">No position</span>
      </div>
    );
  }

  const principalRatio = principals / total;
  const principalLength = circumference * principalRatio;
  const yieldLength = circumference * (1 - principalRatio);

  return (
    <div className="flex flex-col items-center py-4">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        {/* Yields segment (teal) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#0d9488"
          strokeWidth="20"
          strokeDasharray={`${yieldLength} ${circumference - yieldLength}`}
          strokeDashoffset={-principalLength}
        />
        {/* Principals segment (orange) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="20"
          strokeDasharray={`${principalLength} ${circumference - principalLength}`}
        />
      </svg>
    </div>
  );
}
