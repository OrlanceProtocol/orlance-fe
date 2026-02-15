"use client";

import { useState } from "react";
import PoolRow, { type PoolRowData } from "./PoolRow";

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
    <>
      {/* Summary Row */}
      <tr
        className="border-t border-gray-200 bg-white hover:bg-gray-50/50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Asset */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className={`text-gray-500 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
            >
              <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{asset}</span>
            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">S</span>
            </span>
          </div>
        </td>

        {/* Protocol (empty for summary) */}
        <td className="py-4 px-4">
          <span className="w-6 h-6 rounded-full bg-orange-100 inline-flex items-center justify-center">
            <span className="text-orange-500 text-xs font-bold">L</span>
          </span>
        </td>

        {/* Maturity range */}
        <td className="py-4 px-4">
          <span className="text-sm text-gray-600">{maturityRange}</span>
        </td>

        {/* Fixed APR */}
        <td className="py-4 px-4">
          <span className="text-sm text-gray-600">
            Up to <span className="text-orange-500 font-semibold">{maxFixedAPR.toFixed(2)}%</span>
          </span>
        </td>

        {/* LP APR */}
        <td className="py-4 px-4">
          <span className="text-sm text-gray-600">
            Up to <span className="text-teal-600 font-semibold">{maxLpAPR.toFixed(2)}%</span>
          </span>
        </td>

        {/* TVL */}
        <td className="py-4 px-4">
          <span className="text-sm text-gray-700">{totalTVL}</span>
        </td>

        {/* Balance */}
        <td className="py-4 px-4">
          <span className="text-sm text-gray-700">{balance}</span>
        </td>

        {/* Available to Deposit */}
        <td className="py-4 px-4 text-right">
          <span className="text-sm font-medium text-gray-900">{availableToDeposit}</span>
        </td>
      </tr>

      {/* Expanded Pool Rows */}
      {expanded &&
        pools.map((pool, i) => <PoolRow key={i} pool={pool} />)}
    </>
  );
}
