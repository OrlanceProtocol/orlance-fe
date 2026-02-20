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
import { autoRollerAbi, ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";
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
      abi: autoRollerAbi,
      address: ORLANCE_DEPLOYMENT.addresses.autoRoller,
      functionName: "withdraw",
      args: [parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const isBusy = withdrawWrite.isPending || withdrawReceipt.isLoading;

  const userSharesNum = toEtherNumber(data.balances.userShares);
  const stEthEquivalent = toFixedString(userSharesNum * data.derived.sharePrice);

  return (
    <>
      <div className="mb-6">
        <SectionHeader title="Withdraw by OAS Shares" />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Your OAS</span>
            <span className="text-white">{data.formatted.userShares} OAS</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">stETH Equivalent</span>
            <span className="text-teal-300">{stEthEquivalent} stETH</span>
          </div>

          <div className="pt-2 border-t border-gray-700/30">
            <PercentageButtons
              balance={data.formatted.userShares}
              amount={amount}
              onAmountChange={setAmount}
            />
            <p className="text-xs text-gray-500 mt-2">
              Input is in OAS shares. Estimated output:{" "}
              {toFixedString((Number(amount) || 0) * data.derived.sharePrice, 6)} stETH
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <p className="text-gray-400">
          Withdraw stETH from the vault by burning your OAS shares.
        </p>
        {!data.isConfigured && (
          <p className="text-yellow-300 text-center">
            Auto-Roller address is not configured in env.
          </p>
        )}
        {withdrawWrite.error && (
          <p className="text-red-400 text-center">
            {withdrawWrite.error.message}
          </p>
        )}
      </div>

      <ExecuteButton
        enabled={
          Boolean(address) &&
          data.isConfigured &&
          parsedAmount > 0n &&
          parsedAmount <= data.balances.userShares
        }
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
