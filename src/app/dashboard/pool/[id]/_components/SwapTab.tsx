import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";
import ApproveButton from "./ApproveButton";
import { ammAbi, erc20Abi, ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

type SwapToken = "Principals (TPS)" | "stETH";

export default function SwapTab() {
  const [swapFromToken, setSwapFromToken] = useState<SwapToken>("Principals (TPS)");
  const [swapAmount, setSwapAmount] = useState("");
  const { address } = useAccount();
  const onchain = useOrlancePoolData();

  const parsedAmount = useMemo(() => {
    try {
      return swapAmount ? parseEther(swapAmount) : 0n;
    } catch {
      return 0n;
    }
  }, [swapAmount]);

  const tokenIn =
    swapFromToken === "Principals (TPS)"
      ? ORLANCE_DEPLOYMENT.addresses.tps
      : ORLANCE_DEPLOYMENT.addresses.stEth;

  const tokenOutLabel = swapFromToken === "Principals (TPS)" ? "stETH" : "Principals (TPS)";

  const allowanceQuery = useReadContract({
    abi: erc20Abi,
    address: tokenIn,
    functionName: "allowance",
    args: [address ?? ORLANCE_DEPLOYMENT.addresses.amm, ORLANCE_DEPLOYMENT.addresses.amm],
    query: { enabled: Boolean(address) },
  });

  const quoteQuery = useReadContract({
    abi: ammAbi,
    address: ORLANCE_DEPLOYMENT.addresses.amm,
    functionName: "getAmountOut",
    args: [tokenIn, parsedAmount],
    query: { enabled: parsedAmount > 0n },
  });

  const approveWrite = useWriteContract();
  const swapWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const swapReceipt = useWaitForTransactionReceipt({ hash: swapWrite.data });

  const needsApproval =
    parsedAmount > 0n && typeof allowanceQuery.data === "bigint" && allowanceQuery.data < parsedAmount;

  const handleApprove = async () => {
    if (!address || parsedAmount <= 0n) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: tokenIn,
      functionName: "approve",
      args: [ORLANCE_DEPLOYMENT.addresses.amm, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleSwap = async () => {
    if (!address || parsedAmount <= 0n) return;
    await swapWrite.writeContractAsync({
      abi: ammAbi,
      address: ORLANCE_DEPLOYMENT.addresses.amm,
      functionName: "swap",
      args: [tokenIn, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const maxBalance = swapFromToken === "Principals (TPS)" ? onchain.formatted.tps : onchain.formatted.stEth;
  const estimatedOut =
    typeof quoteQuery.data === "bigint" ? Number(quoteQuery.data) / 1e18 : 0;
  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    swapWrite.isPending ||
    swapReceipt.isLoading;

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="From" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-16 shrink-0">Token</span>
            <button
              onClick={() =>
                setSwapFromToken((prev) =>
                  prev === "Principals (TPS)" ? "stETH" : "Principals (TPS)",
                )
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/30 bg-[#1a2332] hover:bg-[#1e2a3a] transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-white">{swapFromToken}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <span className="text-sm text-gray-500">Balance: {maxBalance}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-16 shrink-0">Amount</span>
            <input
              type="number"
              value={swapAmount}
              onChange={(event) => setSwapAmount(event.target.value)}
              placeholder="0.00"
              className="w-48 px-4 py-2 rounded-lg border border-gray-700/30 bg-[#151f2e] text-base text-white shadow-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <p className="text-base font-semibold text-white">{tokenOutLabel}</p>
          <p className="text-sm text-gray-500">Estimated receive: {estimatedOut.toFixed(6)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {needsApproval && (
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
        {swapWrite.error && <p className="text-red-400 text-center">{swapWrite.error.message}</p>}
        <ExecuteButton
          enabled={Boolean(address) && parsedAmount > 0n && !needsApproval}
          pending={isBusy}
          label="Swap"
          pendingLabel="Swapping..."
          onClick={() => {
            void handleSwap();
          }}
        />
      </div>
    </>
  );
}

