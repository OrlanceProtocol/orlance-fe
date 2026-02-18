"use client";

import { useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import {
  autoRollerVaultAbi,
  erc20Abi,
  ORLANCE_DEPLOYMENT,
} from "@/lib/orlance/contracts";
import { safeBigInt, toEtherNumber, toFixedString } from "@/lib/format";

const MOCK_APY = 4.82;
const MOCK_ROLL_OVER_DAYS = 30;

function getMockNextRollOver(): number {
  return Math.floor(Date.now() / 1000) + MOCK_ROLL_OVER_DAYS * 24 * 60 * 60;
}

export function useAutoRollerVault() {
  const { address, isConnected } = useAccount();
  const userAddress = address ?? zeroAddress;
  const vaultAddress = ORLANCE_DEPLOYMENT.addresses.autoRollerVault;

  const contractReads = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: ORLANCE_DEPLOYMENT.addresses.stEth,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: vaultAddress,
        abi: autoRollerVaultAbi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: vaultAddress,
        abi: autoRollerVaultAbi,
        functionName: "totalAssets",
      },
      {
        address: vaultAddress,
        abi: autoRollerVaultAbi,
        functionName: "totalSupply",
      },
      {
        address: vaultAddress,
        abi: autoRollerVaultAbi,
        functionName: "nextRollOver",
      },
      {
        address: ORLANCE_DEPLOYMENT.addresses.stEth,
        abi: erc20Abi,
        functionName: "allowance",
        args: [userAddress, vaultAddress],
      },
    ],
    query: {
      refetchInterval: 10_000,
    },
  });

  const readValues = useMemo(() => {
    const results = contractReads.data?.map((result) =>
      result.status === "success" ? result.result : undefined,
    );

    return {
      stEthBalance: safeBigInt(results, 0),
      userShares: safeBigInt(results, 1),
      totalAssets: safeBigInt(results, 2),
      totalSupply: safeBigInt(results, 3),
      nextRollOver: safeBigInt(results, 4),
      stEthAllowance: safeBigInt(results, 5),
    };
  }, [contractReads.data]);

  const derived = useMemo(() => {
    const totalAssets = toEtherNumber(readValues.totalAssets);
    const totalSupply = toEtherNumber(readValues.totalSupply);
    const userShares = toEtherNumber(readValues.userShares);

    const sharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1;
    const userDepositValue = userShares * sharePrice;

    // Earnings = current value - shares (assuming 1:1 initial deposit)
    const earnings = Math.max(userDepositValue - userShares, 0);

    // Use mock APY since contract is not deployed yet
    const estimatedApy = MOCK_APY;

    const isAutoCompounding = totalAssets > 0 || userShares > 0;

    // Use on-chain nextRollOver if available, otherwise mock
    const nextRollOverTs =
      readValues.nextRollOver > 0n
        ? Number(readValues.nextRollOver)
        : getMockNextRollOver();

    return {
      sharePrice,
      userDepositValue,
      earnings,
      estimatedApy,
      isAutoCompounding,
      nextRollOverTs,
    };
  }, [readValues]);

  return {
    isConnected,
    address,
    isLoading: contractReads.isLoading,
    refetch: contractReads.refetch,
    balances: {
      stEth: readValues.stEthBalance,
      userShares: readValues.userShares,
      stEthAllowance: readValues.stEthAllowance,
    },
    vault: {
      totalAssets: readValues.totalAssets,
      totalSupply: readValues.totalSupply,
      nextRollOver: readValues.nextRollOver,
    },
    derived,
    formatted: {
      stEth: toFixedString(toEtherNumber(readValues.stEthBalance)),
      userShares: toFixedString(toEtherNumber(readValues.userShares)),
      totalAssets: toFixedString(toEtherNumber(readValues.totalAssets), 2),
      totalSupply: toFixedString(toEtherNumber(readValues.totalSupply), 2),
      sharePrice: toFixedString(derived.sharePrice, 6),
      userDepositValue: toFixedString(derived.userDepositValue),
      earnings: toFixedString(derived.earnings, 6),
      estimatedApy: toFixedString(derived.estimatedApy, 2),
    },
  };
}
