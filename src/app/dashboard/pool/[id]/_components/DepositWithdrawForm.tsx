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
      <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 h-full backdrop-blur-sm">
        {/* Advanced Tabs */}
        <div className="flex justify-center border-b border-gray-700/30 mb-6">
          {(["mint", "swap", "pool", "redeem"] as AdvancedTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setAdvancedTab(tab)}
              className={`px-6 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer capitalize ${
                advancedTab === tab
                  ? "text-white border-b-3 border-teal-500 -mb-[1px]"
                  : "text-gray-500 hover:text-gray-300"
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
    <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 h-full backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-700/30 mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`px-8 pb-3 text-2xl font-bold text-center transition-colors cursor-pointer ${
            activeTab === "deposit"
              ? "text-white border-b-3 border-teal-500 -mb-[1px]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-8 pb-3 text-2xl font-bold text-center transition-colors cursor-pointer ${
            activeTab === "withdraw"
              ? "text-white border-b-3 border-teal-500 -mb-[1px]"
              : "text-gray-500 hover:text-gray-300"
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
