"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Address, parseAbiItem, zeroAddress } from "viem";
import { useAccount, useBalance, usePublicClient, useReadContracts } from "wagmi";
import {
  ammAbi,
  erc20Abi,
  ORLANCE_DEPLOYMENT,
  vaultAbi,
} from "@/lib/orlance/contracts";
import {
  safeBigInt,
  toEtherNumber,
  toFixedString,
  clampApr,
} from "@/lib/format";

const secondsInYear = 365 * 24 * 60 * 60;

interface UseOrlancePoolDataOptions {
  maturityTimestamp?: number;
  addresses?: {
    tps?: Address;
    tys?: Address;
    amm?: Address;
  };
}

export function useOrlancePoolData(options: UseOrlancePoolDataOptions = {}) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: ORLANCE_DEPLOYMENT.chainId });
  const maturityTimestamp = options.maturityTimestamp ?? ORLANCE_DEPLOYMENT.maturityTimestamp;
  const stEthAddress = ORLANCE_DEPLOYMENT.addresses.stEth;
  const vaultAddress = ORLANCE_DEPLOYMENT.addresses.vault;
  const tpsAddress = options.addresses?.tps ?? ORLANCE_DEPLOYMENT.addresses.tps;
  const tysAddress = options.addresses?.tys ?? ORLANCE_DEPLOYMENT.addresses.tys;
  const ammAddress = options.addresses?.amm ?? ORLANCE_DEPLOYMENT.addresses.amm;
  const isAmmConfigured = ammAddress.toLowerCase() !== zeroAddress.toLowerCase();
  const userAddress = address ?? zeroAddress;
  const maturityBigInt = BigInt(maturityTimestamp || 0);

  const ethBalanceQuery = useBalance({
    address: address,
    chainId: ORLANCE_DEPLOYMENT.chainId,
    query: { enabled: Boolean(address) },
  });

  const contractReads = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: stEthAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [vaultAddress],
      },
      {
        address: stEthAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: tpsAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: tysAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: ammAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "pendingYield",
        args: [maturityBigInt, userAddress],
      },
      {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "storedBalance",
      },
      {
        address: ammAddress,
        abi: ammAbi,
        functionName: "reserve0",
      },
      {
        address: ammAddress,
        abi: ammAbi,
        functionName: "reserve1",
      },
      {
        address: tpsAddress,
        abi: erc20Abi,
        functionName: "totalSupply",
      },
      {
        address: tysAddress,
        abi: erc20Abi,
        functionName: "totalSupply",
      },
      {
        address: ammAddress,
        abi: erc20Abi,
        functionName: "totalSupply",
      },
    ],
    query: {
      refetchInterval: 10_000,
    },
  });

  const swapVolumeQuery = useQuery({
    queryKey: [
      "orlance-swap-volume-24h",
      ORLANCE_DEPLOYMENT.chainId,
      ammAddress,
    ],
    enabled:
      Boolean(publicClient) &&
      isAmmConfigured,
    queryFn: async () => {
      if (!publicClient) {
        return { stEthIn24h: 0, tpsIn24h: 0, swapCount24h: 0 };
      }

      const swapEvent = parseAbiItem(
        "event Swap(address indexed user, address indexed tokenIn, uint256 amountIn, address indexed tokenOut, uint256 amountOut)",
      );

      const logs = await publicClient.getLogs({
        address: ammAddress,
        event: swapEvent,
        fromBlock: 0n,
        toBlock: "latest",
      });

      if (!logs.length) {
        return { stEthIn24h: 0, tpsIn24h: 0, swapCount24h: 0 };
      }

      const blockNumberStrings = Array.from(
        new Set(
          logs
            .map((log) => log.blockNumber?.toString())
            .filter((value): value is string => Boolean(value)),
        ),
      );

      const blockTimestamps = new Map<string, number>();
      await Promise.all(
        blockNumberStrings.map(async (blockNumberString) => {
          const block = await publicClient.getBlock({
            blockNumber: BigInt(blockNumberString),
          });
          blockTimestamps.set(blockNumberString, Number(block.timestamp));
        }),
      );

      const nowTs = Math.floor(Date.now() / 1000);
      const cutoffTs = nowTs - 24 * 60 * 60;

      let stEthIn24h = 0;
      let tpsIn24h = 0;
      let swapCount24h = 0;

      for (const log of logs) {
        const blockNumberString = log.blockNumber?.toString();
        if (!blockNumberString) continue;
        const blockTimestamp = blockTimestamps.get(blockNumberString) ?? 0;
        if (blockTimestamp < cutoffTs) continue;

        const tokenIn = (log.args.tokenIn as Address | undefined)?.toLowerCase();
        const amountIn = typeof log.args.amountIn === "bigint" ? log.args.amountIn : 0n;
        const amountInEther = toEtherNumber(amountIn);

        if (tokenIn === stEthAddress.toLowerCase()) {
          stEthIn24h += amountInEther;
          swapCount24h += 1;
          continue;
        }

        if (tokenIn === tpsAddress.toLowerCase()) {
          tpsIn24h += amountInEther;
          swapCount24h += 1;
        }
      }

      return { stEthIn24h, tpsIn24h, swapCount24h };
    },
    refetchInterval: 60_000,
  });

  const readValues = useMemo(() => {
    const results = contractReads.data?.map((result) =>
      result.status === "success" ? result.result : undefined,
    );

    const vaultStEthBalance = safeBigInt(results, 0);
    const walletStEthBalance = safeBigInt(results, 1);
    const walletTpsBalance = safeBigInt(results, 2);
    const walletTysBalance = safeBigInt(results, 3);
    const walletLpBalance = safeBigInt(results, 4);
    const pendingYield = safeBigInt(results, 5);
    const storedBalance = safeBigInt(results, 6);
    const reserveTps = safeBigInt(results, 7);
    const reserveStEth = safeBigInt(results, 8);
    const totalSupplyTps = safeBigInt(results, 9);
    const totalSupplyTys = safeBigInt(results, 10);
    const totalSupplyLp = safeBigInt(results, 11);

    return {
      vaultStEthBalance,
      walletStEthBalance,
      walletTpsBalance,
      walletTysBalance,
      walletLpBalance,
      pendingYield,
      storedBalance,
      reserveTps,
      reserveStEth,
      totalSupplyTps,
      totalSupplyTys,
      totalSupplyLp,
    };
  }, [contractReads.data]);

  const derived = useMemo(() => {
    const nowTs = Math.floor(Date.now() / 1000);
    const maturityTs = maturityTimestamp || nowTs;
    const timeToMaturitySeconds = Math.max(maturityTs - nowTs, 1);
    const yearsToMaturity = timeToMaturitySeconds / secondsInYear;

    const reserveTps = toEtherNumber(readValues.reserveTps);
    const reserveStEth = toEtherNumber(readValues.reserveStEth);
    const totalSupplyLp = toEtherNumber(readValues.totalSupplyLp);

    const walletTps = toEtherNumber(readValues.walletTpsBalance);
    const walletTys = toEtherNumber(readValues.walletTysBalance);
    const walletLp = toEtherNumber(readValues.walletLpBalance);
    const pendingYield = toEtherNumber(readValues.pendingYield);

    const tpsPriceInStEth = reserveTps > 0 ? reserveStEth / reserveTps : 0;
    const tysPriceInStEth = Math.max(1 - tpsPriceInStEth, 0);
    const ammTvlStEth = reserveStEth + reserveTps * tpsPriceInStEth;
    const lpTokenPriceInStEth = totalSupplyLp > 0 ? ammTvlStEth / totalSupplyLp : 0;

    const fixedAprImplied =
      tpsPriceInStEth > 0
        ? clampApr((((1 / tpsPriceInStEth) - 1) / yearsToMaturity) * 100)
        : 0;

    const swapStats = swapVolumeQuery.data ?? { stEthIn24h: 0, tpsIn24h: 0, swapCount24h: 0 };
    const volume24hStEth = swapStats.stEthIn24h + swapStats.tpsIn24h * tpsPriceInStEth;
    const fees24hStEth = volume24hStEth * 0.003;
    const lpAprFeeBased = ammTvlStEth > 0 ? clampApr((fees24hStEth * 365 * 100) / ammTvlStEth) : 0;

    const positionStEth =
      walletTps * tpsPriceInStEth +
      walletTys * tysPriceInStEth +
      walletLp * lpTokenPriceInStEth +
      pendingYield;

    return {
      tpsPriceInStEth,
      tysPriceInStEth,
      lpTokenPriceInStEth,
      ammTvlStEth,
      fixedAprImplied,
      lpAprFeeBased,
      volume24hStEth,
      fees24hStEth,
      swapCount24h: swapStats.swapCount24h,
      positionStEth,
      yearsToMaturity,
    };
  }, [maturityTimestamp, readValues, swapVolumeQuery.data]);

  return {
    isConnected,
    address,
    isLoading:
      contractReads.isLoading || ethBalanceQuery.isLoading || swapVolumeQuery.isLoading,
    refetch: async () => {
      await Promise.all([
        contractReads.refetch(),
        ethBalanceQuery.refetch(),
        swapVolumeQuery.refetch(),
      ]);
    },
    chainId: ORLANCE_DEPLOYMENT.chainId,
    maturityTimestamp,
    balances: {
      eth: ethBalanceQuery.data?.value ?? 0n,
      stEth: readValues.walletStEthBalance,
      tps: readValues.walletTpsBalance,
      tys: readValues.walletTysBalance,
      lp: readValues.walletLpBalance,
      pendingYield: readValues.pendingYield,
    },
    pool: {
      vaultStEthBalance: readValues.vaultStEthBalance,
      storedBalance: readValues.storedBalance,
      reserveTps: readValues.reserveTps,
      reserveStEth: readValues.reserveStEth,
      totalSupplyTps: readValues.totalSupplyTps,
      totalSupplyTys: readValues.totalSupplyTys,
      totalSupplyLp: readValues.totalSupplyLp,
    },
    derived,
    formatted: {
      eth: toFixedString(toEtherNumber(ethBalanceQuery.data?.value ?? 0n)),
      stEth: toFixedString(toEtherNumber(readValues.walletStEthBalance)),
      tps: toFixedString(toEtherNumber(readValues.walletTpsBalance)),
      tys: toFixedString(toEtherNumber(readValues.walletTysBalance)),
      lp: toFixedString(toEtherNumber(readValues.walletLpBalance)),
      pendingYield: toFixedString(toEtherNumber(readValues.pendingYield)),
      tvlStEth: toFixedString(toEtherNumber(readValues.vaultStEthBalance), 2),
      tpsPrice: toFixedString(derived.tpsPriceInStEth, 6),
      tysPrice: toFixedString(derived.tysPriceInStEth, 6),
      lpPrice: toFixedString(derived.lpTokenPriceInStEth, 6),
      fixedApr: toFixedString(derived.fixedAprImplied, 2),
      lpApr: toFixedString(derived.lpAprFeeBased, 2),
      positionStEth: toFixedString(derived.positionStEth, 4),
      volume24hStEth: toFixedString(derived.volume24hStEth, 4),
      fees24hStEth: toFixedString(derived.fees24hStEth, 6),
    },
  };
}

