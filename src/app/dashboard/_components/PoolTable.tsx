import PoolSummaryRow from "./PoolSummaryRow";
import type { PoolRowData } from "./PoolRow";

const stETHPools: PoolRowData[] = [
  {
    protocol: "Lido",
    maturity: "29 December 2025",
    fixedAPR: 138.61,
    lpAPR: 2.04,
    tvl: "$177.02M",
    balance: "$0",
    ethAmount: 6.49,
    stEthAmount: 4.73,
    isHighAPR: true,
  },
  {
    protocol: "Lido",
    maturity: "31 March 2026",
    fixedAPR: 6.01,
    lpAPR: 5.62,
    tvl: "$25.55M",
    balance: "$0",
    ethAmount: 6.49,
    stEthAmount: 4.73,
  },
  {
    protocol: "Lido",
    maturity: "30 June 2026",
    fixedAPR: 4.66,
    lpAPR: 35.68,
    tvl: "$4.47M",
    balance: "$80.64k",
    ethAmount: 6.49,
    stEthAmount: 10.5,
  },
];

const COLUMNS = [
  "Asset",
  "Protocol",
  "Maturity",
  "Fixed APR",
  "LP APR",
  "TVL",
  "Balance",
  "Available to Deposit",
];

export default function PoolTable() {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Available Pools</h2>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Filter
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h12M3 7h8M5 11h4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <PoolSummaryRow
              asset="stETH"
              maturityRange="Dec 2025 - Jun 2026"
              maxFixedAPR={138.61}
              maxLpAPR={35.68}
              totalTVL="$207.05M"
              balance="$80.64k"
              availableToDeposit="$42.79k"
              pools={stETHPools}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
