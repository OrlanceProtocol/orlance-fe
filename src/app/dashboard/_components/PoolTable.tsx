import PoolSummaryRow from "./PoolSummaryRow";
import { pools } from "@/data/pools";

const COLUMNS = [
  { label: "Asset", width: "12%" },
  { label: "Protocol", width: "10%" },
  { label: "Maturity", width: "14%" },
  { label: "TVL", width: "10%" },
  { label: "Balance", width: "10%" },
  { label: "Available to Deposit", width: "16%" },
  { label: "LP APR", width: "14%" },
  { label: "Fixed APR", width: "14%" },
];

export const GRID_COLS = COLUMNS.map((c) => c.width);

const stETHPools = pools.map((p) => ({
  id: p.id,
  protocol: p.protocol,
  maturity: p.maturity,
  fixedAPR: p.fixedAPR,
  lpAPR: p.lpAPR,
  tvl: p.tvl,
  balance: p.balance,
  ethAmount: p.ethAmount,
  stEthAmount: p.stEthAmount,
  isHighAPR: p.isHighAPR,
}));

export default function PoolTable() {
  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-800 backdrop-blur-sm flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-5 pb-4">
        <h2 className="text-xl font-semibold text-white">Available Pools</h2>
        <button className="flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors">
          Filter
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h12M3 7h8M5 11h4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mx-6 border-t border-gray-700" />

      {/* Column Headers */}
      <div
        className="grid border-b border-gray-800 px-6"
        style={{ gridTemplateColumns: GRID_COLS.join(" ") }}
      >
        {COLUMNS.map((col) => (
          <div
            key={col.label}
            className="py-4 px-2 text-sm font-medium text-gray-500 tracking-wide text-center"
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Pool Content */}
      <div className="px-6 py-4">
        <PoolSummaryRow
          asset="ETH"
          maturityRange="Dec 2025 - Jun 2026"
          maxFixedAPR={138.61}
          maxLpAPR={35.68}
          totalTVL="$207.05M"
          balance="$80.64k"
          availableToDeposit="$42.79k"
          pools={stETHPools}
        />
      </div>
    </div>
  );
}
