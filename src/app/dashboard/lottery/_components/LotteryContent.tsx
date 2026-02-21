"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useNoLossLottery } from "@/hooks/useNoLossLottery";
import { pools } from "@/data/pools";
import {
  erc20Abi,
  lotteryAbi,
  ORLANCE_DEPLOYMENT,
} from "@/lib/orlance/contracts";

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "TBD";
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

function formatDateOnly(timestamp: number): string {
  if (!timestamp) return "TBD";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "ready to draw";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function shortAddress(address: string): string {
  if (!address || address.length < 10) return address || "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "teal";
}) {
  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0F1A2A] p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone === "teal" ? "text-teal-300" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export default function LotteryContent() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const data = useNoLossLottery();

  const approveWrite = useWriteContract();
  const depositWrite = useWriteContract();

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });
  const depositReceipt = useWaitForTransactionReceipt({ hash: depositWrite.data });

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseEther(amount) : 0n;
    } catch {
      return 0n;
    }
  }, [amount]);

  const needsApproval = parsedAmount > 0n && data.balances.stEthAllowance < parsedAmount;
  const canDeposit = Boolean(address) && data.isConfigured && parsedAmount > 0n && !needsApproval;

  const isBusy =
    approveWrite.isPending ||
    approveReceipt.isLoading ||
    depositWrite.isPending ||
    depositReceipt.isLoading;

  const activePool = pools.find(
    (pool) => pool.maturityTimestamp === data.state.activeMaturity,
  );
  const activePoolHref = activePool ? `/dashboard/pool/${activePool.id}` : "/dashboard";

  const handleApprove = async () => {
    if (!address || parsedAmount <= 0n) return;
    await approveWrite.writeContractAsync({
      abi: erc20Abi,
      address: ORLANCE_DEPLOYMENT.addresses.stEth,
      functionName: "approve",
      args: [ORLANCE_DEPLOYMENT.addresses.lottery, parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
    await data.refetch();
  };

  const handleDeposit = async () => {
    if (!address || parsedAmount <= 0n) return;
    await depositWrite.writeContractAsync({
      abi: lotteryAbi,
      address: ORLANCE_DEPLOYMENT.addresses.lottery,
      functionName: "deposit",
      args: [parsedAmount],
      chainId: ORLANCE_DEPLOYMENT.chainId,
    });
    setAmount("");
    await data.refetch();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 flex-1">
      <section className="md:col-span-5 rounded-2xl border border-teal-500/25 bg-gradient-to-r from-[#102437] to-[#111827] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold text-white">No-Loss Yield Lottery</h1>
            <p className="mt-2 max-w-3xl text-gray-300">
              Deposit stETH, receive TPS principal in your wallet, and compete for the pooled weekly yield prize.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-wide text-cyan-200/80">Next Draw</p>
            <p className="mt-1 text-lg font-semibold text-cyan-200">{formatTimestamp(data.derived.endAt)}</p>
            <p className="text-sm text-cyan-100/80">{formatCountdown(data.derived.secondsToDraw)}</p>
          </div>
        </div>
      </section>

      <section className="md:col-span-3 rounded-xl border border-gray-700/30 bg-[#111827]/80 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-white">Current Weekly Round</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium border ${
              data.derived.isRoundLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            Round #{data.state.currentRoundId} {data.derived.isRoundLive ? "Live" : "Closed"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Deposits" value={`${data.formatted.totalDeposits} stETH`} />
          <StatCard label="Live Prize Pool" value={`${data.formatted.livePrizePool} stETH`} tone="teal" />
          <StatCard label="Participants" value={`${data.state.participantCount}`} />
        </div>

        <div className="mt-6 rounded-xl border border-gray-700/40 bg-[#0F1A2A] p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Round Progress</span>
            <span className="font-medium text-teal-300">{data.formatted.progressPct}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-700/50">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(data.derived.progressPct, 0), 100)}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-gray-400 flex items-center justify-between gap-2 flex-wrap">
            <span>Start: {formatTimestamp(data.derived.startAt)}</span>
            <span>End: {formatTimestamp(data.derived.endAt)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-700/40 bg-[#0F1A2A] p-5">
          <h3 className="text-sm font-semibold tracking-wide text-gray-300 uppercase">Round Maturity Pool</h3>
          <p className="mt-2 text-gray-300">Current maturity: {formatDateOnly(data.state.activeMaturity)}</p>
          <p className="mt-2 text-sm text-gray-400">
            Your principal is received as TPS and can be redeemed on the pool page after maturity.
          </p>
          <Link href={activePoolHref} className="inline-block mt-3 text-sm text-cyan-300 hover:text-cyan-200">
            Open Active Pool
          </Link>
        </div>
      </section>

      <section className="md:col-span-2 rounded-xl border border-gray-700/30 bg-[#111827]/80 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white">My Lottery Position</h2>
        <p className="mt-2 text-sm text-gray-400">
          stETH only. Deposit mints TPS and enters your tickets for this round.
        </p>

        <div className="mt-5 space-y-3">
          <StatCard label="Wallet stETH" value={`${data.formatted.walletStEth} stETH`} />
          <StatCard label="My Tickets (Round)" value={`${data.formatted.myTickets} stETH`} />
          <StatCard label="Estimated Share" value={`${data.formatted.mySharePct}%`} tone="teal" />
          <StatCard label="Potential Prize" value={`${data.formatted.potentialPrize} stETH`} />
        </div>

        <div className="mt-5 rounded-xl border border-gray-700/40 bg-[#0F1A2A] p-4">
          <label htmlFor="lottery-deposit" className="text-sm text-gray-300">
            Deposit Amount (stETH)
          </label>
          <input
            id="lottery-deposit"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.0"
            className="mt-2 w-full rounded-lg border border-gray-700/60 bg-[#0B1322] px-3 py-2 text-white outline-none focus:border-teal-400/60"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              void handleApprove();
            }}
            disabled={!needsApproval || isBusy || !data.isConfigured}
            className="rounded-lg border border-teal-500/40 bg-teal-500/15 px-4 py-3 text-sm font-semibold text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {approveWrite.isPending || approveReceipt.isLoading ? "Approving..." : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleDeposit();
            }}
            disabled={!canDeposit || isBusy}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {depositWrite.isPending || depositReceipt.isLoading ? "Depositing..." : "Deposit"}
          </button>
        </div>
        {!data.isConfigured && (
          <p className="mt-3 text-sm text-yellow-300">
            Lottery contract is not configured. Set <code>NEXT_PUBLIC_ORLANCE_LOTTERY</code>.
          </p>
        )}
        {approveWrite.error && <p className="mt-2 text-xs text-red-400">{approveWrite.error.message}</p>}
        {depositWrite.error && <p className="mt-2 text-xs text-red-400">{depositWrite.error.message}</p>}
      </section>

      <section className="md:col-span-5 rounded-xl border border-gray-700/30 bg-[#111827]/80 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-white">Recent Winners</h2>
          <p className="text-sm text-gray-400">Derived from on-chain WinnerDrawn events</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-2 pl-3">Round</th>
                <th className="pb-2">Winner</th>
                <th className="pb-2">Maturity</th>
                <th className="pb-2">Prize Won</th>
                <th className="pb-2">Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.state.winnerHistory.length === 0 ? (
                <tr className="bg-[#0F1A2A]">
                  <td colSpan={5} className="rounded-lg py-4 px-3 text-sm text-gray-400">
                    No winner has been drawn yet.
                  </td>
                </tr>
              ) : (
                data.state.winnerHistory.map((row) => (
                  <tr key={row.txHash} className="bg-[#0F1A2A]">
                    <td className="rounded-l-lg py-3 pl-3 text-sm font-medium text-white">#{row.roundId}</td>
                    <td className="py-3 text-sm text-gray-300">{shortAddress(row.winner)}</td>
                    <td className="py-3 text-sm text-gray-300">{formatDateOnly(row.maturity)}</td>
                    <td className="py-3 text-sm font-semibold text-teal-300">{row.prizeStEth.toFixed(4)} stETH</td>
                    <td className="rounded-r-lg py-3 text-sm text-cyan-300">
                      {row.txUrl ? (
                        <a href={row.txUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-200">
                          {shortAddress(row.txHash)}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
