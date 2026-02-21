"use client";

import Image from "next/image";
import Link from "next/link";
import type { PoolRowData } from "./PoolRow";

function getDaysLeft(maturityTimestamp?: number): number | null {
  if (!maturityTimestamp) return null;
  const now = Math.floor(Date.now() / 1000);
  const diff = maturityTimestamp - now;
  return diff > 0 ? Math.floor(diff / 86400) : 0;
}

export default function PoolMobileCard({ pool }: { pool: PoolRowData }) {
  const daysLeft = getDaysLeft(pool.maturityTimestamp);

  return (
    <div className="bg-[#1a2332] border border-gray-700/50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Image
            src="/icon/eth.png"
            alt="ETH"
            width={38}
            height={38}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-base">stETH</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-500"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-gray-500 text-xs">{pool.protocol}</span>
            </div>
          </div>
        </div>
        <Image
          src="/icon/LIDO.png"
          alt={pool.protocol}
          width={24}
          height={24}
          className="rounded-full opacity-80"
        />
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Maturity</span>
          <span className="text-gray-200 text-sm font-medium">
            {pool.maturity}
            {daysLeft !== null && (
              <span className="text-gray-500 text-xs ml-1">({daysLeft} days)</span>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">TVL</span>
          <span className="text-gray-200 text-sm font-medium">{pool.tvl}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Balance</span>
          <span className="text-gray-200 text-sm font-medium">{pool.balance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">LP APR</span>
          <span className="text-teal-400 text-sm font-semibold">
            {pool.lpAPR.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700/40 my-3" />

      {/* YT / PT rows */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between bg-[#111827]/80 rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 bg-teal-500/20 border border-teal-500/30 rounded px-1.5 py-0.5 leading-tight">
              YT
            </span>
            <span className="text-sm text-gray-400">LP APR</span>
          </div>
          <span className="text-sm font-semibold text-teal-300">
            {pool.lpAPR.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center justify-between bg-[#111827]/80 rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded px-1.5 py-0.5 leading-tight">
              PT
            </span>
            <span className="text-sm text-gray-400">Fixed APR</span>
          </div>
          <span className="text-sm font-semibold text-emerald-300">
            {pool.fixedAPR.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Manage button */}
      <Link href={`/dashboard/pool/${pool.id}`}>
        <button className="w-full py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-sm font-medium rounded-lg border border-teal-500/30 transition-colors cursor-pointer">
          Manage
        </button>
      </Link>
    </div>
  );
}
