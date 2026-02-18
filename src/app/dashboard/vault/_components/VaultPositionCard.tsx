import RollOverCountdown from "./RollOverCountdown";
import type { useAutoRollerVault } from "@/hooks/useAutoRollerVault";

type VaultData = ReturnType<typeof useAutoRollerVault>;

function Skeleton() {
  return <div className="h-5 w-20 bg-gray-700/50 rounded animate-pulse" />;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      {children}
    </div>
  );
}

export default function VaultPositionCard({ data }: { data: VaultData }) {
  const { isLoading, formatted, derived } = data;

  return (
    <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 backdrop-blur-sm space-y-6">
      <h3 className="text-lg font-semibold text-white">Your Position</h3>

      <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e] space-y-3">
        <Row label="Deposited (stETH)">
          {isLoading ? (
            <Skeleton />
          ) : (
            <span className="text-white font-medium">
              {formatted.userDepositValue}
            </span>
          )}
        </Row>

        <Row label="OstETH Balance">
          {isLoading ? (
            <Skeleton />
          ) : (
            <span className="text-white font-medium">
              {formatted.userShares}
            </span>
          )}
        </Row>

        <Row label="Earnings">
          {isLoading ? (
            <Skeleton />
          ) : (
            <span className="text-teal-300 font-medium">
              {formatted.earnings} stETH
            </span>
          )}
        </Row>

        <div className="border-t border-gray-700/30 pt-3">
          <Row label="OstETH Price">
            {isLoading ? (
              <Skeleton />
            ) : (
              <span className="text-white font-medium">
                {formatted.sharePrice} stETH
              </span>
            )}
          </Row>
        </div>

        <div className="border-t border-gray-700/30 pt-3">
          <Row label="Est. APY">
            {isLoading ? (
              <Skeleton />
            ) : (
              <span className="text-teal-400 font-medium">
                {formatted.estimatedApy}%
              </span>
            )}
          </Row>
        </div>
      </div>

      {/* Roll-Over Countdown Section */}
      <div className="rounded-xl border border-gray-700/30 p-5 bg-[#151f2e]">
        <p className="text-sm text-gray-400 mb-2">Next Roll-Over In</p>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="text-2xl font-bold">
            <RollOverCountdown targetTimestamp={derived.nextRollOverTs} />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Yield is auto-compounded at each roll-over
        </p>
      </div>
    </div>
  );
}
