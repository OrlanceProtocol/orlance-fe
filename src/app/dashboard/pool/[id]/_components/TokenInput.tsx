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
  const percentages = [
    { label: "25%", value: 0.25 },
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "Max", value: 1 },
  ];

  return (
    <div className="space-y-3">
      {/* Token selector + Balance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base text-gray-500">Token</span>
          <button
            onClick={() => onSelectToken(selectedToken === "ETH" ? "stETH" : "ETH")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Image src="/icon/eth.png" alt={selectedToken} width={20} height={20} className="rounded-full" />
            <span className="text-base font-medium text-gray-900">{selectedToken}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <span className="text-sm text-gray-500">
          Balance: {balance} {selectedToken}
        </span>
      </div>

      {/* Amount input */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base text-gray-500">Amount</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 px-4 py-2.5 rounded-md border border-gray-300 text-base text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />

        {/* Percentage buttons */}
        {percentages.map((p) => (
          <button
            key={p.label}
            onClick={() => onAmountChange((balance * p.value).toFixed(4))}
            className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
