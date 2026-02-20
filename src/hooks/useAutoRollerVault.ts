"use client";

import { useMemo } from "react";
import { zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import {
  ammAbi,
  autoRollerAbi,
  erc20Abi,
  ORLANCE_DEPLOYMENT,
} from "@/lib/orlance/contracts";
import { clampApr, safeBigInt, toEtherNumber, toFixedString } from "@/lib/format";

const secondsInYear = 365 * 24 * 60 * 60;

export function useAutoRollerVault() {
  const { address, isConnected } = useAccount();
  const userAddress = address ?? zeroAddress;
  const vaultAddress = ORLANCE_DEPLOYMENT.addresses.autoRoller;
  const isConfigured = vaultAddress.toLowerCase() !== zeroAddress.toLowerCase();

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
        abi: autoRollerAbi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: vaultAddress,
        abi: autoRollerAbi,
        functionName: "totalAssets",
      },
      {
        address: vaultAddress,
        abi: autoRollerAbi,
        functionName: "totalSupply",
      },
      {
        address: vaultAddress,
        abi: autoRollerAbi,
        functionName: "nextRollOver",
      },
      {
        address: ORLANCE_DEPLOYMENT.addresses.stEth,
        abi: erc20Abi,
        functionName: "allowance",
        args: [userAddress, vaultAddress],
      },
      {
        address: ORLANCE_DEPLOYMENT.addresses.amm,
        abi: ammAbi,
        functionName: "reserve0",
      },
      {
        address: ORLANCE_DEPLOYMENT.addresses.amm,
        abi: ammAbi,
        functionName: "reserve1",
      },
    ],
    query: {
      refetchInterval: 10_000,
      enabled: isConfigured,
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
      reserveTps: safeBigInt(results, 6),
      reserveStEth: safeBigInt(results, 7),
    };
  }, [contractReads.data]);

  const derived = useMemo(() => {
    const nowTs = Math.floor(Date.now() / 1000);
    const totalAssets = toEtherNumber(readValues.totalAssets);
    const totalSupply = toEtherNumber(readValues.totalSupply);
    const userShares = toEtherNumber(readValues.userShares);
    const reserveTps = toEtherNumber(readValues.reserveTps);
    const reserveStEth = toEtherNumber(readValues.reserveStEth);

    const sharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1;
    const userDepositValue = userShares * sharePrice;
    const earnings = Math.max(userDepositValue - userShares, 0);

    const nextRollOverTs =
      readValues.nextRollOver > 0n
        ? Number(readValues.nextRollOver)
        : ORLANCE_DEPLOYMENT.maturityTimestamp || nowTs;
    const secondsToRollOver = Math.max(nextRollOverTs - nowTs, 0);
    const yearsToRollOver = Math.max(secondsToRollOver / secondsInYear, 1 / 365);
    const canRollOverNow = nextRollOverTs > 0 && nowTs >= nextRollOverTs;

    const tpsPriceInStEth = reserveTps > 0 ? reserveStEth / reserveTps : 0;
    const estimatedApy =
      tpsPriceInStEth > 0
        ? clampApr((((1 / tpsPriceInStEth) - 1) / yearsToRollOver) * 100)
        : 0;

    return {
      sharePrice,
      userDepositValue,
      earnings,
      estimatedApy,
      nextRollOverTs,
      secondsToRollOver,
      canRollOverNow,
      isAutoCompounding: isConfigured && (totalAssets > 0 || userShares > 0),
    };
  }, [isConfigured, readValues]);

  return {
    isConnected,
    isConfigured,
    address,
    vaultAddress,
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
      totalAssets: toFixedString(toEtherNumber(readValues.totalAssets), 6),
      totalSupply: toFixedString(toEtherNumber(readValues.totalSupply), 6),
      sharePrice: toFixedString(derived.sharePrice, 6),
      userDepositValue: toFixedString(derived.userDepositValue, 6),
      earnings: toFixedString(derived.earnings, 6),
      estimatedApy: toFixedString(derived.estimatedApy, 2),
    },
  };
}

