"use client";

import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import PoolSummaryRow from "./PoolSummaryRow";
import { pools } from "@/data/pools";
import { useOrlancePoolData } from "@/hooks/useOrlancePoolData";
import { mockLidoAbi, ORLANCE_DEPLOYMENT } from "@/lib/orlance/contracts";
import { toEtherNumber } from "@/lib/format";

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
  const pool1 = pools[0];
  const pool2 = pools[1];
  const pool3 = pools[2];
  const { address } = useAccount();
  const faucetWrite = useWriteContract();
  const faucetReceipt = useWaitForTransactionReceipt({ hash: faucetWrite.data });
  const pool1Data = useOrlancePoolData(
    pool1
      ? {
          maturityTimestamp: pool1.maturityTimestamp,
          addresses: {
            tps: pool1.addresses.tps,
            tys: pool1.addresses.tys,
            amm: pool1.addresses.amm,
          },
        }
      : undefined,
  );
  const pool2Data = useOrlancePoolData(
    pool2
      ? {
          maturityTimestamp: pool2.maturityTimestamp,
          addresses: {
            tps: pool2.addresses.tps,
            tys: pool2.addresses.tys,
            amm: pool2.addresses.amm,
          },
        }
      : undefined,
  );
  const pool3Data = useOrlancePoolData(
    pool3
      ? {
          maturityTimestamp: pool3.maturityTimestamp,
          addresses: {
            tps: pool3.addresses.tps,
            tys: pool3.addresses.tys,
            amm: pool3.addresses.amm,
          },
        }
      : undefined,
  );

  const poolDataByIndex = [pool1Data, pool2Data, pool3Data] as const;
  const primaryData = poolDataByIndex[0];
  const availableDepositEth = Number(primaryData.formatted.eth) || 0;
  const availableDepositStEth = Number(primaryData.formatted.stEth) || 0;

  const handleClaimFaucet = async () => {
    if (!address) return;
    await faucetWrite.writeContractAsync({
      abi: mockLidoAbi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "faucet",
      args: [parseEther("0.1")],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
    await Promise.all(poolDataByIndex.map((data) => data.refetch()));
  };

  const poolMetrics = pools.map((pool, index) => {
    const poolData = poolDataByIndex[index] ?? primaryData;
    const rowTvlStEth = toEtherNumber(poolData.pool.totalSupplyTps);
    const rowPositionStEth = poolData.derived.positionStEth;

    return {
      tvlStEth: rowTvlStEth,
      positionStEth: rowPositionStEth,
      row: {
        id: pool.id,
        protocol: pool.protocol,
        maturity: pool.maturity,
        fixedAPR: Number(poolData.formatted.fixedApr) || 0,
        lpAPR: Number(poolData.formatted.lpApr) || 0,
        tvl: `${rowTvlStEth.toFixed(2)} stETH`,
        balance: poolData.isConnected ? `${rowPositionStEth.toFixed(4)} stETH` : "Connect wallet",
        ethAmount: Number(poolData.formatted.eth) || 0,
        stEthAmount: Number(poolData.formatted.stEth) || 0,
        isHighAPR: pool.isHighAPR,
      },
    };
  });

  const stEthPoolRows = poolMetrics.map((metric) => metric.row);
  const totalTvlStEth = poolMetrics.reduce((acc, metric) => acc + metric.tvlStEth, 0);
  const walletPositionStEth = poolMetrics.reduce((acc, metric) => acc + metric.positionStEth, 0);
  const maxFixedApr = stEthPoolRows.reduce((acc, row) => Math.max(acc, row.fixedAPR), 0);
  const maxLpApr = stEthPoolRows.reduce((acc, row) => Math.max(acc, row.lpAPR), 0);
  const firstMaturity = pools[0]?.maturity ?? "TBD";
  const lastMaturity = pools[pools.length - 1]?.maturity ?? firstMaturity;
  const maturityRange = firstMaturity === lastMaturity ? firstMaturity : `${firstMaturity} - ${lastMaturity}`;
  const isAnyPoolLoading = poolDataByIndex.some((data) => data.isLoading);

  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-800 backdrop-blur-sm flex-1">
      <div className="flex items-center justify-between px-8 pt-5 pb-4">
        <h2 className="text-xl font-semibold text-white">Available Pools</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              void handleClaimFaucet();
            }}
            disabled={!address || faucetWrite.isPending || faucetReceipt.isLoading}
            className="px-3 py-1.5 text-sm rounded-lg border border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {faucetWrite.isPending || faucetReceipt.isLoading ? "Claiming..." : "Claim 0.1 stETH Faucet"}
          </button>
          <button className="flex items-center gap-2 text-base text-gray-400 hover:text-white transition-colors">
            {isAnyPoolLoading ? "Syncing..." : "Live"}
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 3h12M3 7h8M5 11h4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {faucetWrite.error && (
        <p className="px-8 pb-2 text-sm text-red-400">{faucetWrite.error.message}</p>
      )}
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
          maturityRange={maturityRange}
          maxFixedAPR={maxFixedApr}
          maxLpAPR={maxLpApr}
          totalTVL={`${totalTvlStEth.toFixed(2)} stETH`}
          balance={primaryData.isConnected ? `${walletPositionStEth.toFixed(4)} stETH` : "0 stETH"}
          availableEth={availableDepositEth.toFixed(4)}
          availableStEth={availableDepositStEth.toFixed(4)}
          pools={stEthPoolRows}
        />
      </div>
    </div>
  );
}
