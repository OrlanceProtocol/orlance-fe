import { useState } from "react";
import Image from "next/image";

interface TokenInputProps {
  selectedToken: "ETH" | "stETH";
  onSelectToken: (token: "ETH" | "stETH") => void;
  amount: string;
  onAmountChange: (val: string) => void;
  balance: number | string;
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
        <span className="text-sm text-gray-400 w-16 shrink-0">Token</span>
        <button
          onClick={() => onSelectToken(selectedToken === "ETH" ? "stETH" : "ETH")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/30 bg-[#1a2332] hover:bg-[#1e2a3a] transition-colors cursor-pointer"
        >
          <Image src="/icon/eth.png" alt={selectedToken} width={20} height={20} className="rounded-full" />
          <span className="text-sm font-medium text-white">{selectedToken}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-sm text-gray-400">
          Balance: {balance} {selectedToken}
        </span>
      </div>

      {/* Amount input + percentage buttons */}
      <div className="flex items-start gap-2">
        <span className="text-sm text-gray-400 w-16 shrink-0 mt-2.5">Amount</span>
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
              className="w-60 px-4 py-2 rounded-lg border border-gray-700/30 bg-[#151f2e] text-base text-white shadow-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 placeholder-gray-500"
            />
            {percentages.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setSelectedPercent(p.value);
                  const numericBalance = typeof balance === "number" ? balance : Number(balance);
                  const safeBalance = Number.isFinite(numericBalance) ? numericBalance : 0;
                  onAmountChange((safeBalance * p.value).toFixed(4));
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
          <span className="text-xs text-gray-500 mt-1 block">
            Approx ${approxUSD}
          </span>
        </div>
      </div>
    </div>
  );
}
