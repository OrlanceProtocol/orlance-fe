import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import PercentageButtons from "./PercentageButtons";
import ExecuteButton from "./ExecuteButton";
import TokenSelector from "./TokenSelector";
import { ORLANCE_DEPLOYMENT, routerAbi, vaultAbi } from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

export default function RedeemTab({ pool }: { pool: Pool }) {
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemToken, setRedeemToken] = useState<"ETH" | "stETH">("stETH");
  const { address } = useAccount();
  const onchain = useOrlancePoolData({
    maturityTimestamp: pool.maturityTimestamp,
    addresses: {
      tps: pool.addresses.tps,
      tys: pool.addresses.tys,
      amm: pool.addresses.amm,
    },
  });

  const parsedAmount = useMemo(() => {
    try {
      return redeemAmount ? parseEther(redeemAmount) : 0n;
    } catch {
      return 0n;
    }
  }, [redeemAmount]);

  const redeemWrite = useWriteContract();
  const claimWrite = useWriteContract();
  const redeemReceipt = useWaitForTransactionReceipt({ hash: redeemWrite.data });
  const claimReceipt = useWaitForTransactionReceipt({ hash: claimWrite.data });

  const handleRedeem = async () => {
    if (!address || parsedAmount <= 0n) return;
    await redeemWrite.writeContractAsync({
      abi: routerAbi,
      address: ORLANCE_DEPLOYMENT.addresses.router,
      functionName: "zapRedeem",
      args: [BigInt(pool.maturityTimestamp), parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleClaimYield = async () => {
    if (!address) return;
    await claimWrite.writeContractAsync({
      abi: vaultAbi,
      address: ORLANCE_DEPLOYMENT.addresses.vault,
      functionName: "claimYield",
      args: [BigInt(pool.maturityTimestamp)],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const canRedeem = parsedAmount > 0n && parsedAmount <= onchain.balances.tps;
  const canClaim = onchain.balances.pendingYield > 0n;
  const isRedeeming = redeemWrite.isPending || redeemReceipt.isLoading;
  const isClaiming = claimWrite.isPending || claimReceipt.isLoading;

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="From" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-white">Principals (TPS)</p>
            <span className="text-sm text-gray-400">Balance: {onchain.formatted.tps}</span>
          </div>
          <PercentageButtons
            balance={onchain.formatted.tps}
            amount={redeemAmount}
            onAmountChange={setRedeemAmount}
          />
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Token</span>
              <TokenSelector
                token={redeemToken}
                onToggle={() => setRedeemToken(redeemToken === "ETH" ? "stETH" : "ETH")}
              />
            </div>
            <span className="text-sm text-gray-500">Estimate: {redeemAmount || "0"} stETH</span>
          </div>
          {redeemToken === "ETH" && (
            <p className="text-sm text-yellow-300">
              Current deployment uses MockLido, redeem output is stETH.
            </p>
          )}
          <p className="text-sm text-gray-400">
            Pending yield claimable now: {onchain.formatted.pendingYield} stETH
          </p>
          <p className="text-xs text-gray-500">Pool maturity: {pool.maturity}</p>
        </div>
      </div>

      <div className="space-y-3">
        <ExecuteButton
          enabled={Boolean(address) && canRedeem}
          pending={isRedeeming}
          label="Redeem TPS"
          pendingLabel="Redeeming..."
          onClick={() => {
            void handleRedeem();
          }}
        />
        <ExecuteButton
          enabled={Boolean(address) && canClaim}
          pending={isClaiming}
          label="Claim Yield"
          pendingLabel="Claiming..."
          onClick={() => {
            void handleClaimYield();
          }}
        />
        {redeemWrite.error && <p className="text-red-400 text-center">{redeemWrite.error.message}</p>}
        {claimWrite.error && <p className="text-red-400 text-center">{claimWrite.error.message}</p>}
      </div>
    </>
  );
}
