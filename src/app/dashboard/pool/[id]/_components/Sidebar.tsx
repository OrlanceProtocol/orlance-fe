"use client";

import { useState } from "react";
import Image from "next/image";
import type { Pool } from "@/data/pools";
import PositionChart from "./PositionChart";

export default function Sidebar({ pool }: { pool: Pool }) {
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">("balance");

  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 h-full flex flex-col backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-6">
        <button
          onClick={() => setActiveTab("balance")}
          className={`flex-1 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "balance"
              ? "text-white border-b-3 border-teal-500 -mb-[1px]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Balance
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "transactions"
              ? "text-white border-b-3 border-teal-500 -mb-[1px]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Transactions
        </button>
      </div>

      {activeTab === "balance" ? (
        <div className="flex flex-col gap-6 flex-1">
          {/* Available section */}
          <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
            <h3 className="text-lg font-semibold text-white mb-4">Available</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/icon/eth.png" alt="ETH" width={20} height={20} className="rounded-full" />
                  <span className="text-base text-gray-300">ETH</span>
                </div>
                <span className="text-base font-medium text-white">{pool.ethAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-900/50 flex items-center justify-center relative">
                    <Image src="/icon/eth.png" alt="stETH" width={20} height={20} className="rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border border-[#151f2e]" />
                  </span>
                  <span className="text-base text-gray-300">stETH</span>
                </div>
                <span className="text-base font-medium text-white">{pool.stEthAmount}</span>
              </div>
            </div>
          </div>

          {/* Current Position section */}
          <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-1">Current position</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Value</span>
              <span className="text-base font-medium text-white">{pool.positionValueUSD}</span>
            </div>

            <PositionChart principals={pool.principalTokens} yields={pool.yieldTokens} />

            {/* Legend */}
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-400">Principals</span>
                </div>
                <span className="text-sm text-gray-300">
                  {pool.principalTokens.toFixed(4)} ({pool.principalStaked.toFixed(4)} staked)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600" />
                  <span className="text-sm text-gray-400">Yields</span>
                </div>
                <span className="text-sm text-gray-300">
                  {pool.yieldTokens.toFixed(4)} ({pool.yieldStaked.toFixed(4)} staked)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-500 text-base">No transactions yet</span>
        </div>
      )}
    </div>
  );
}
