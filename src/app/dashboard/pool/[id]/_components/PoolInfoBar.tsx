import Link from "next/link";
import Image from "next/image";
import type { Pool } from "@/data/pools";

export default function PoolInfoBar({ pool }: { pool: Pool }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-900 px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Image src="/icon/eth.png" alt="ETH" width={28} height={28} className="rounded-full" />

        <span className="text-lg font-semibold text-gray-900">
          {pool.asset} via {pool.protocol}
        </span>

        <span className="text-base text-gray-500">-</span>

        <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md border border-gray-200">
          Matures on {pool.maturity}
        </span>
      </div>

      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <span className="w-8 h-4 bg-gray-200 rounded-full relative">
          <span className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
        </span>
        Advanced
      </button>
    </div>
  );
}
