import { useState } from "react";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";

export default function SwapTab() {
  const [swapFromToken, setSwapFromToken] = useState("");
  const [swapAmount, setSwapAmount] = useState("");

  return (
    <>
      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-16 shrink-0">Token</span>
            <button
              onClick={() =>
                setSwapFromToken(
                  swapFromToken === ""
                    ? "Principals"
                    : swapFromToken === "Principals"
                      ? "Yields"
                      : swapFromToken === "Yields"
                        ? "LP Tokens"
                        : ""
                )
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/30 bg-[#1a2332] hover:bg-[#1e2a3a] transition-colors cursor-pointer"
            >
              {swapFromToken ? (
                <span className="text-sm font-medium text-white">
                  {swapFromToken}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Please select</span>
              )}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="text-gray-400"
              >
                <path
                  d="M3 5L6 8L9 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-16 shrink-0">Amount</span>
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="0.00"
              className="w-48 px-4 py-2 rounded-lg border border-gray-700/30 bg-[#151f2e] text-base text-white shadow-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* To section */}
      <div className="mb-8">
        <SectionHeader title="To" withDivider />
        <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
          <p className="text-base font-semibold text-white">Yields</p>
          <p className="text-sm text-gray-500">
            Estimated amount received: Yields
          </p>
        </div>
      </div>

      {/* Approve + Execute buttons */}
      <div className="flex justify-center gap-4">
        <button className="px-10 py-3 bg-gray-700/50 text-gray-500 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
          Approve
        </button>
        <button className="px-10 py-3 bg-gray-700/50 text-gray-500 text-base font-semibold rounded-xl shadow-sm cursor-not-allowed">
          Execute
        </button>
      </div>
    </>
  );
}
