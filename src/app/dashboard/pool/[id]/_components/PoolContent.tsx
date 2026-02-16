"use client";

import { useState } from "react";
import type { Pool } from "@/data/pools";
import PoolInfoBar from "./PoolInfoBar";
import DepositWithdrawForm from "./DepositWithdrawForm";

export default function PoolContent({ pool }: { pool: Pool }) {
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PoolInfoBar
        pool={pool}
        advanced={advanced}
        onToggleAdvanced={() => setAdvanced((prev) => !prev)}
      />
      <DepositWithdrawForm pool={pool} advanced={advanced} />
    </div>
  );
}
