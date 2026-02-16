"use client";

import { useState } from "react";
import type { Pool } from "@/data/pools";
import MintTab from "./MintTab";
import SwapTab from "./SwapTab";
import PoolTab from "./PoolTab";
import RedeemTab from "./RedeemTab";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";

type AdvancedTab = "mint" | "swap" | "pool" | "redeem";

export default function DepositWithdrawForm({
  pool,
  advanced,
}: {
  pool: Pool;
  advanced: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [advancedTab, setAdvancedTab] = useState<AdvancedTab>("mint");

  if (advanced) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
        {/* Advanced Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-6">
          {(["mint", "swap", "pool", "redeem"] as AdvancedTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setAdvancedTab(tab)}
              className={`px-6 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer capitalize ${
                advancedTab === tab
                  ? "text-gray-900 border-b-3 border-orange-500 -mb-[1px]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {advancedTab === "mint" && <MintTab pool={pool} />}
        {advancedTab === "swap" && <SwapTab />}
        {advancedTab === "pool" && <PoolTab pool={pool} />}
        {advancedTab === "redeem" && <RedeemTab pool={pool} />}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`px-8 pb-3 text-2xl font-bold text-center transition-colors cursor-pointer ${
            activeTab === "deposit"
              ? "text-gray-900 border-b-3 border-orange-500 -mb-[1px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-8 pb-3 text-2xl font-bold text-center transition-colors cursor-pointer ${
            activeTab === "withdraw"
              ? "text-gray-900 border-b-3 border-orange-500 -mb-[1px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Withdraw
        </button>
      </div>

      {activeTab === "deposit" ? (
        <DepositTab pool={pool} />
      ) : (
        <WithdrawTab pool={pool} />
      )}
    </div>
  );
}
