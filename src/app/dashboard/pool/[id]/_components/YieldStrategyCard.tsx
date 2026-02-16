interface YieldStrategyCardProps {
  type: "fixed" | "variable";
  label: string;
  sublabel: string;
  apr: number;
  selected: boolean;
  onSelect: () => void;
}

export default function YieldStrategyCard({
  label,
  sublabel,
  apr,
  selected,
  onSelect,
}: YieldStrategyCardProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 mb-2 flex items-center gap-1">
        {sublabel}
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-gray-400">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <text x="7" y="10" textAnchor="middle" fontSize="8" fill="currentColor">i</text>
        </svg>
      </span>
      <button
        onClick={onSelect}
        className={`flex-1 flex flex-col justify-between p-5 rounded-md border-2 transition-colors cursor-pointer ${
          selected
            ? "border-orange-400 bg-orange-50/30"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">{label}</span>
          {selected && (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#f97316" />
              <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-lg font-semibold text-orange-500 mt-8">
          est. APR {apr.toFixed(2)}%
        </span>
      </button>
    </div>
  );
}
