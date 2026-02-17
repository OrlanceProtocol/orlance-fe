import { useState } from "react";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import PlusConnector from "./PlusConnector";
import ApproveButton from "./ApproveButton";
import ExecuteButton from "./ExecuteButton";
import TokenSelector from "./TokenSelector";

type ApprovalState = {
  principals: boolean;
  yields: boolean;
  lp: boolean;
};

export default function WithdrawTab({ pool }: { pool: Pool }) {
  const [withdrawToken, setWithdrawToken] = useState<"ETH" | "stETH">("stETH");
  const [approvals, setApprovals] = useState<ApprovalState>({
    principals: false,
    yields: false,
    lp: false,
  });

  const ethPrice = 3818.62;
  const totalWithdrawTokens =
    pool.principalTokens + pool.yieldTokens + pool.lpTokens;
  const estimateUSD = (totalWithdrawTokens * ethPrice).toFixed(2);
  const allApproved = approvals.principals && approvals.yields && approvals.lp;

  const handleApprove = (token: keyof ApprovalState) => {
    setApprovals((prev) => ({ ...prev, [token]: true }));
  };

  return (
    <>
      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" withDivider />

        {/* Principals */}
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">
                Principals
              </p>
              <p className="text-sm text-gray-400">
                Balance {pool.principalTokens} Principals
              </p>
            </div>
            <ApproveButton
              approved={approvals.principals}
              onApprove={() => handleApprove("principals")}
            />
          </div>
        </div>

        <PlusConnector />

        {/* Yields */}
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">Yields</p>
              <p className="text-sm text-gray-400">
                Balance {pool.yieldTokens} Yields
              </p>
            </div>
            <ApproveButton
              approved={approvals.yields}
              onApprove={() => handleApprove("yields")}
            />
          </div>
        </div>

        <PlusConnector />

        {/* LP Tokens */}
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">LP Tokens</p>
              <p className="text-sm text-gray-400">
                Balance {pool.lpTokens} LP Tokens
              </p>
            </div>
            <ApproveButton
              approved={approvals.lp}
              onApprove={() => handleApprove("lp")}
            />
          </div>
        </div>
      </div>

      {/* To section */}
      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Token</span>
              <TokenSelector
                token={withdrawToken}
                onToggle={() =>
                  setWithdrawToken(withdrawToken === "ETH" ? "stETH" : "ETH")
                }
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                Estimate: {totalWithdrawTokens.toFixed(4)} {withdrawToken}
              </p>
              <p className="text-xs text-gray-500">
                ~${Number(estimateUSD).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ExecuteButton enabled={allApproved} fullWidth />
    </>
  );
}
