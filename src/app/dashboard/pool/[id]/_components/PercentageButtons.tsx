import { useState } from "react";

const PERCENTAGES = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "Max", value: 1 },
] as const;

export default function PercentageButtons({
  balance,
  amount,
  onAmountChange,
}: {
  balance: number;
  amount: string;
  onAmountChange: (val: string) => void;
}) {
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 w-16 shrink-0">Amount</span>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setSelectedPercent(null);
          onAmountChange(e.target.value);
        }}
        placeholder="0.00"
        className="w-40 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
      />
      {PERCENTAGES.map((p) => (
        <button
          key={p.label}
          onClick={() => {
            setSelectedPercent(p.value);
            onAmountChange((balance * p.value).toFixed(4));
          }}
          className={`px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
            selectedPercent === p.value
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 text-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
