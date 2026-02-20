"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseAbiItem, type Address, zeroAddress } from "viem";
import { useAccount, usePublicClient, useReadContracts } from "wagmi";
import {
  erc20Abi,
  lotteryAbi,
  ORLANCE_DEPLOYMENT,
  vaultAbi,
} from "@/lib/orlance/contracts";
import { safeBigInt, toEtherNumber, toFixedString } from "@/lib/format";

type WinnerHistoryItem = {
  roundId: number;
  winner: Address;
  maturity: number;
  prizeStEth: number;
  txHash: string;
  txUrl: string;
  timestamp: number;
};

const MAX_PARTICIPANT_SCAN = 500;
const explorerBaseUrl =
  process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || "https://sepolia.arbiscan.io";

function asAddress(value: unknown): Address {
  return typeof value === "string" ? (value as Address) : zeroAddress;
}

function asBool(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function asBigInt(value: unknown): bigint {
  return typeof value === "bigint" ? value : 0n;
}

function parseRound(roundRaw: unknown) {
  const round = roundRaw as
    | {
        startAt?: bigint;
        endAt?: bigint;
        drawnAt?: bigint;
        maturity?: bigint;
        totalDeposits?: bigint;
        totalTickets?: bigint;
        prizeStEth?: bigint;
        winner?: Address;
        drawn?: boolean;
      }
    | readonly unknown[]
    | undefined;

  const byIndex = Array.isArray(round) ? round : [];
  const getBig = (named: bigint | undefined, index: number) =>
    typeof named === "bigint" ? named : asBigInt(byIndex[index]);
  const namedWinner = (round as { winner?: Address } | undefined)?.winner;
  const winner = typeof namedWinner === "string" ? (namedWinner as Address) : asAddress(byIndex[7]);

  return {
    startAt: Number(getBig((round as { startAt?: bigint } | undefined)?.startAt, 0)),
    endAt: Number(getBig((round as { endAt?: bigint } | undefined)?.endAt, 1)),
    drawnAt: Number(getBig((round as { drawnAt?: bigint } | undefined)?.drawnAt, 2)),
    maturity: Number(getBig((round as { maturity?: bigint } | undefined)?.maturity, 3)),
    totalDeposits: getBig((round as { totalDeposits?: bigint } | undefined)?.totalDeposits, 4),
    totalTickets: getBig((round as { totalTickets?: bigint } | undefined)?.totalTickets, 5),
    prizeStEth: getBig((round as { prizeStEth?: bigint } | undefined)?.prizeStEth, 6),
    winner,
    drawn:
      typeof (round as { drawn?: boolean } | undefined)?.drawn === "boolean"
        ? Boolean((round as { drawn?: boolean } | undefined)?.drawn)
        : asBool(byIndex[8]),
  };
}

export function useNoLossLottery() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: ORLANCE_DEPLOYMENT.chainId });

  const userAddress = address ?? zeroAddress;
  const lotteryAddress = ORLANCE_DEPLOYMENT.addresses.lottery;
  const stEthAddress = ORLANCE_DEPLOYMENT.addresses.stEth;
  const vaultAddress = ORLANCE_DEPLOYMENT.addresses.vault;
  const isConfigured = lotteryAddress.toLowerCase() !== zeroAddress.toLowerCase();

  const baseReads = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: stEthAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      },
      {
        address: stEthAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [userAddress, lotteryAddress],
      },
      {
        address: stEthAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [lotteryAddress],
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "owner",
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "currentRoundId",
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "activeMaturity",
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "roundDuration",
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "canDrawCurrentRound",
      },
    ],
    query: {
      enabled: isConfigured,
      refetchInterval: 10_000,
    },
  });

  const baseValues = useMemo(() => {
    const results = baseReads.data?.map((result) =>
      result.status === "success" ? result.result : undefined,
    );

    return {
      walletStEth: safeBigInt(results, 0),
      stEthAllowance: safeBigInt(results, 1),
      lotteryLiquidStEth: safeBigInt(results, 2),
      owner: asAddress(results?.[3]),
      currentRoundId: Number(safeBigInt(results, 4)),
      activeMaturity: Number(safeBigInt(results, 5)),
      roundDuration: Number(safeBigInt(results, 6)),
      canDrawCurrentRound: asBool(results?.[7]),
    };
  }, [baseReads.data]);

  const roundReads = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "rounds",
        args: [BigInt(baseValues.currentRoundId || 0)],
      },
      {
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "userTickets",
        args: [BigInt(baseValues.currentRoundId || 0), userAddress],
      },
      {
        address: vaultAddress,
        abi: vaultAbi,
        functionName: "pendingYield",
        args: [BigInt(baseValues.activeMaturity || 0), lotteryAddress],
      },
    ],
    query: {
      enabled:
        isConfigured &&
        baseValues.currentRoundId > 0 &&
        baseValues.activeMaturity > 0,
      refetchInterval: 10_000,
    },
  });

  const roundValues = useMemo(() => {
    const results = roundReads.data?.map((result) =>
      result.status === "success" ? result.result : undefined,
    );

    const parsedRound = parseRound(results?.[0]);

    return {
      round: parsedRound,
      myTickets: safeBigInt(results, 1),
      pendingYield: safeBigInt(results, 2),
    };
  }, [roundReads.data]);

  const participantsQuery = useQuery({
    queryKey: [
      "lottery-participants",
      ORLANCE_DEPLOYMENT.chainId,
      lotteryAddress,
      baseValues.currentRoundId,
    ],
    enabled:
      Boolean(publicClient) &&
      isConfigured &&
      baseValues.currentRoundId > 0,
    queryFn: async () => {
      if (!publicClient || baseValues.currentRoundId <= 0) {
        return { entryCount: 0, participantCount: 0 };
      }

      const entryCountRaw = await publicClient.readContract({
        address: lotteryAddress,
        abi: lotteryAbi,
        functionName: "entryCount",
        args: [BigInt(baseValues.currentRoundId)],
      });

      const entryCount = Number(entryCountRaw);
      const scanCount = Math.min(entryCount, MAX_PARTICIPANT_SCAN);
      if (scanCount === 0) {
        return { entryCount, participantCount: 0 };
      }

      const entries = await Promise.all(
        Array.from({ length: scanCount }, (_, index) =>
          publicClient.readContract({
            address: lotteryAddress,
            abi: lotteryAbi,
            functionName: "entryAt",
            args: [BigInt(baseValues.currentRoundId), BigInt(index)],
          }),
        ),
      );

      const players = new Set(
        entries.map((entry) => String((entry as readonly unknown[])[0]).toLowerCase()),
      );

      return { entryCount, participantCount: players.size };
    },
    refetchInterval: 20_000,
  });

  const winnerHistoryQuery = useQuery({
    queryKey: [
      "lottery-winners",
      ORLANCE_DEPLOYMENT.chainId,
      lotteryAddress,
    ],
    enabled: Boolean(publicClient) && isConfigured,
    queryFn: async () => {
      if (!publicClient) return [] as WinnerHistoryItem[];

      const winnerEvent = parseAbiItem(
        "event WinnerDrawn(uint256 indexed roundId, address indexed winner, uint256 indexed maturity, uint256 winningTicket, uint256 prizeStEth)",
      );

      const logs = await publicClient.getLogs({
        address: lotteryAddress,
        event: winnerEvent,
        fromBlock: 0n,
        toBlock: "latest",
      });

      if (!logs.length) return [] as WinnerHistoryItem[];

      const sortedLogs = [...logs].sort((a, b) => {
        const aRound = asBigInt(a.args.roundId);
        const bRound = asBigInt(b.args.roundId);
        if (aRound === bRound) return 0;
        return bRound > aRound ? 1 : -1;
      });

      const topLogs = sortedLogs.slice(0, 8);
      const blockNumbers = Array.from(
        new Set(
          topLogs
            .map((log) => log.blockNumber?.toString())
            .filter((value): value is string => Boolean(value)),
        ),
      );

      const blockTimestamps = new Map<string, number>();
      await Promise.all(
        blockNumbers.map(async (blockNumber) => {
          const block = await publicClient.getBlock({
            blockNumber: BigInt(blockNumber),
          });
          blockTimestamps.set(blockNumber, Number(block.timestamp));
        }),
      );

      return topLogs.map((log) => {
        const blockNumber = log.blockNumber?.toString() ?? "0";
        const roundId = Number(asBigInt(log.args.roundId));
        const maturity = Number(asBigInt(log.args.maturity));
        const prizeRaw = asBigInt(log.args.prizeStEth);
        const winner = asAddress(log.args.winner);
        const txHash = log.transactionHash ?? "";

        return {
          roundId,
          maturity,
          winner,
          prizeStEth: toEtherNumber(prizeRaw),
          txHash,
          txUrl: txHash ? `${explorerBaseUrl}/tx/${txHash}` : "",
          timestamp: blockTimestamps.get(blockNumber) ?? 0,
        } satisfies WinnerHistoryItem;
      });
    },
    refetchInterval: 30_000,
  });

  const derived = useMemo(() => {
    const nowTs = Math.floor(Date.now() / 1000);
    const round = roundValues.round;

    const startAt = round.startAt;
    const endAt = round.endAt;
    const duration = Math.max(endAt - startAt, 1);
    const elapsed = Math.max(nowTs - startAt, 0);
    const progressPct = Math.min(Math.max((elapsed / duration) * 100, 0), 100);
    const secondsToDraw = Math.max(endAt - nowTs, 0);

    const totalDeposits = toEtherNumber(round.totalDeposits);
    const totalTickets = toEtherNumber(round.totalTickets);
    const myTickets = toEtherNumber(roundValues.myTickets);
    const mySharePct = totalTickets > 0 ? (myTickets / totalTickets) * 100 : 0;

    const pendingYield = toEtherNumber(roundValues.pendingYield);
    const liquidStEth = toEtherNumber(baseValues.lotteryLiquidStEth);
    const livePrizePoolStEth = liquidStEth + pendingYield;
    const potentialPrizeStEth = livePrizePoolStEth * (mySharePct / 100);

    const isRoundLive = !round.drawn && nowTs < endAt;
    const isOwner =
      isConnected &&
      address?.toLowerCase() === baseValues.owner.toLowerCase();

    return {
      nowTs,
      startAt,
      endAt,
      progressPct,
      secondsToDraw,
      totalDeposits,
      totalTickets,
      myTickets,
      mySharePct,
      pendingYield,
      livePrizePoolStEth,
      potentialPrizeStEth,
      isRoundLive,
      isOwner,
    };
  }, [address, baseValues, isConnected, roundValues]);

  return {
    isConnected,
    isConfigured,
    address,
    chainId: ORLANCE_DEPLOYMENT.chainId,
    lotteryAddress,
    isLoading:
      baseReads.isLoading || roundReads.isLoading || participantsQuery.isLoading,
    refetch: async () => {
      await Promise.all([
        baseReads.refetch(),
        roundReads.refetch(),
        participantsQuery.refetch(),
        winnerHistoryQuery.refetch(),
      ]);
    },
    balances: {
      walletStEth: baseValues.walletStEth,
      stEthAllowance: baseValues.stEthAllowance,
    },
    state: {
      owner: baseValues.owner,
      activeMaturity: baseValues.activeMaturity,
      currentRoundId: baseValues.currentRoundId,
      roundDuration: baseValues.roundDuration,
      canDrawCurrentRound: baseValues.canDrawCurrentRound,
      currentRound: roundValues.round,
      myTickets: roundValues.myTickets,
      pendingYield: roundValues.pendingYield,
      lotteryLiquidStEth: baseValues.lotteryLiquidStEth,
      participantCount: participantsQuery.data?.participantCount ?? 0,
      entryCount: participantsQuery.data?.entryCount ?? 0,
      winnerHistory: winnerHistoryQuery.data ?? [],
    },
    derived,
    formatted: {
      walletStEth: toFixedString(toEtherNumber(baseValues.walletStEth)),
      totalDeposits: toFixedString(derived.totalDeposits, 4),
      livePrizePool: toFixedString(derived.livePrizePoolStEth, 4),
      myTickets: toFixedString(derived.myTickets, 4),
      mySharePct: toFixedString(derived.mySharePct, 2),
      potentialPrize: toFixedString(derived.potentialPrizeStEth, 4),
      progressPct: toFixedString(derived.progressPct, 1),
    },
  };
}
