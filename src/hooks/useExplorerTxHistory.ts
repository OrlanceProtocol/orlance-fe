"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";

type ExplorerTxRaw = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  input: string;
  isError?: string;
  functionName?: string;
  contractAddress?: string;
  tokenDecimal?: string;
  tokenSymbol?: string;
  value?: string;
};

type ExplorerResponse = {
  status: string;
  message: string;
  result: ExplorerTxRaw[] | string;
};

export type ExplorerTxItem = {
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  action: string;
  status: "success" | "failed";
  tokenSymbol?: string;
  tokenValue?: string;
  txUrl: string;
};

const explorerApiUrl =
  process.env.NEXT_PUBLIC_EXPLORER_API_URL || "https://api.etherscan.io/v2/api";
const explorerBaseUrl =
  process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || "https://sepolia.arbiscan.io";
const explorerApiKey =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ||
  process.env.NEXT_PUBLIC_ARBISCAN_API_KEY ||
  "";

function decodeAction(functionName: string | undefined, to: string): string {
  const name = (functionName || "").toLowerCase();
  const toLower = to.toLowerCase();

  if (name.includes("zapdeposit")) return "Deposit (Zap)";
  if (name.includes("deposit(")) return "Deposit";
  if (name.includes("zapredeem")) return "Redeem TPS";
  if (name.includes("claimyield")) return "Claim Yield";
  if (name.includes("drawwinner")) return "Draw Winner";
  if (name.includes("rollover(")) return "Roll Over";
  if (name.includes("swap(")) return "Swap";
  if (name.includes("addliquidity")) return "Add Liquidity";
  if (name.includes("removeliquidity")) return "Remove Liquidity";

  if (toLower === ORLANCE_DEPLOYMENT.addresses.router.toLowerCase()) return "Router Call";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.vault.toLowerCase()) return "Vault Call";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.amm.toLowerCase()) return "AMM Call";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.autoRoller.toLowerCase())
    return "Auto-Roller Call";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.lottery.toLowerCase())
    return "Lottery Call";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.tps.toLowerCase()) return "TPS Transfer";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.tys.toLowerCase()) return "TYS Transfer";
  if (toLower === ORLANCE_DEPLOYMENT.addresses.stEth.toLowerCase()) return "stETH Transfer";
  return "Contract Interaction";
}

async function fetchExplorer(
  action: "txlist" | "tokentx",
  address: string,
): Promise<ExplorerTxRaw[]> {
  if (!explorerApiKey) {
    return [];
  }

  const searchParams = new URLSearchParams({
    chainid: String(ORLANCE_DEPLOYMENT.chainId),
    module: "account",
    action,
    address,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "100",
    sort: "desc",
    apikey: explorerApiKey,
  });

  const response = await fetch(`${explorerApiUrl}?${searchParams.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Explorer request failed (${response.status})`);
  }

  const data = (await response.json()) as ExplorerResponse;
  if (!Array.isArray(data.result)) {
    return [];
  }
  return data.result;
}

export function useExplorerTxHistory() {
  const { address } = useAccount();
  const isConfigured = Boolean(explorerApiKey);

  const protocolAddresses = useMemo(
    () =>
      new Set(
        Object.values(ORLANCE_DEPLOYMENT.addresses).map((value) => value.toLowerCase()),
      ),
    [],
  );

  const txQuery = useQuery({
    queryKey: ["explorer-history", address, ORLANCE_DEPLOYMENT.chainId],
    enabled: Boolean(address) && isConfigured,
    queryFn: async () => {
      if (!address) return [] as ExplorerTxItem[];

      const [normalTxs, tokenTxs] = await Promise.all([
        fetchExplorer("txlist", address),
        fetchExplorer("tokentx", address),
      ]);

      const merged = [...normalTxs, ...tokenTxs];
      const dedupMap = new Map<string, ExplorerTxRaw>();
      for (const tx of merged) {
        if (!tx.hash) continue;
        if (!dedupMap.has(tx.hash)) dedupMap.set(tx.hash, tx);
      }

      const filtered = Array.from(dedupMap.values()).filter((tx) => {
        const to = (tx.to || "").toLowerCase();
        const from = (tx.from || "").toLowerCase();
        const contractAddress = (tx.contractAddress || "").toLowerCase();
        return (
          protocolAddresses.has(to) ||
          protocolAddresses.has(from) ||
          protocolAddresses.has(contractAddress)
        );
      });

      filtered.sort((a, b) => Number(b.timeStamp || 0) - Number(a.timeStamp || 0));

      return filtered.slice(0, 30).map((tx) => {
        const to = tx.to || "";
        const isFailed = tx.isError === "1";
        const decimals = Number(tx.tokenDecimal || "18");
        const rawValue = BigInt(tx.value || "0");
        const tokenValue = Number.isFinite(decimals)
          ? Number(formatUnits(rawValue, Math.max(0, decimals))).toFixed(4)
          : undefined;

        return {
          hash: tx.hash,
          timestamp: Number(tx.timeStamp || 0),
          from: tx.from || "",
          to,
          action: decodeAction(tx.functionName, to),
          status: isFailed ? "failed" : "success",
          tokenSymbol: tx.tokenSymbol,
          tokenValue,
          txUrl: `${explorerBaseUrl}/tx/${tx.hash}`,
        } as ExplorerTxItem;
      });
    },
    refetchInterval: 30_000,
  });

  return {
    ...txQuery,
    isConfigured,
  };
}
