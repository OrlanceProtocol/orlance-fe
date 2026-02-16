import { useState } from "react";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";

export default function MintTab({ pool }: { pool: Pool }) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");

  const balance = selectedToken === "ETH" ? pool.ethAmount : pool.stEthAmount;

  return (
    <>
      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" />
        <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
          <TokenInput
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            amount={amount}
            onAmountChange={setAmount}
            balance={balance}
          />
        </div>
      </div>

      {/* To section */}
      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center">
            {/* Principals */}
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900">
                Principals
              </p>
              <p className="text-sm text-gray-400">est. Principals</p>
            </div>

            {/* Plus connector */}
            <div className="mx-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="text-gray-500"
                >
                  <path
                    d="M7 2V12M2 7H12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Yields */}
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900">Yields</p>
              <p className="text-sm text-gray-400">est. Yields</p>
            </div>
          </div>
        </div>
      </div>

      <ExecuteButton />
    </>
  );
}
