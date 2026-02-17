import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";
import { ORLANCE_DEPLOYMENT, routerAbi, vaultAbi } from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

export default function WithdrawTab({ pool }: { pool: Pool }) {
  const { address } = useAccount();
  const onchain = useOrlancePoolData();

  const redeemAllWrite = useWriteContract();
  const claimWrite = useWriteContract();
  const redeemAllReceipt = useWaitForTransactionReceipt({ hash: redeemAllWrite.data });
  const claimReceipt = useWaitForTransactionReceipt({ hash: claimWrite.data });

  const handleRedeemAll = async () => {
    if (!address || onchain.balances.tps <= 0n) return;
    await redeemAllWrite.writeContractAsync({
      abi: routerAbi,
      address: ORLANCE_DEPLOYMENT.addresses.router,
      functionName: "zapRedeem",
      args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp), onchain.balances.tps],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleClaim = async () => {
    if (!address || onchain.balances.pendingYield <= 0n) return;
    await claimWrite.writeContractAsync({
      abi: vaultAbi,
      address: ORLANCE_DEPLOYMENT.addresses.vault,
      functionName: "claimYield",
      args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp)],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="Withdraw Summary" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">TPS Balance</span>
            <span className="text-white">{onchain.formatted.tps}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">TYS Balance</span>
            <span className="text-white">{onchain.formatted.tys}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Pending Yield</span>
            <span className="text-teal-300">{onchain.formatted.pendingYield} stETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Pool</span>
            <span className="text-white">{pool.id}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ExecuteButton
          enabled={Boolean(address) && onchain.balances.pendingYield > 0n}
          pending={claimWrite.isPending || claimReceipt.isLoading}
          fullWidth
          label="Claim All Yield"
          pendingLabel="Claiming..."
          onClick={() => {
            void handleClaim();
          }}
        />

        <ExecuteButton
          enabled={Boolean(address) && onchain.balances.tps > 0n}
          pending={redeemAllWrite.isPending || redeemAllReceipt.isLoading}
          fullWidth
          label="Redeem All TPS"
          pendingLabel="Redeeming..."
          onClick={() => {
            void handleRedeemAll();
          }}
        />
        {claimWrite.error && <p className="text-red-400 text-center">{claimWrite.error.message}</p>}
        {redeemAllWrite.error && <p className="text-red-400 text-center">{redeemAllWrite.error.message}</p>}
      </div>
    </>
  );
}
