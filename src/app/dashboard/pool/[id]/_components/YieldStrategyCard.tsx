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
      <span className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-1">
        {sublabel}
        <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-900">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <text x="8" y="11.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">i</text>
        </svg>
      </span>
      <button
        onClick={onSelect}
        className={`flex-1 flex flex-col justify-between p-5 rounded-xl border transition-colors cursor-pointer ${
          selected
            ? "bg-orange-50/30 border-orange-300 shadow-md"
            : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
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
