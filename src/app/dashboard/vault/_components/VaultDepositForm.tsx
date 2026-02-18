"use client";

import { useMemo, useState } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import TokenInput from "@/app/dashboard/pool/[id]/_components/TokenInput";
import SectionHeader from "@/app/dashboard/pool/[id]/_components/SectionHeader";
import ExecuteButton from "@/app/dashboard/pool/[id]/_components/ExecuteButton";
import ApproveButton from "@/app/dashboard/pool/[id]/_components/ApproveButton";
import {
  erc20Abi,
  autoRollerVaultAbi,
  ORLANCE_DEPLOYMENT,
} from "@/lib/orlance/contracts";
import type { useAutoRollerVault } from "@/hooks/useAutoRollerVault";

type VaultData = ReturnType<typeof useAutoRollerVault>;

export default function VaultDepositForm({ data }: { data: VaultData }) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("stETH");
  const { address } = useAccount();

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseEther(amount) : 0n;
    } catch {
      return 0n;
    }
  }, [amount]);

  const approveWrite = useWriteContract();
  const depositWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const depositReceipt = useWaitForTransactionReceipt({ hash: depositWrite.data });

  const needsApproval =
    selectedToken === "stETH" &&
    parsedAmount > 0n &&
    data.balances.stEthAllowance < parsedAmount;

  const handleApprove = async () => {
    if (!address || parsedAmount <= 0n) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "approve",
      args: [ORLANCE_DEPLOYMENT.addresses.autoRollerVault, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleDeposit = async () => {
    if (!address || parsedAmount <= 0n) return;
    await depositWrite.writeContractAsync({
      abi: autoRollerVaultAbi,
      address: ORLANCE_DEPLOYMENT.addresses.autoRollerVault,
      functionName: "deposit",
      args: [parsedAmount, address],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    depositWrite.isPending ||
    depositReceipt.isLoading;

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="Deposit stETH" />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <TokenInput
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            amount={amount}
            onAmountChange={setAmount}
            balance={data.formatted.stEth}
          />
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p className="text-gray-400">
          Deposit stETH to receive OstETH. Yield is automatically
          compounded every roll-over period.
        </p>
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
            Please swap ETH to stETH first — the vault accepts stETH only.
          </p>
        )}
        {approveWrite.error && (
          <p className="text-red-400 text-center">{approveWrite.error.message}</p>
        )}
        {depositWrite.error && (
          <p className="text-red-400 text-center">{depositWrite.error.message}</p>
        )}
      </div>

      <ExecuteButton
        enabled={
          Boolean(address) &&
          parsedAmount > 0n &&
          !needsApproval &&
          selectedToken === "stETH"
        }
        pending={isBusy}
        fullWidth
        label="Deposit"
        pendingLabel="Depositing..."
        onClick={() => {
          void handleDeposit();
        }}
      />
    </>
  );
}
