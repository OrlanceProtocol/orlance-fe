"use client";

import Link from "next/link";
import Image from "next/image";
import type { Pool } from "@/data/pools";

interface PoolInfoBarProps {
  pool: Pool;
  advanced: boolean;
  onToggleAdvanced: () => void;
}

export default function PoolInfoBar({
  pool,
  advanced,
  onToggleAdvanced,
}: PoolInfoBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 10H5M5 10L10 5M5 10L10 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Image
            src="/icon/eth.png"
            alt="ETH"
            width={28}
            height={28}
            className="rounded-full"
          />

          <span className="text-lg font-semibold text-gray-900">
            {pool.asset} via {pool.protocol}
          </span>

          <span className="text-base text-gray-500">-</span>

          <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md border border-gray-200">
            Matures on {pool.maturity}
          </span>
        </div>

        <button
          onClick={onToggleAdvanced}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <span
            className={`w-8 h-4 rounded-full relative transition-colors ${
              advanced ? "bg-orange-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                advanced ? "left-[18px]" : "left-0.5"
              }`}
            />
          </span>
          Advanced
        </button>
      </div>

      {advanced && (
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
          <span className="font-semibold text-gray-700">Fees:</span>
          <span>Deposit 0%</span>
          <span>Redemption 0%</span>
          <span>Early Redemption 0%</span>
          <span>Swap 1%</span>
        </div>
      )}
    </div>
  );
}
