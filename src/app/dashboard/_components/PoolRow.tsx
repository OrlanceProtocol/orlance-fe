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

function BarIcon({ level, color }: { level: "low" | "mid" | "high"; color: "teal" | "emerald" }) {
  const barHeights = [4, 7, 10, 13, 16];
  const activeBars = level === "high" ? 5 : level === "mid" ? 3 : 2;
  const activeColor = color === "teal" ? "#5eead4" : "#6ee7b7";
  const inactiveColor = color === "teal" ? "#1a3a3a" : "#1a3a2a";
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

function ArrowUpIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="inline-block ml-1">
      <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
    </svg>
  );
}

function TokenBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-base text-gray-300 font-medium">{name}</span>
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
    <span className="w-6 h-6 rounded-full bg-sky-900/50 flex items-center justify-center relative">
      <Image
        src="/icon/eth.png"
        alt="stETH"
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sky-400 border-2 border-[#151f2e]" />
    </span>
  );
}

export default function PoolRow({ pool }: { pool: PoolRowData }) {
  const lpLevel = pool.lpAPR > 20 ? "high" : pool.lpAPR > 5 ? "mid" : "low";
  const aprLevel = pool.fixedAPR > 50 ? "high" : pool.fixedAPR > 10 ? "mid" : "low";

  return (
    <div
      className="grid items-center rounded-xl border border-gray-700/30 bg-[#151f2e] py-5 hover:bg-[#1a2535] hover:border-gray-600/50 transition-all"
      style={{ gridTemplateColumns: GRID_COLS.join(" ") }}
    >
      {/* Manage button */}
      <div className="px-4">
        <Link href={`/dashboard/pool/${pool.id}`}>
          <button className="px-5 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-base font-medium rounded-lg border border-teal-500/30 transition-colors cursor-pointer">
            Manage
          </button>
        </Link>
      </div>

      {/* Protocol */}
      <div className="flex items-center gap-2.5 px-2">
        <Image
          src="/icon/LIDO.png"
          alt={pool.protocol}
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="text-base text-gray-300">{pool.protocol}</span>
      </div>

      {/* Maturity */}
      <div className="px-2 text-right">
        <span className="text-base text-gray-300">{pool.maturity}</span>
      </div>

      {/* TVL */}
      <div className="px-2 text-right">
        <span className="text-base text-gray-300">{pool.tvl}</span>
      </div>

      {/* Balance */}
      <div className="px-2 text-right">
        <span className="text-base text-gray-300">{pool.balance}</span>
      </div>

      {/* Available to Deposit (ETH + stETH) */}
      <div className="px-2">
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-300">{pool.ethAmount}</span>
            <TokenBadge name="ETH" icon={<EthIcon />} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-300">{pool.stEthAmount}</span>
            <TokenBadge name="stETH" icon={<StEthIcon />} />
          </div>
        </div>
      </div>

      {/* LP APR badge */}
      <div className="px-2 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-teal-600/30 to-teal-500/20 border border-teal-500/25">
          <BarIcon level={lpLevel} color="teal" />
          <span className="text-sm font-semibold text-teal-200">
            {pool.lpAPR.toFixed(2)}%
            <ArrowUpIcon />
          </span>
        </div>
      </div>

      {/* Fixed APR badge */}
      <div className="px-2 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 border border-emerald-500/25">
          <BarIcon level={aprLevel} color="emerald" />
          <span className="text-sm font-semibold text-emerald-200">
            {pool.fixedAPR.toFixed(2)}%
            <ArrowUpIcon />
          </span>
        </div>
      </div>
    </div>
  );
}
