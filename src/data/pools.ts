import { ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";

export interface Pool {
  id: string;
  protocol: string;
  asset: string;
  underlyingAsset: string;
  maturity: string;
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

export const primaryPoolId = `arb-sepolia-${ORLANCE_DEPLOYMENT.maturityTimestamp || "pool"}`;

export const pools: Pool[] = [
  {
    id: primaryPoolId,
    protocol: "Lido",
    asset: "ETH",
    underlyingAsset: "stETH",
    maturity: formatMaturity(ORLANCE_DEPLOYMENT.maturityTimestamp),
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
  },
];

export function getPoolById(id: string): Pool | undefined {
  return pools.find((pool) => pool.id === id);
}

