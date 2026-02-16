"use client";

import { useState } from "react";
import Image from "next/image";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import YieldStrategyCard from "./YieldStrategyCard";

type ApprovalState = {
  principals: boolean;
  yields: boolean;
  lp: boolean;
};

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
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");
  const [strategy, setStrategy] = useState<"fixed" | "variable">("fixed");
  const [withdrawToken, setWithdrawToken] = useState<"ETH" | "stETH">("stETH");
  const [swapFromToken, setSwapFromToken] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [poolSubTab, setPoolSubTab] = useState<"add" | "remove">("add");
  const [poolPrincipalAmount, setPoolPrincipalAmount] = useState("");
  const [poolYieldAmount, setPoolYieldAmount] = useState("");
  const [poolPrincipalPercent, setPoolPrincipalPercent] = useState<number | null>(null);
  const [poolYieldPercent, setPoolYieldPercent] = useState<number | null>(null);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemPercent, setRedeemPercent] = useState<number | null>(null);
  const [redeemToken, setRedeemToken] = useState<"ETH" | "stETH">("stETH");
  const [redeemApprovals, setRedeemApprovals] = useState({ principals: false, yields: false });
  const [approvals, setApprovals] = useState<ApprovalState>({
    principals: false,
    yields: false,
    lp: false,
  });

  const balance = selectedToken === "ETH" ? pool.ethAmount : pool.stEthAmount;

  const ethPrice = 3818.62;
  const totalWithdrawTokens =
    pool.principalTokens + pool.yieldTokens + pool.lpTokens;
  const estimateUSD = (totalWithdrawTokens * ethPrice).toFixed(2);

  const handleApprove = (token: keyof ApprovalState) => {
    setApprovals((prev) => ({ ...prev, [token]: true }));
  };

  const allApproved = approvals.principals && approvals.yields && approvals.lp;

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

        {/* Mint tab content */}
        {advancedTab === "mint" && (
          <>
            {/* From section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
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
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">To</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

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
                    <p className="text-base font-semibold text-gray-900">
                      Yields
                    </p>
                    <p className="text-sm text-gray-400">est. Yields</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Execute button */}
            <div className="flex justify-center">
              <button className="px-16 py-3 bg-gray-200 text-gray-400 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
                Execute
              </button>
            </div>
          </>
        )}

        {/* Swap tab content */}
        {advancedTab === "swap" && (
          <>
            {/* From section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">From</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16 shrink-0">
                    Token
                  </span>
                  <button
                    onClick={() =>
                      setSwapFromToken(
                        swapFromToken === ""
                          ? "Principals"
                          : swapFromToken === "Principals"
                            ? "Yields"
                            : swapFromToken === "Yields"
                              ? "LP Tokens"
                              : ""
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {swapFromToken ? (
                      <span className="text-sm font-medium text-gray-900">
                        {swapFromToken}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Please select
                      </span>
                    )}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="text-gray-400"
                    >
                      <path
                        d="M3 5L6 8L9 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16 shrink-0">
                    Amount
                  </span>
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-48 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* To section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">To</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                <p className="text-base font-semibold text-gray-900">Yields</p>
                <p className="text-sm text-gray-400">
                  Estimated amount received: Yields
                </p>
              </div>
            </div>

            {/* Approve + Execute buttons */}
            <div className="flex justify-center gap-4">
              <button className="px-10 py-3 bg-gray-200 text-gray-400 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
                Approve
              </button>
              <button className="px-10 py-3 bg-gray-200 text-gray-400 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
                Execute
              </button>
            </div>
          </>
        )}

        {/* Pool tab content */}
        {advancedTab === "pool" && (
          <>
            {/* Add / Remove Liquidity sub-tabs */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setPoolSubTab("add")}
                  className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    poolSubTab === "add"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Add Liquidity
                </button>
                <button
                  onClick={() => setPoolSubTab("remove")}
                  className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    poolSubTab === "remove"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Remove Liquidity
                </button>
              </div>
            </div>

            {/* Ratio of Assets */}
            <div className="rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
              <p className="text-base font-semibold text-gray-900 mb-2">
                Ratio of Assets
              </p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">4.106%</p>
                  <p className="text-xs text-gray-400">
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
                  <p className="text-lg font-semibold text-gray-900">
                    95.893%
                  </p>
                  <p className="text-xs text-gray-400">
                    Yield
                    <br />
                    Principal
                  </p>
                </div>
              </div>
            </div>

            {/* From section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">From</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Principals */}
              <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-semibold text-gray-900">
                    Principals
                  </p>
                  <span className="text-sm text-gray-500">
                    Balance {pool.principalTokens}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16 shrink-0">
                    Amount
                  </span>
                  <input
                    type="number"
                    value={poolPrincipalAmount}
                    onChange={(e) => {
                      setPoolPrincipalPercent(null);
                      setPoolPrincipalAmount(e.target.value);
                    }}
                    placeholder="0.00"
                    className="w-40 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                  {[
                    { label: "25%", value: 0.25 },
                    { label: "50%", value: 0.5 },
                    { label: "75%", value: 0.75 },
                    { label: "Max", value: 1 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setPoolPrincipalPercent(p.value);
                        setPoolPrincipalAmount(
                          (pool.principalTokens * p.value).toFixed(4)
                        );
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                        poolPrincipalPercent === p.value
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 text-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plus connector */}
              <div className="flex justify-center -my-2 relative z-10">
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
              <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-semibold text-gray-900">
                    Yields
                  </p>
                  <span className="text-sm text-gray-500">
                    Balance {pool.yieldTokens}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16 shrink-0">
                    Amount
                  </span>
                  <input
                    type="number"
                    value={poolYieldAmount}
                    onChange={(e) => {
                      setPoolYieldPercent(null);
                      setPoolYieldAmount(e.target.value);
                    }}
                    placeholder="0.00"
                    className="w-40 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                  {[
                    { label: "25%", value: 0.25 },
                    { label: "50%", value: 0.5 },
                    { label: "75%", value: 0.75 },
                    { label: "Max", value: 1 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setPoolYieldPercent(p.value);
                        setPoolYieldAmount(
                          (pool.yieldTokens * p.value).toFixed(4)
                        );
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                        poolYieldPercent === p.value
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 text-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* To section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">To</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      LP Tokens
                    </p>
                    <p className="text-sm text-gray-400">
                      Estimate: LP Tokens
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    0% share of Pool
                  </span>
                </div>
              </div>
            </div>

            {/* Execute button */}
            <div className="flex justify-center">
              <button className="px-16 py-3 bg-gray-200 text-gray-400 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
                Execute
              </button>
            </div>
          </>
        )}

        {/* Redeem tab content */}
        {advancedTab === "redeem" && (
          <>
            {/* From section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">From</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                {/* Primitives header with balance */}
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900">
                    Primitives
                  </p>
                  <span className="text-sm text-gray-500">
                    Balance: {pool.principalTokens} Principals &{" "}
                    {pool.yieldTokens} Yields
                  </span>
                </div>

                {/* Amount input with percentage buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16 shrink-0">
                    Amount
                  </span>
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => {
                      setRedeemPercent(null);
                      setRedeemAmount(e.target.value);
                    }}
                    placeholder="0.00"
                    className="w-40 px-4 py-2 rounded-lg border border-gray-200 text-base text-gray-900 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                  {[
                    { label: "25%", value: 0.25 },
                    { label: "50%", value: 0.5 },
                    { label: "75%", value: 0.75 },
                    { label: "Max", value: 1 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setRedeemPercent(p.value);
                        const minBalance = Math.min(
                          pool.principalTokens,
                          pool.yieldTokens
                        );
                        setRedeemAmount(
                          (minBalance * p.value).toFixed(4)
                        );
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                        redeemPercent === p.value
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 text-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Principals row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Principals
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance {pool.principalTokens} Principals
                    </p>
                  </div>
                  {redeemApprovals.principals ? (
                    <span className="text-sm font-medium text-gray-500">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setRedeemApprovals((prev) => ({
                          ...prev,
                          principals: true,
                        }))
                      }
                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                </div>

                {/* Yields row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Yields
                    </p>
                    <p className="text-sm text-gray-500">
                      Balance {pool.yieldTokens} Yields
                    </p>
                  </div>
                  {redeemApprovals.yields ? (
                    <span className="text-sm font-medium text-gray-500">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setRedeemApprovals((prev) => ({
                          ...prev,
                          yields: true,
                        }))
                      }
                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* To section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">To</h3>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Token</span>
                    <button
                      onClick={() =>
                        setRedeemToken(
                          redeemToken === "ETH" ? "stETH" : "ETH"
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Image
                        src="/icon/eth.png"
                        alt={redeemToken}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {redeemToken}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className="text-gray-400"
                      >
                        <path
                          d="M3 5L6 8L9 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">
                    Estimate: {redeemToken}
                  </span>
                </div>
              </div>
            </div>

            {/* Execute button */}
            <div className="flex justify-center">
              <button className="px-16 py-3 bg-gray-200 text-gray-400 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
                Execute
              </button>
            </div>
          </>
        )}
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
        <>
          {/* From section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
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
          <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl shadow-sm transition-colors cursor-pointer">
            Execute
          </button>
        </>
      ) : (
        <>
          {/* Withdraw: From section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">From</h3>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Principals */}
            <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Principals
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance {pool.principalTokens} Principals
                  </p>
                </div>
                {approvals.principals ? (
                  <span className="text-sm font-medium text-gray-500">
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => handleApprove("principals")}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>

            {/* Plus connector */}
            <div className="flex justify-center -my-2 relative z-10">
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
            <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Yields
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance {pool.yieldTokens} Yields
                  </p>
                </div>
                {approvals.yields ? (
                  <span className="text-sm font-medium text-gray-500">
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => handleApprove("yields")}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>

            {/* Plus connector */}
            <div className="flex justify-center -my-2 relative z-10">
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

            {/* LP Tokens */}
            <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    LP Tokens
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance {pool.lpTokens} LP Tokens
                  </p>
                </div>
                {approvals.lp ? (
                  <span className="text-sm font-medium text-gray-500">
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => handleApprove("lp")}
                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Withdraw: To section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">To</h3>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Token</span>
                  <button
                    onClick={() =>
                      setWithdrawToken(
                        withdrawToken === "ETH" ? "stETH" : "ETH"
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Image
                      src="/icon/eth.png"
                      alt={withdrawToken}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {withdrawToken}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="text-gray-400"
                    >
                      <path
                        d="M3 5L6 8L9 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Estimate: {totalWithdrawTokens.toFixed(4)} {withdrawToken}
                  </p>
                  <p className="text-xs text-gray-400">
                    ~${Number(estimateUSD).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Execute button */}
          <button
            disabled={!allApproved}
            className={`w-full py-3 text-base font-semibold rounded-xl shadow-sm transition-colors cursor-pointer ${
              allApproved
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Execute
          </button>
        </>
      )}
    </div>
  );
}
