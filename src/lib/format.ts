import { formatEther } from "viem";

type ReadResult = readonly unknown[] | undefined;

export function safeBigInt(readResult: ReadResult, index: number): bigint {
  const value = readResult?.[index];
  return typeof value === "bigint" ? value : 0n;
}

export function toEtherNumber(value: bigint): number {
  return Number(formatEther(value));
}

export function toFixedString(value: number, fractionDigits = 4): string {
  return Number.isFinite(value) ? value.toFixed(fractionDigits) : "0.0000";
}

export function clampApr(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(Math.min(value, 9999), -9999);
}
