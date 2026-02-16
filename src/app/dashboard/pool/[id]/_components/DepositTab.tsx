import { useState } from "react";
import type { Pool } from "@/data/pools";
import TokenInput from "./TokenInput";
import YieldStrategyCard from "./YieldStrategyCard";
import SectionHeader from "./SectionHeader";
import ExecuteButton from "./ExecuteButton";

export default function DepositTab({ pool }: { pool: Pool }) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "stETH">("ETH");
  const [strategy, setStrategy] = useState<"fixed" | "variable">("fixed");

  const balance = selectedToken === "ETH" ? pool.ethAmount : pool.stEthAmount;

  return (
    <>
      {/* From section */}
      <div className="mb-6">
        <SectionHeader title="From" />
        <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
          <TokenInput
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            amount={amount}
            onAmountChange={setAmount}
            balance={balance}
          />
        </div>
      </div>

      {/* To separator */}
      <SectionHeader title="To" withDivider />

      {/* Yield strategy cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <YieldStrategyCard
          type="fixed"
          label="Fixed Yield"
          sublabel="Interest rate protection"
          apr={pool.fixedAPR}
          selected={strategy === "fixed"}
          onSelect={() => setStrategy("fixed")}
        />
        <YieldStrategyCard
          type="variable"
          label="Variable Yield"
          sublabel="Liquidity provision"
          apr={pool.lpAPR}
          selected={strategy === "variable"}
          onSelect={() => setStrategy("variable")}
        />
      </div>

      <ExecuteButton enabled fullWidth />
    </>
  );
}
