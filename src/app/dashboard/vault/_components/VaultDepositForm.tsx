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
  autoRollerAbi,
  ORLANCE_DEPLOYMENT,
} from "@/lib/orlance/contracts";
import type { useAutoRollerVault } from "@/hooks/useAutoRollerVault";

type VaultData = ReturnType<typeof useAutoRollerVault>;

export default function VaultDepositForm({ data }: { data: VaultData }) {
  const [amount, setAmount] = useState("");
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

  const needsApproval = parsedAmount > 0n && data.balances.stEthAllowance < parsedAmount;

  const handleApprove = async () => {
    if (!address || parsedAmount <= 0n) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "approve",
      args: [ORLANCE_DEPLOYMENT.addresses.autoRoller, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleDeposit = async () => {
    if (!address || parsedAmount <= 0n) return;
    await depositWrite.writeContractAsync({
      abi: autoRollerAbi,
      address: ORLANCE_DEPLOYMENT.addresses.autoRoller,
      functionName: "deposit",
      args: [parsedAmount],
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
            selectedToken="stETH"
            onSelectToken={() => {}}
            amount={amount}
            onAmountChange={setAmount}
            balance={data.formatted.stEth}
            tokenLocked
          />
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p className="text-gray-400">
          Deposit stETH to receive OAS. Yield is automatically
          compounded every roll-over period.
        </p>
        {!data.isConfigured && (
          <p className="text-yellow-300 text-center">
            Auto-Roller address is not configured in env.
          </p>
        )}
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
          data.isConfigured
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

