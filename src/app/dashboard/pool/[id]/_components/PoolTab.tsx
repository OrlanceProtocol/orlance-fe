import { useState } from "react";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import PlusConnector from "./PlusConnector";
import PercentageButtons from "./PercentageButtons";
import ExecuteButton from "./ExecuteButton";

export default function PoolTab({ pool }: { pool: Pool }) {
  const [poolSubTab, setPoolSubTab] = useState<"add" | "remove">("add");
  const [poolPrincipalAmount, setPoolPrincipalAmount] = useState("");
  const [poolYieldAmount, setPoolYieldAmount] = useState("");

  return (
    <>
      {/* Add / Remove Liquidity sub-tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-700/30 overflow-hidden">
          <button
            onClick={() => setPoolSubTab("add")}
            className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              poolSubTab === "add"
                ? "bg-[#1a2332] text-white"
                : "bg-[#151f2e] text-gray-500 hover:text-gray-300"
            }`}
          >
            Add Liquidity
          </button>
          <button
            onClick={() => setPoolSubTab("remove")}
            className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              poolSubTab === "remove"
                ? "bg-[#1a2332] text-white"
                : "bg-[#151f2e] text-gray-500 hover:text-gray-300"
            }`}
          >
            Remove Liquidity
          </button>
        </div>
      </div>

      {/* Ratio of Assets */}
      <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e] mb-6">
        <p className="text-base font-semibold text-white mb-2">
          Ratio of Assets
        </p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">4.106%</p>
            <p className="text-xs text-gray-500">
              Principal
              <br />
              Yield
            </p>
          </div>
          <div className="flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="text-gray-400"
            >
              <path
                d="M7 10L12 5L17 10M7 14L12 19L17 14"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">95.893%</p>
            <p className="text-xs text-gray-500">
              Yield
              <br />
              Principal
            </p>
          </div>
        </div>
      </div>

      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" withDivider />

        {/* Principals */}
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold text-white">Principals</p>
            <span className="text-sm text-gray-400">
              Balance {pool.principalTokens}
            </span>
            <span className="text-sm font-medium text-gray-400">Approved</span>
          </div>
          <PercentageButtons
            balance={pool.principalTokens}
            amount={poolPrincipalAmount}
            onAmountChange={setPoolPrincipalAmount}
          />
        </div>

        <PlusConnector />

        {/* Yields */}
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold text-white">Yields</p>
            <span className="text-sm text-gray-400">
              Balance {pool.yieldTokens}
            </span>
            <span className="text-sm font-medium text-gray-400">Approved</span>
          </div>
          <PercentageButtons
            balance={pool.yieldTokens}
            amount={poolYieldAmount}
            onAmountChange={setPoolYieldAmount}
          />
        </div>
      </div>

      {/* To section */}
      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">LP Tokens</p>
              <p className="text-sm text-gray-500">Estimate: LP Tokens</p>
            </div>
            <span className="text-sm text-gray-500">0% share of Pool</span>
          </div>
        </div>
      </div>

      <ExecuteButton />
    </>
  );
}
