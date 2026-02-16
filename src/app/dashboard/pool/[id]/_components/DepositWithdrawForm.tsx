"use client";

import { useState } from "react";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import YieldStrategyCard from "./YieldStrategyCard";

export default function DepositWithdrawForm({ pool }: { pool: Pool }) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");
  const [strategy, setStrategy] = useState<"fixed" | "variable">("fixed");

  const balance = selectedToken === "ETH" ? pool.ethAmount : pool.stEthAmount;

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm p-6 h-full">
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`pb-3 text-lg font-medium transition-colors cursor-pointer ${
            activeTab === "deposit"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`pb-3 text-lg font-medium transition-colors cursor-pointer ${
            activeTab === "withdraw"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* From section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
        <TokenInput
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
          amount={amount}
          onAmountChange={setAmount}
          balance={balance}
        />
      </div>

      {/* To separator */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">To</h3>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Yield strategy cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <YieldStrategyCard
          type="fixed"
          label="Fixed Yield"
          sublabel="Interest rate protection"
          apr={pool.fixedAPR}
          selected={strategy === "fixed"}
          onSelect={() => setStrategy("fixed")}
        />
        <YieldStrategyCard
          type="variable"
          label="Variable Yield"
          sublabel="Liquidity provision"
          apr={pool.lpAPR}
          selected={strategy === "variable"}
          onSelect={() => setStrategy("variable")}
        />
      </div>

      {/* Execute button */}
      <button className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white text-base font-medium rounded-md transition-colors cursor-pointer">
        Execute
      </button>
    </div>
  );
}
