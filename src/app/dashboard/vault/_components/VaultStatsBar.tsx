import AutoCompoundBadge from "./AutoCompoundBadge";
import RollOverCountdown from "./RollOverCountdown";
import type { useAutoRollerVault } from "@/hooks/useAutoRollerVault";

type VaultData = ReturnType<typeof useAutoRollerVault>;

function Skeleton() {
  return <div className="h-5 w-20 bg-gray-700/50 rounded animate-pulse" />;
}

export default function VaultStatsBar({ data }: { data: VaultData }) {
  const { isLoading, formatted, derived } = data;

  return (
    <div className="bg-[#111827]/80 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between flex-wrap gap-6">
        {/* TVL */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Total Value Locked</p>
          {isLoading ? (
            <Skeleton />
          ) : (
            <p className="text-xl font-semibold text-white">
              {formatted.totalAssets} stETH
            </p>
          )}
        </div>

        {/* Est. APY */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Implied APY</p>
          {isLoading ? (
            <Skeleton />
          ) : (
            <p className="text-xl font-semibold text-teal-400">
              {formatted.estimatedApy}%
            </p>
          )}
        </div>

        {/* Next Roll-Over */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Next Roll-Over</p>
          {isLoading ? (
            <Skeleton />
          ) : (
            <RollOverCountdown targetTimestamp={derived.nextRollOverTs} />
          )}
        </div>

        {/* Badge */}
        <AutoCompoundBadge active={derived.isAutoCompounding && data.isConfigured} />
      </div>
      {!data.isConfigured && (
        <p className="text-sm text-yellow-300 mt-4">
          Auto-Roller contract is not configured. Set `NEXT_PUBLIC_ORLANCE_AUTO_ROLLER`.
        </p>
      )}
    </div>
  );
}
