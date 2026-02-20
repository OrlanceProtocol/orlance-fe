"use client";

import { useState } from "react";
import Image from "next/image";
import type { Pool } from "@/data/pools";
import PositionChart from "./PositionChart";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";
import { useExplorerTxHistory } from "@/hooks/useExplorerTxHistory";

export default function Sidebar({ pool }: { pool: Pool }) {
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">("balance");
  const onchain = useOrlancePoolData({
    maturityTimestamp: pool.maturityTimestamp,
    addresses: {
      tps: pool.addresses.tps,
      tys: pool.addresses.tys,
      amm: pool.addresses.amm,
    },
  });
  const txHistory = useExplorerTxHistory();

  const principal = Number(onchain.formatted.tps);
  const yieldAmount = Number(onchain.formatted.tys);
  const lp = Number(onchain.formatted.lp);
  const eth = Number(onchain.formatted.eth);
  const stEth = Number(onchain.formatted.stEth);
  const pendingYield = Number(onchain.formatted.pendingYield);
  const totalPosition = Number(onchain.formatted.positionStEth);

  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 h-full flex flex-col backdrop-blur-sm">
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
          <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
            <h3 className="text-lg font-semibold text-white mb-4">Available</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/icon/eth.png" alt="ETH" width={20} height={20} className="rounded-full" />
                  <span className="text-base text-gray-300">ETH</span>
                </div>
                <span className="text-base font-medium text-white">{eth.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-900/50 flex items-center justify-center relative">
                    <Image src="/icon/eth.png" alt="stETH" width={20} height={20} className="rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border border-[#151f2e]" />
                  </span>
                  <span className="text-base text-gray-300">stETH</span>
                </div>
                <span className="text-base font-medium text-white">{stEth.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-1">Current position</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Derived onchain value</span>
              <span className="text-base font-medium text-white">{totalPosition.toFixed(4)} stETH</span>
            </div>

            <PositionChart principals={principal} yields={yieldAmount} />

            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-400">Principals (TPS)</span>
                </div>
                <span className="text-sm text-gray-300">{principal.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-600" />
                  <span className="text-sm text-gray-400">Yields (TYS)</span>
                </div>
                <span className="text-sm text-gray-300">{yieldAmount.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">LP</span>
                <span className="text-sm text-gray-300">{lp.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Pending Yield</span>
                <span className="text-sm text-teal-300">{pendingYield.toFixed(4)} stETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">TPS Price</span>
                <span className="text-sm text-gray-300">{onchain.formatted.tpsPrice} stETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">TYS Price</span>
                <span className="text-sm text-gray-300">{onchain.formatted.tysPrice} stETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">LP Price</span>
                <span className="text-sm text-gray-300">{onchain.formatted.lpPrice} stETH</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          {!txHistory.isConfigured ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-500 text-base">
                Set NEXT_PUBLIC_ETHERSCAN_API_KEY to enable explorer history
              </span>
            </div>
          ) : txHistory.isLoading ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-500 text-base">Loading explorer transactions...</span>
            </div>
          ) : txHistory.data && txHistory.data.length > 0 ? (
            <div className="space-y-3">
              {txHistory.data.map((tx) => (
                <a
                  key={tx.hash}
                  href={tx.txUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-gray-700/30 bg-[#151f2e] px-4 py-3 hover:border-gray-600/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{tx.action}</span>
                    <span
                      className={`text-xs ${
                        tx.status === "success" ? "text-teal-300" : "text-red-300"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 break-all">{tx.hash}</div>
                  {tx.tokenValue && tx.tokenSymbol && (
                    <div className="text-xs text-gray-400 mt-1">
                      {tx.tokenValue} {tx.tokenSymbol}
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-500 text-base">
                No explorer tx found for this wallet in protocol contracts
              </span>
            </div>
          )}
        </div>
      )}
      <p className="text-[11px] text-gray-500 mt-3">Source: explorer API / pool {pool.id}</p>
    </div>
  );
}
