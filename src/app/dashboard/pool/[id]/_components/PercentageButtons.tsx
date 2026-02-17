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
      <span className="text-sm text-gray-400 w-16 shrink-0">Amount</span>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setSelectedPercent(null);
          onAmountChange(e.target.value);
        }}
        placeholder="0.00"
        className="w-40 px-4 py-2 rounded-lg border border-gray-700/30 bg-[#151f2e] text-base text-white shadow-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 placeholder-gray-500"
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
              ? "bg-teal-500 text-white border-teal-500"
              : "border-gray-700/30 text-gray-400 hover:bg-teal-500/10 hover:border-teal-400 hover:text-teal-400"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
