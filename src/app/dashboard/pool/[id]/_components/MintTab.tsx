import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";
import ApproveButton from "./ApproveButton";
import { erc20Abi, ORLANCE_DEPLOYMENT, routerAbi, vaultAbi } from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

export default function MintTab({ pool }: { pool: Pool }) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");
  const { address } = useAccount();
  const onchain = useOrlancePoolData();

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseEther(amount) : 0n;
    } catch {
      return 0n;
    }
  }, [amount]);

  const allowanceQuery = useReadContract({
    abi: erc20Abi,
    address: ORLANCE_DEPLOYMENT.addresses.stEth,
    functionName: "allowance",
    args: [address ?? ORLANCE_DEPLOYMENT.addresses.vault, ORLANCE_DEPLOYMENT.addresses.vault],
    query: { enabled: selectedToken === "stETH" && Boolean(address) },
  });

  const approveWrite = useWriteContract();
  const mintWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const mintReceipt = useWaitForTransactionReceipt({ hash: mintWrite.data });

  const needsApproval =
    selectedToken === "stETH" &&
    parsedAmount > 0n &&
    typeof allowanceQuery.data === "bigint" &&
    allowanceQuery.data < parsedAmount;

  const handleApprove = async () => {
    if (!address || parsedAmount <= 0n) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "approve",
      args: [ORLANCE_DEPLOYMENT.addresses.vault, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleMint = async () => {
    if (!address || parsedAmount <= 0n) return;
    if (selectedToken === "ETH") {
      await mintWrite.writeContractAsync({
        abi: routerAbi,
        address: ORLANCE_DEPLOYMENT.addresses.router,
        functionName: "zapDeposit",
        args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp)],
        value: parsedAmount,
        chainId: ORLANCE_DEPLOYMENT.chainId,
      });
    } else {
      await mintWrite.writeContractAsync({
        abi: vaultAbi,
        address: ORLANCE_DEPLOYMENT.addresses.vault,
        functionName: "deposit",
        args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp), parsedAmount],
        chainId: ORLANCE_DEPLOYMENT.chainId,
      });
    }
  };

  const balance = selectedToken === "ETH" ? onchain.formatted.eth : onchain.formatted.stEth;
  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    mintWrite.isPending ||
    mintReceipt.isLoading;

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="From" />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <TokenInput
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            amount={amount}
            onAmountChange={setAmount}
            balance={balance}
          />
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <p className="text-sm text-gray-500 mb-3">Maturity: {pool.maturity}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">Principals (TPS)</p>
              <p className="text-sm text-gray-500">Estimated: {amount || "0"} TPS</p>
            </div>
            <div>
              <p className="text-base font-semibold text-white">Yields (TYS)</p>
              <p className="text-sm text-gray-500">Estimated: {amount || "0"} TYS</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        {selectedToken === "stETH" && needsApproval && (
          <div className="flex justify-center">
            <ApproveButton
              approved={false}
              pending={approveWrite.isPending || approveReceipt.isLoading}
              onApprove={() => {
                void handleApprove();
              }}
            />
          </div>
        )}
        {approveWrite.error && <p className="text-red-400 text-center">{approveWrite.error.message}</p>}
        {mintWrite.error && <p className="text-red-400 text-center">{mintWrite.error.message}</p>}
      </div>

      <ExecuteButton
        enabled={Boolean(address) && parsedAmount > 0n && !needsApproval}
        pending={isBusy}
        label="Mint"
        pendingLabel="Minting..."
        onClick={() => {
          void handleMint();
        }}
      />
    </>
  );
}
