"use client";

import { useState } from "react";
import Image from "next/image";
import PoolRow, { type PoolRowData } from "./PoolRow";
import { GRID_COLS } from "./PoolTable";

interface PoolSummaryProps {
  asset: string;
  maturityRange: string;
  maxFixedAPR: number;
  maxLpAPR: number;
  totalTVL: string;
  balance: string;
  availableToDeposit: string;
  pools: PoolRowData[];
}

export default function PoolSummaryRow({
  asset,
  maturityRange,
  maxFixedAPR,
  maxLpAPR,
  totalTVL,
  balance,
  availableToDeposit,
  pools,
}: PoolSummaryProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      {/* Summary Row */}
      <div
        className="grid items-center cursor-pointer rounded-md border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow py-5 min-h-[88px]"
        style={{ gridTemplateColumns: GRID_COLS.join(" ") }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Asset */}
        <div className="flex items-center gap-3 px-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            className={`text-gray-500 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
          >
            <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="text-base font-semibold text-gray-900">{asset}</span>
          <Image
            src="/icon/eth.png"
            alt="ETH"
            width={28}
            height={28}
            className="rounded-full"
          />
        </div>

        {/* Protocol */}
        <div className="px-2">
          <span className="w-7 h-7 rounded-full bg-orange-100 inline-flex items-center justify-center">
            <span className="text-orange-500 text-sm font-bold">L</span>
          </span>
        </div>

        {/* Maturity range */}
        <div className="px-2">
          <span className="text-base text-gray-600">{maturityRange}</span>
        </div>

        {/* Fixed APR */}
        <div className="px-2">
          <span className="text-base text-gray-600">
            Up to <span className="text-orange-500 font-semibold">{maxFixedAPR.toFixed(2)}%</span>
          </span>
        </div>

        {/* LP APR */}
        <div className="px-2">
          <span className="text-base text-gray-600">
            Up to <span className="text-teal-600 font-semibold">{maxLpAPR.toFixed(2)}%</span>
          </span>
        </div>

        {/* TVL */}
        <div className="px-2">
          <span className="text-base text-gray-700">{totalTVL}</span>
        </div>

        {/* Balance */}
        <div className="px-2">
          <span className="text-base text-gray-700">{balance}</span>
        </div>

        {/* Available to Deposit */}
        <div className="px-2 text-right">
          <span className="text-base font-medium text-gray-900">{availableToDeposit}</span>
        </div>
      </div>

      {/* Expanded Pool Rows */}
      {expanded && (
        <div className="flex flex-col gap-3 mt-2">
          {pools.map((pool, i) => (
            <PoolRow key={i} pool={pool} />
          ))}
        </div>
      )}
    </div>
  );
}
