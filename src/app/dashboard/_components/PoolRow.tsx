import Image from "next/image";
import Link from "next/link";
import { GRID_COLS } from "./PoolTable";

export interface PoolRowData {
  id: string;
  protocol: string;
  maturity: string;
  fixedAPR: number;
  lpAPR: number;
  tvl: string;
  balance: string;
  ethAmount: number;
  stEthAmount: number;
  isHighAPR?: boolean;
}

function BarIcon({ level }: { level: "low" | "mid" | "high" }) {
  const barHeights = [4, 7, 10, 13, 16];
  const activeBars = level === "high" ? 5 : level === "mid" ? 3 : 2;
  const activeColor = level === "high" ? "#f97316" : level === "mid" ? "#f97316" : "#9ca3af";
  const inactiveColor = "#d1d5db";
  return (
    <svg width="20" height="16" viewBox="0 0 20 16">
      {barHeights.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={16 - h}
          width="3"
          height={h}
          rx="0.5"
          fill={i < activeBars ? activeColor : inactiveColor}
        />
      ))}
    </svg>
  );
}

function TokenBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-base text-gray-700 font-medium">{name}</span>
      {icon}
    </div>
  );
}

function EthIcon() {
  return (
    <Image
      src="/icon/eth.png"
      alt="ETH"
      width={24}
      height={24}
      className="rounded-full"
    />
  );
}

function StEthIcon() {
  return (
    <span className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center relative">
      <Image
        src="/icon/eth.png"
        alt="stETH"
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
    </span>
  );
}

export default function PoolRow({ pool }: { pool: PoolRowData }) {
  const aprLevel = pool.fixedAPR > 50 ? "high" : pool.fixedAPR > 10 ? "mid" : "low";
  const lpLevel = pool.lpAPR > 20 ? "high" : pool.lpAPR > 5 ? "mid" : "low";

  return (
    <div
      className="grid items-center rounded-md border border-gray-200 bg-white py-5 shadow-sm hover:shadow-md transition-shadow"
      style={{ gridTemplateColumns: GRID_COLS.join(" ") }}
    >
      {/* Manage button */}
      <div className="px-4">
        <Link href={`/dashboard/pool/${pool.id}`}>
          <button className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-base font-medium rounded-md transition-colors cursor-pointer">
            Manage
          </button>
        </Link>
      </div>

      {/* Protocol */}
      <div className="flex items-center gap-2.5 px-2">
        <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-orange-500 text-sm font-bold">L</span>
        </span>
        <span className="text-base text-gray-700">{pool.protocol}</span>
      </div>

      {/* Maturity */}
      <div className="px-2">
        <span className="inline-block px-4 py-1.5 text-base text-gray-700 bg-gray-100 rounded-md border border-gray-200">
          {pool.maturity}
        </span>
      </div>

      {/* Fixed APR */}
      <div className="flex items-center gap-2 px-2">
        <BarIcon level={aprLevel} />
        <span className="text-base font-medium text-gray-700">
          {pool.fixedAPR.toFixed(2)}%
        </span>
      </div>

      {/* LP APR */}
      <div className="flex items-center gap-2 px-2">
        <BarIcon level={lpLevel} />
        <span className="text-base text-gray-700 font-medium">
          {pool.lpAPR.toFixed(2)}%
        </span>
      </div>

      {/* TVL */}
      <div className="px-2">
        <span className="text-base text-gray-700">{pool.tvl}</span>
      </div>

      {/* Balance */}
      <div className="px-2">
        <span className="text-base text-gray-700">{pool.balance}</span>
      </div>

      {/* Available to Deposit (ETH + stETH) */}
      <div className="px-2">
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-700">{pool.ethAmount}</span>
            <TokenBadge name="ETH" icon={<EthIcon />} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-700">{pool.stEthAmount}</span>
            <TokenBadge name="stETH" icon={<StEthIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
}
