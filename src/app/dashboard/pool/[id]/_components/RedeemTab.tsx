import { useState } from "react";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import PercentageButtons from "./PercentageButtons";
import ApproveButton from "./ApproveButton";
import ExecuteButton from "./ExecuteButton";
import TokenSelector from "./TokenSelector";

export default function RedeemTab({ pool }: { pool: Pool }) {
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemToken, setRedeemToken] = useState<"ETH" | "stETH">("stETH");
  const [redeemApprovals, setRedeemApprovals] = useState({
    principals: false,
    yields: false,
  });

  const minBalance = Math.min(pool.principalTokens, pool.yieldTokens);

  return (
    <>
      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          {/* Primitives header with balance */}
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-white">Primitives</p>
            <span className="text-sm text-gray-400">
              Balance: {pool.principalTokens} Principals &{" "}
              {pool.yieldTokens} Yields
            </span>
          </div>

          {/* Amount input with percentage buttons */}
          <PercentageButtons
            balance={minBalance}
            amount={redeemAmount}
            onAmountChange={setRedeemAmount}
          />

          {/* Principals row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/20">
            <div>
              <p className="text-base font-semibold text-white">
                Principals
              </p>
              <p className="text-sm text-gray-400">
                Balance {pool.principalTokens} Principals
              </p>
            </div>
            <ApproveButton
              approved={redeemApprovals.principals}
              onApprove={() =>
                setRedeemApprovals((prev) => ({ ...prev, principals: true }))
              }
            />
          </div>

          {/* Yields row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/20">
            <div>
              <p className="text-base font-semibold text-white">Yields</p>
              <p className="text-sm text-gray-400">
                Balance {pool.yieldTokens} Yields
              </p>
            </div>
            <ApproveButton
              approved={redeemApprovals.yields}
              onApprove={() =>
                setRedeemApprovals((prev) => ({ ...prev, yields: true }))
              }
            />
          </div>
        </div>
      </div>

      {/* To section */}
      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Token</span>
              <TokenSelector
                token={redeemToken}
                onToggle={() =>
                  setRedeemToken(redeemToken === "ETH" ? "stETH" : "ETH")
                }
              />
            </div>
            <span className="text-sm text-gray-500">
              Estimate: {redeemToken}
            </span>
          </div>
        </div>
      </div>

      <ExecuteButton />
    </>
  );
}
