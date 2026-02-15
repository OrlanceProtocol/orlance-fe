import Image from "next/image";

export interface PoolRowData {
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
  const heights = {
    low: [8, 5, 3],
    mid: [10, 7, 4],
    high: [12, 9, 6],
  };
  const h = heights[level];
  const color = level === "high" ? "text-orange-500" : "text-gray-400";
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" className={color}>
      <rect x="0" y={14 - h[2]} width="3" height={h[2]} rx="0.5" fill="currentColor" />
      <rect x="4.5" y={14 - h[1]} width="3" height={h[1]} rx="0.5" fill="currentColor" />
      <rect x="9" y={14 - h[0]} width="3" height={h[0]} rx="0.5" fill="currentColor" />
    </svg>
  );
}

function TokenBadge({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-700 font-medium">{name}</span>
      {icon}
    </div>
  );
}

function EthIcon() {
  return (
    <Image
      src="/icon/eth.png"
      alt="ETH"
      width={20}
      height={20}
      className="rounded-full"
    />
  );
}

function StEthIcon() {
  return (
    <span className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center relative">
      <Image
        src="/icon/eth.png"
        alt="stETH"
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 border border-white" />
    </span>
  );
}

export default function PoolRow({ pool }: { pool: PoolRowData }) {
  const aprLevel = pool.fixedAPR > 50 ? "high" : pool.fixedAPR > 10 ? "mid" : "low";
  const lpLevel = pool.lpAPR > 20 ? "high" : pool.lpAPR > 5 ? "mid" : "low";

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Manage button */}
      <td className="py-4 px-4">
        <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors">
          Manage
        </button>
      </td>

      {/* Protocol */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-500 text-xs font-bold">L</span>
          </span>
          <span className="text-sm text-gray-700">{pool.protocol}</span>
        </div>
      </td>

      {/* Maturity */}
      <td className="py-4 px-4">
        <span className="inline-block px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md border border-gray-200">
          {pool.maturity}
        </span>
      </td>

      {/* Fixed APR */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          <BarIcon level={aprLevel} />
          <span className={`text-sm font-medium ${pool.isHighAPR ? "text-orange-500" : "text-gray-700"}`}>
            {pool.fixedAPR.toFixed(2)}%
          </span>
        </div>
      </td>

      {/* LP APR */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          <BarIcon level={lpLevel} />
          <span className="text-sm text-gray-700 font-medium">
            {pool.lpAPR.toFixed(2)}%
          </span>
        </div>
      </td>

      {/* TVL */}
      <td className="py-4 px-4">
        <span className="text-sm text-gray-700">{pool.tvl}</span>
      </td>

      {/* Balance */}
      <td className="py-4 px-4">
        <span className="text-sm text-gray-700">{pool.balance}</span>
      </td>

      {/* Available to Deposit (ETH + stETH) */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-0.5 items-end">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-700">{pool.ethAmount}</span>
            <TokenBadge name="ETH" icon={<EthIcon />} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-700">{pool.stEthAmount}</span>
            <TokenBadge name="stETH" icon={<StEthIcon />} />
          </div>
        </div>
      </td>
    </tr>
  );
}
