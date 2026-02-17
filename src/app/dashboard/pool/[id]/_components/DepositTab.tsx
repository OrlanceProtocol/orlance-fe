import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import YieldStrategyCard from "./YieldStrategyCard";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";
import ApproveButton from "./ApproveButton";
import {
  erc20Abi,
  ORLANCE_DEPLOYMENT,
  vaultAbi,
  routerAbi,
} from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

export default function DepositTab({ pool }: { pool: Pool }) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");
  const [strategy, setStrategy] = useState<"fixed" | "variable">("fixed");
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
  const depositWrite = useWriteContract();

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const depositReceipt = useWaitForTransactionReceipt({ hash: depositWrite.data });

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

  const handleExecute = async () => {
    if (!address || parsedAmount <= 0n) return;

    if (selectedToken === "ETH") {
      await depositWrite.writeContractAsync({
        abi: routerAbi,
        address: ORLANCE_DEPLOYMENT.addresses.router,
        functionName: "zapDeposit",
        args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp)],
        value: parsedAmount,
        chainId: ORLANCE_DEPLOYMENT.chainId,
      });
    } else {
      await depositWrite.writeContractAsync({
        abi: vaultAbi,
        address: ORLANCE_DEPLOYMENT.addresses.vault,
        functionName: "deposit",
        args: [BigInt(ORLANCE_DEPLOYMENT.maturityTimestamp), parsedAmount],
        chainId: ORLANCE_DEPLOYMENT.chainId,
      });
    }
  };

  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    depositWrite.isPending ||
    depositReceipt.isLoading;

  const balance = selectedToken === "ETH" ? onchain.formatted.eth : onchain.formatted.stEth;

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

      <SectionHeader title="To" withDivider />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <YieldStrategyCard
          type="fixed"
          label="Fixed Yield"
          sublabel="Mint TPS + TYS"
          apr={Number(onchain.formatted.fixedApr)}
          selected={strategy === "fixed"}
          onSelect={() => setStrategy("fixed")}
        />
        <YieldStrategyCard
          type="variable"
          label="Variable Yield"
          sublabel="LP fee APR (24h extrapolated)"
          apr={Number(onchain.formatted.lpApr)}
          selected={strategy === "variable"}
          onSelect={() => setStrategy("variable")}
        />
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p className="text-gray-400">
          Receive 1 TPS + 1 TYS per 1 stETH deposited into maturity pool.
        </p>
        <p className="text-gray-500">Maturity: {pool.maturity}</p>
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
        {selectedToken === "ETH" && (
          <p className="text-gray-500 text-center">
            Uses Router `zapDeposit` (ETH -&gt; stETH -&gt; Vault) in one tx.
          </p>
        )}
        {approveWrite.error && <p className="text-red-400 text-center">{approveWrite.error.message}</p>}
        {depositWrite.error && <p className="text-red-400 text-center">{depositWrite.error.message}</p>}
      </div>

      <ExecuteButton
        enabled={Boolean(address) && parsedAmount > 0n && !needsApproval}
        pending={isBusy}
        fullWidth
        label="Deposit"
        pendingLabel="Submitting..."
        onClick={() => {
          void handleExecute();
        }}
      />
    </>
  );
}
