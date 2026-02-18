"use client";

import { useMemo, useState } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import SectionHeader from "@/app/dashboard/pool/[id]/_components/SectionHeader";
import ExecuteButton from "@/app/dashboard/pool/[id]/_components/ExecuteButton";
import PercentageButtons from "@/app/dashboard/pool/[id]/_components/PercentageButtons";
import { autoRollerVaultAbi, ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";
import { toEtherNumber, toFixedString } from "@/lib/format";
import type { useAutoRollerVault } from "@/hooks/useAutoRollerVault";

type VaultData = ReturnType<typeof useAutoRollerVault>;

export default function VaultWithdrawForm({ data }: { data: VaultData }) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseEther(amount) : 0n;
    } catch {
      return 0n;
    }
  }, [amount]);

  const withdrawWrite = useWriteContract();
  const withdrawReceipt = useWaitForTransactionReceipt({
    hash: withdrawWrite.data,
  });

  const handleWithdraw = async () => {
    if (!address || parsedAmount <= 0n) return;
    await withdrawWrite.writeContractAsync({
      abi: autoRollerVaultAbi,
      address: ORLANCE_DEPLOYMENT.addresses.autoRollerVault,
      functionName: "withdraw",
      args: [parsedAmount, address, address],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const isBusy = withdrawWrite.isPending || withdrawReceipt.isLoading;

  const userSharesNum = toEtherNumber(data.balances.userShares);
  const stEthEquivalent = toFixedString(
    userSharesNum * data.derived.sharePrice,
  );

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="Withdraw to stETH" />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Your OstETH</span>
            <span className="text-white">{data.formatted.userShares} OstETH</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">stETH Equivalent</span>
            <span className="text-teal-300">{stEthEquivalent} stETH</span>
          </div>

          <div className="pt-2 border-t border-gray-700/30">
            <PercentageButtons
              balance={stEthEquivalent}
              amount={amount}
              onAmountChange={setAmount}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p className="text-gray-400">
          Withdraw stETH from the vault by burning your OstETH.
        </p>
        {withdrawWrite.error && (
          <p className="text-red-400 text-center">
            {withdrawWrite.error.message}
          </p>
        )}
      </div>

      <ExecuteButton
        enabled={Boolean(address) && parsedAmount > 0n}
        pending={isBusy}
        fullWidth
        label="Withdraw"
        pendingLabel="Withdrawing..."
        onClick={() => {
          void handleWithdraw();
        }}
      />
    </>
  );
}
