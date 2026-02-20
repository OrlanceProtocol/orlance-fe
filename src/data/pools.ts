import type { Address } from "viem";
import { ORLANCE_DEPLOYMENT, ORLANCE_POOLS } from "@/lib/orlance/contracts";

export interface Pool {
  id: string;
  name: string;
  protocol: string;
  asset: string;
  underlyingAsset: string;
  maturityTimestamp: number;
  maturity: string;
  addresses: {
    tps: Address;
    tys: Address;
    amm: Address;
  };
  fixedAPR: number;
  lpAPR: number;
  tvl: string;
  balance: string;
  ethAmount: number;
  stEthAmount: number;
  isHighAPR?: boolean;
  principalTokens: number;
  yieldTokens: number;
  lpTokens: number;
  principalStaked: number;
  yieldStaked: number;
  positionValueUSD: string;
}

function formatMaturity(timestamp: number): string {
  if (!timestamp) return "TBD";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const pools: Pool[] = ORLANCE_POOLS.map((deploymentPool) => ({
  id: `arb-sepolia-${deploymentPool.index}-${deploymentPool.maturityTimestamp || "pool"}`,
  name: deploymentPool.poolName,
  protocol: "Lido",
  asset: "ETH",
  underlyingAsset: "stETH",
  maturityTimestamp: deploymentPool.maturityTimestamp,
  maturity: formatMaturity(deploymentPool.maturityTimestamp),
  addresses: {
    tps: deploymentPool.addresses.tps,
    tys: deploymentPool.addresses.tys,
    amm: deploymentPool.addresses.amm,
  },
  fixedAPR: 0,
  lpAPR: 0,
  tvl: "$0",
  balance: "$0",
  ethAmount: 0,
  stEthAmount: 0,
  isHighAPR: false,
  principalTokens: 0,
  yieldTokens: 0,
  lpTokens: 0,
  principalStaked: 0,
  yieldStaked: 0,
  positionValueUSD: "$0",
}));

export const primaryPoolId =
  pools[0]?.id ?? `arb-sepolia-${ORLANCE_DEPLOYMENT.maturityTimestamp || "pool"}`;

export function getPoolById(id: string): Pool | undefined {
  return pools.find((pool) => pool.id === id);
}
