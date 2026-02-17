"use client";

import PoolSummaryRow from "./PoolSummaryRow";
import { pools } from "@/data/pools";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";

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

export const GRID_COLS = COLUMNS.map((column) => column.width);

export default function PoolTable() {
  const pool = pools[0];
  const onchain = useOrlancePoolData();
  const walletPositionStEth = Number(onchain.formatted.positionStEth) || 0;
  const availableDepositStEth =
    (Number(onchain.formatted.eth) || 0) + (Number(onchain.formatted.stEth) || 0);

  const stEthPoolRow = {
    id: pool.id,
    protocol: pool.protocol,
    maturity: pool.maturity,
    fixedAPR: Number(onchain.formatted.fixedApr),
    lpAPR: Number(onchain.formatted.lpApr),
    tvl: `${Number(onchain.formatted.tvlStEth).toFixed(2)} stETH`,
    balance: onchain.isConnected ? `${walletPositionStEth.toFixed(4)} stETH` : "Connect wallet",
    ethAmount: Number(onchain.formatted.eth),
    stEthAmount: Number(onchain.formatted.stEth),
    isHighAPR: pool.isHighAPR,
  };

  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-800 backdrop-blur-sm flex-1">
      <div className="flex items-center justify-between px-8 pt-5 pb-4">
        <h2 className="text-xl font-semibold text-white">Available Pools</h2>
        <button className="flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors">
          {onchain.isLoading ? "Syncing..." : "Live"}
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h12M3 7h8M5 11h4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="mx-6 border-t border-gray-700" />

      <div
        className="grid border-b border-gray-800 px-6"
        style={{ gridTemplateColumns: GRID_COLS.join(" ") }}
      >
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className="py-4 px-2 text-sm font-medium text-gray-500 tracking-wide text-center"
          >
            {column.label}
          </div>
        ))}
      </div>

      <div className="px-6 py-4">
        <PoolSummaryRow
          asset="ETH"
          maturityRange={pool.maturity}
          maxFixedAPR={Number(onchain.formatted.fixedApr)}
          maxLpAPR={Number(onchain.formatted.lpApr)}
          totalTVL={`${Number(onchain.formatted.tvlStEth).toFixed(2)} stETH`}
          balance={onchain.isConnected ? `${walletPositionStEth.toFixed(4)} stETH` : "0 stETH"}
          availableToDeposit={`${availableDepositStEth.toFixed(4)} stETH`}
          pools={[stEthPoolRow]}
        />
      </div>
    </div>
  );
}
