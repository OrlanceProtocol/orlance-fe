import { useState } from "react";
import Image from "next/image";

interface TokenInputProps {
  selectedToken: "ETH" | "stETH";
  onSelectToken: (token: "ETH" | "stETH") => void;
  amount: string;
  onAmountChange: (val: string) => void;
  balance: number;
}

export default function TokenInput({
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  balance,
}: TokenInputProps) {
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);
  const percentages = [
    { label: "25%", value: 0.25 },
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "Max", value: 1 },
  ];

  const ethPrice = 3818.62;
  const approxUSD = amount ? (parseFloat(amount) * ethPrice).toFixed(2) : "0.00";

  return (
    <div className="space-y-4">
      {/* Token selector + Balance */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 w-16 shrink-0">Token</span>
        <button
          onClick={() => onSelectToken(selectedToken === "ETH" ? "stETH" : "ETH")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Image src="/icon/eth.png" alt={selectedToken} width={20} height={20} className="rounded-full" />
          <span className="text-sm font-medium text-gray-900">{selectedToken}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-sm text-gray-500">
          Balance: {balance} {selectedToken}
        </span>
      </div>

      {/* Amount input + percentage buttons */}
      <div className="flex items-start gap-2">
        <span className="text-sm text-gray-500 w-16 shrink-0 mt-2.5">Amount</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setSelectedPercent(null);
                onAmountChange(e.target.value);
              }}
              placeholder="0.00"
              className="w-60 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
            {percentages.map((p) => (
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
          <span className="text-xs text-gray-400 mt-1 block">
            Approx ${approxUSD}
          </span>
        </div>
      </div>
    </div>
  );
}
