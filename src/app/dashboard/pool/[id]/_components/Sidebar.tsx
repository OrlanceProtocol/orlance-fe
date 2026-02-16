"use client";

import { useState } from "react";
import Image from "next/image";
import type { Pool } from "@/data/pools";
import PositionChart from "./PositionChart";

export default function Sidebar({ pool }: { pool: Pool }) {
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">("balance");

  return (
    <div className="bg-white rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("balance")}
          className={`flex-1 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "balance"
              ? "text-gray-900 border-b-3 border-orange-500 -mb-[1px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Balance
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 pb-3 text-lg font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "transactions"
              ? "text-gray-900 border-b-3 border-orange-500 -mb-[1px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Transactions
        </button>
      </div>

      {activeTab === "balance" ? (
        <div className="flex flex-col gap-6 flex-1">
          {/* Available section */}
          <div className="rounded-xl border-2 border-gray-900 p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/icon/eth.png" alt="ETH" width={20} height={20} className="rounded-full" />
                  <span className="text-base text-gray-700">ETH</span>
                </div>
                <span className="text-base font-medium text-gray-900">{pool.ethAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center relative">
                    <Image src="/icon/eth.png" alt="stETH" width={20} height={20} className="rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border border-white" />
                  </span>
                  <span className="text-base text-gray-700">stETH</span>
                </div>
                <span className="text-base font-medium text-gray-900">{pool.stEthAmount}</span>
              </div>
            </div>
          </div>

          {/* Current Position section */}
          <div className="rounded-xl border-2 border-gray-900 p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current position</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Value</span>
              <span className="text-base font-medium text-gray-900">{pool.positionValueUSD}</span>
            </div>

            <PositionChart principals={pool.principalTokens} yields={pool.yieldTokens} />

            {/* Legend */}
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-600">Principals</span>
                </div>
                <span className="text-sm text-gray-900">
                  {pool.principalTokens.toFixed(4)} ({pool.principalStaked.toFixed(4)} staked)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600" />
                  <span className="text-sm text-gray-600">Yields</span>
                </div>
                <span className="text-sm text-gray-900">
                  {pool.yieldTokens.toFixed(4)} ({pool.yieldStaked.toFixed(4)} staked)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-400 text-base">No transactions yet</span>
        </div>
      )}
    </div>
  );
}
