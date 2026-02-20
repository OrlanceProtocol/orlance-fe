import { useMemo, useState } from "react";
import { parseEther, zeroAddress } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Pool } from "@/data/pools";
import SectionHeader from "./SectionHeader";
import PlusConnector from "./PlusConnector";
import PercentageButtons from "./PercentageButtons";
import ExecuteButton from "./ExecuteButton";
import ApproveButton from "./ApproveButton";
import { ammAbi, erc20Abi, ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

export default function PoolTab({ pool }: { pool: Pool }) {
  const [poolSubTab, setPoolSubTab] = useState<"add" | "remove">("add");
  const [poolPrincipalAmount, setPoolPrincipalAmount] = useState("");
  const [poolStEthAmount, setPoolStEthAmount] = useState("");
  const [removeLpAmount, setRemoveLpAmount] = useState("");
  const { address } = useAccount();
  const ammAddress = pool.addresses.amm;
  const isAmmConfigured = ammAddress.toLowerCase() !== zeroAddress.toLowerCase();
  const onchain = useOrlancePoolData({
    maturityTimestamp: pool.maturityTimestamp,
    addresses: {
      tps: pool.addresses.tps,
      tys: pool.addresses.tys,
      amm: pool.addresses.amm,
    },
  });

  const parsedPrincipalAmount = useMemo(() => {
    try {
      return poolPrincipalAmount ? parseEther(poolPrincipalAmount) : 0n;
    } catch {
      return 0n;
    }
  }, [poolPrincipalAmount]);

  const parsedStEthAmount = useMemo(() => {
    try {
      return poolStEthAmount ? parseEther(poolStEthAmount) : 0n;
    } catch {
      return 0n;
    }
  }, [poolStEthAmount]);

  const parsedLpAmount = useMemo(() => {
    try {
      return removeLpAmount ? parseEther(removeLpAmount) : 0n;
    } catch {
      return 0n;
    }
  }, [removeLpAmount]);

  const tpsAllowanceQuery = useReadContract({
    abi: erc20Abi,
    address: pool.addresses.tps,
    functionName: "allowance",
    args: [address ?? ammAddress, ammAddress],
    query: { enabled: Boolean(address) && poolSubTab === "add" && isAmmConfigured },
  });

  const stEthAllowanceQuery = useReadContract({
    abi: erc20Abi,
    address: ORLANCE_DEPLOYMENT.addresses.stEth,
    functionName: "allowance",
    args: [address ?? ammAddress, ammAddress],
    query: { enabled: Boolean(address) && poolSubTab === "add" && isAmmConfigured },
  });

  const approveWrite = useWriteContract();
  const actionWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const actionReceipt = useWaitForTransactionReceipt({ hash: actionWrite.data });

  const needsTpsApproval =
    poolSubTab === "add" &&
    parsedPrincipalAmount > 0n &&
    typeof tpsAllowanceQuery.data === "bigint" &&
    tpsAllowanceQuery.data < parsedPrincipalAmount;
  const needsStEthApproval =
    poolSubTab === "add" &&
    parsedStEthAmount > 0n &&
    typeof stEthAllowanceQuery.data === "bigint" &&
    stEthAllowanceQuery.data < parsedStEthAmount;

  const handleApproveTps = async () => {
    if (!address || parsedPrincipalAmount <= 0n || !isAmmConfigured) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: pool.addresses.tps,
      functionName: "approve",
      args: [ammAddress, parsedPrincipalAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleApproveStEth = async () => {
    if (!address || parsedStEthAmount <= 0n || !isAmmConfigured) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "approve",
      args: [ammAddress, parsedStEthAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const handleExecute = async () => {
    if (!address || !isAmmConfigured) return;
    if (poolSubTab === "add") {
      if (parsedPrincipalAmount <= 0n || parsedStEthAmount <= 0n) return;
      await actionWrite.writeContractAsync({
        abi: ammAbi,
        address: ammAddress,
        functionName: "addLiquidity",
        args: [parsedPrincipalAmount, parsedStEthAmount],
        chainId: ORLANCE_DEPLOYMENT.chainId,
      });
      return;
    }

    if (parsedLpAmount <= 0n) return;
    await actionWrite.writeContractAsync({
      abi: ammAbi,
      address: ammAddress,
      functionName: "removeLiquidity",
      args: [parsedLpAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
  };

  const reserveTps = Number(onchain.pool.reserveTps) / 1e18;
  const reserveStEth = Number(onchain.pool.reserveStEth) / 1e18;
  const totalReserve = reserveTps + reserveStEth;
  const principalRatio = totalReserve > 0 ? (reserveTps / totalReserve) * 100 : 50;
  const stEthRatio = 100 - principalRatio;
  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    actionWrite.isPending ||
    actionReceipt.isLoading;

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-700/30 overflow-hidden">
          <button
            onClick={() => setPoolSubTab("add")}
            className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              poolSubTab === "add"
                ? "bg-[#1a2332] text-white"
                : "bg-[#151f2e] text-gray-500 hover:text-gray-300"
            }`}
          >
            Add Liquidity
          </button>
          <button
            onClick={() => setPoolSubTab("remove")}
            className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
              poolSubTab === "remove"
                ? "bg-[#1a2332] text-white"
                : "bg-[#151f2e] text-gray-500 hover:text-gray-300"
            }`}
          >
            Remove Liquidity
          </button>
        </div>
      </div>

      {!isAmmConfigured && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200 mb-6">
          No AMM is configured for this maturity. Swap/Pool actions are available after deploying an AMM for this specific pool.
        </div>
      )}

      <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e] mb-6">
        <p className="text-base font-semibold text-white mb-2">Pool Ratio (TPS / stETH)</p>
        <p className="text-xs text-gray-500 mb-2">Maturity: {pool.maturity}</p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{principalRatio.toFixed(3)}%</p>
            <p className="text-xs text-gray-500">TPS share</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{stEthRatio.toFixed(3)}%</p>
            <p className="text-xs text-gray-500">stETH share</p>
          </div>
        </div>
      </div>

      {poolSubTab === "add" ? (
        <>
          <div className="mb-6">
            <SectionHeader title="From" withDivider />

            <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-semibold text-white">Principals (TPS)</p>
                <span className="text-sm text-gray-400">Balance {onchain.formatted.tps}</span>
                <ApproveButton
                  approved={!needsTpsApproval}
                  pending={approveWrite.isPending || approveReceipt.isLoading}
                  onApprove={() => {
                    void handleApproveTps();
                  }}
                />
              </div>
              <PercentageButtons
                balance={onchain.formatted.tps}
                amount={poolPrincipalAmount}
                onAmountChange={setPoolPrincipalAmount}
              />
            </div>

            <PlusConnector />

            <div className="rounded-xl border border-gray-700/30 p-4 bg-[#151f2e]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-semibold text-white">stETH</p>
                <span className="text-sm text-gray-400">Balance {onchain.formatted.stEth}</span>
                <ApproveButton
                  approved={!needsStEthApproval}
                  pending={approveWrite.isPending || approveReceipt.isLoading}
                  onApprove={() => {
                    void handleApproveStEth();
                  }}
                />
              </div>
              <PercentageButtons
                balance={onchain.formatted.stEth}
                amount={poolStEthAmount}
                onAmountChange={setPoolStEthAmount}
              />
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="To" withDivider />
            <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white">LP Tokens</p>
                  <p className="text-sm text-gray-500">Estimate: based on pool reserves</p>
                </div>
                <span className="text-sm text-gray-500">Your LP balance {onchain.formatted.lp}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-8">
          <SectionHeader title="Remove LP" withDivider />
          <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-3">
            <p className="text-sm text-gray-400">LP Balance: {onchain.formatted.lp}</p>
            <PercentageButtons
              balance={onchain.formatted.lp}
              amount={removeLpAmount}
              onAmountChange={setRemoveLpAmount}
            />
          </div>
        </div>
      )}

      {approveWrite.error && <p className="text-red-400 text-center mb-2">{approveWrite.error.message}</p>}
      {actionWrite.error && <p className="text-red-400 text-center mb-2">{actionWrite.error.message}</p>}

      <ExecuteButton
        enabled={
          isAmmConfigured &&
          Boolean(address) &&
          (poolSubTab === "add"
            ? parsedPrincipalAmount > 0n &&
              parsedStEthAmount > 0n &&
              !needsTpsApproval &&
              !needsStEthApproval
            : parsedLpAmount > 0n)
        }
        pending={isBusy}
        label={poolSubTab === "add" ? "Add Liquidity" : "Remove Liquidity"}
        pendingLabel="Submitting..."
        onClick={() => {
          void handleExecute();
        }}
      />
    </>
  );
}
