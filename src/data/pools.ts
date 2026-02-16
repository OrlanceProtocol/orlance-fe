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

export const pools: Pool[] = [
  {
    id: "lido-steth-dec2025",
    protocol: "Lido",
    asset: "ETH",
    underlyingAsset: "stETH",
    maturity: "29 December 2025",
    fixedAPR: 138.61,
    lpAPR: 2.04,
    tvl: "$177.02M",
    balance: "$0",
    ethAmount: 6.49,
    stEthAmount: 4.73,
    isHighAPR: true,
    principalTokens: 0,
    yieldTokens: 0,
    lpTokens: 0,
    principalStaked: 0,
    yieldStaked: 0,
    positionValueUSD: "$0",
  },
  {
    id: "lido-steth-mar2026",
    protocol: "Lido",
    asset: "ETH",
    underlyingAsset: "stETH",
    maturity: "31 March 2026",
    fixedAPR: 6.01,
    lpAPR: 5.62,
    tvl: "$25.55M",
    balance: "$0",
    ethAmount: 6.49,
    stEthAmount: 4.73,
    principalTokens: 0,
    yieldTokens: 0,
    lpTokens: 0,
    principalStaked: 0,
    yieldStaked: 0,
    positionValueUSD: "$0",
  },
  {
    id: "lido-steth-jun2026",
    protocol: "Lido",
    asset: "ETH",
    underlyingAsset: "stETH",
    maturity: "30 June 2026",
    fixedAPR: 4.66,
    lpAPR: 35.68,
    tvl: "$4.47M",
    balance: "$80.64k",
    ethAmount: 6.49,
    stEthAmount: 10.5,
    principalTokens: 19.3581,
    yieldTokens: 3.6428,
    lpTokens: 3.6243,
    principalStaked: 1.6608,
    yieldStaked: 38.6634,
    positionValueUSD: "$80,734.62",
  },
];

export function getPoolById(id: string): Pool | undefined {
  return pools.find((p) => p.id === id);
}
