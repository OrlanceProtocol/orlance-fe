import { type Address, isAddress } from "viem";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;

function getAddressFromEnv(envValue: string | undefined): Address {
  if (envValue && isAddress(envValue)) {
    return envValue as Address;
  }
  return ZERO_ADDRESS;
}

function getNumberFromEnv(envValue: string | undefined, fallback: number): number {
  if (!envValue) return fallback;
  const parsed = Number(envValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export interface OrlancePoolDeployment {
  index: number;
  poolName: string;
  maturityTimestamp: number;
  addresses: {
    tps: Address;
    tys: Address;
    amm: Address;
  };
}

const chainId = getNumberFromEnv(process.env.NEXT_PUBLIC_CHAIN_ID, 421614);
const primaryPoolName = process.env.NEXT_PUBLIC_ORLANCE_POOL_NAME || "Orlance stETH 1M";
const primaryMaturityTimestamp = getNumberFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP, 0);
const primaryTpsAddress = getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TPS);
const primaryTysAddress = getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TYS);
const primaryAmmAddress = getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM);

const pool1: OrlancePoolDeployment = {
  index: 1,
  poolName: process.env.NEXT_PUBLIC_ORLANCE_POOL_NAME_1 || primaryPoolName,
  maturityTimestamp: getNumberFromEnv(
    process.env.NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_1,
    primaryMaturityTimestamp,
  ),
  addresses: {
    tps: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TPS_1 || process.env.NEXT_PUBLIC_ORLANCE_TPS),
    tys: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TYS_1 || process.env.NEXT_PUBLIC_ORLANCE_TYS),
    amm: getAddressFromEnv(
      process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_1 || process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM,
    ),
  },
};

const pool2: OrlancePoolDeployment = {
  index: 2,
  poolName: process.env.NEXT_PUBLIC_ORLANCE_POOL_NAME_2 || "Orlance stETH 2M",
  maturityTimestamp: getNumberFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_2, 0),
  addresses: {
    tps: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TPS_2),
    tys: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TYS_2),
    amm: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_2),
  },
};

const pool3: OrlancePoolDeployment = {
  index: 3,
  poolName: process.env.NEXT_PUBLIC_ORLANCE_POOL_NAME_3 || "Orlance stETH 3M",
  maturityTimestamp: getNumberFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP_3, 0),
  addresses: {
    tps: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TPS_3),
    tys: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TYS_3),
    amm: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM_3),
  },
};

const configuredPools = [pool1, pool2, pool3].filter((pool) => pool.maturityTimestamp > 0);

const fallbackPrimaryPool: OrlancePoolDeployment = {
  index: 1,
  poolName: primaryPoolName,
  maturityTimestamp: primaryMaturityTimestamp,
  addresses: {
    tps: primaryTpsAddress,
    tys: primaryTysAddress,
    amm: primaryAmmAddress,
  },
};

export const ORLANCE_POOLS: OrlancePoolDeployment[] =
  configuredPools.length > 0 ? configuredPools : [fallbackPrimaryPool];

const activePool = ORLANCE_POOLS[0];

export const ORLANCE_DEPLOYMENT = {
  chainId,
  maturityTimestamp: activePool.maturityTimestamp,
  poolName: activePool.poolName,
  addresses: {
    stEth: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MOCK_LIDO),
    vault: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_VAULT),
    router: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_ROUTER),
    tps: activePool.addresses.tps,
    tys: activePool.addresses.tys,
    amm: activePool.addresses.amm,
    autoRoller: getAddressFromEnv(
      process.env.NEXT_PUBLIC_ORLANCE_AUTO_ROLLER ||
        process.env.NEXT_PUBLIC_ORLANCE_AUTO_ROLLER_VAULT,
    ),
    lottery: getAddressFromEnv(
      process.env.NEXT_PUBLIC_ORLANCE_LOTTERY ||
        process.env.NEXT_PUBLIC_ORLANCE_NO_LOSS_LOTTERY,
    ),
  },
} as const;

export const erc20Abi = [
  {
    type: "function",
    stateMutability: "view",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const vaultAbi = [
  {
    type: "function",
    stateMutability: "view",
    name: "storedBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "pendingYield",
    inputs: [
      { name: "maturity", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "deposit",
    inputs: [
      { name: "maturity", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "claimYield",
    inputs: [{ name: "maturity", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "pools",
    inputs: [{ name: "maturity", type: "uint256" }],
    outputs: [
      { name: "tps", type: "address" },
      { name: "tys", type: "address" },
      { name: "globalIndex", type: "uint256" },
      { name: "exists", type: "bool" },
    ],
  },
] as const;

export const routerAbi = [
  {
    type: "function",
    stateMutability: "payable",
    name: "zapDeposit",
    inputs: [{ name: "maturity", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "zapRedeem",
    inputs: [
      { name: "maturity", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const mockLidoAbi = [
  ...erc20Abi,
  {
    type: "function",
    stateMutability: "payable",
    name: "submit",
    inputs: [{ name: "_referral", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "faucet",
    inputs: [{ name: "_amount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const ammAbi = [
  ...erc20Abi,
  {
    type: "function",
    stateMutability: "view",
    name: "reserve0",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "reserve1",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getAmountOut",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "swap",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "addLiquidity",
    inputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
    outputs: [{ name: "lpMinted", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "removeLiquidity",
    inputs: [{ name: "lpAmount", type: "uint256" }],
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
  },
] as const;

export const autoRollerAbi = [
  ...erc20Abi,
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "withdraw",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "rollOver",
    inputs: [{ name: "newMaturity", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "totalAssets",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "nextRollOver",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "convertToAssets",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ name: "assets", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "convertToShares",
    inputs: [{ name: "assets", type: "uint256" }],
    outputs: [{ name: "shares", type: "uint256" }],
  },
] as const;

export const autoRollerVaultAbi = autoRollerAbi;

export const lotteryAbi = [
  {
    type: "function",
    stateMutability: "view",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "activeMaturity",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "currentRoundId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "roundDuration",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "canDrawCurrentRound",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "rounds",
    inputs: [{ name: "roundId", type: "uint256" }],
    outputs: [
      { name: "startAt", type: "uint64" },
      { name: "endAt", type: "uint64" },
      { name: "drawnAt", type: "uint64" },
      { name: "maturity", type: "uint256" },
      { name: "totalDeposits", type: "uint256" },
      { name: "totalTickets", type: "uint256" },
      { name: "prizeStEth", type: "uint256" },
      { name: "winner", type: "address" },
      { name: "drawn", type: "bool" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "userTickets",
    inputs: [
      { name: "roundId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "entryCount",
    inputs: [{ name: "roundId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "entryAt",
    inputs: [
      { name: "roundId", type: "uint256" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      { name: "player", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "upperBound", type: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "drawWinner",
    inputs: [{ name: "randomSeed", type: "bytes32" }],
    outputs: [],
  },
] as const;
