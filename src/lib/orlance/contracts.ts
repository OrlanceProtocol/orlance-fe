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

export const ORLANCE_DEPLOYMENT = {
  chainId: getNumberFromEnv(process.env.NEXT_PUBLIC_CHAIN_ID, 421614),
  maturityTimestamp: getNumberFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MATURITY_TIMESTAMP, 0),
  poolName: process.env.NEXT_PUBLIC_ORLANCE_POOL_NAME || "Orlance stETH 1Y",
  addresses: {
    stEth: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_MOCK_LIDO),
    vault: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_VAULT),
    router: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_ROUTER),
    tps: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TPS),
    tys: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_TYS),
    amm: getAddressFromEnv(process.env.NEXT_PUBLIC_ORLANCE_SIMPLE_AMM),
    autoRollerVault: getAddressFromEnv(
      process.env.NEXT_PUBLIC_ORLANCE_AUTO_ROLLER_VAULT,
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

export const autoRollerVaultAbi = [
  ...erc20Abi,
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "deposit",
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "withdraw",
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
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
