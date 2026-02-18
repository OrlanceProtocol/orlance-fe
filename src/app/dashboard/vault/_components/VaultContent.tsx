"use client";

import { useState } from "react";
import { useAutoRollerVault } from "@/hooks/useAutoRollerVault";
import VaultStatsBar from "./VaultStatsBar";
import VaultDepositForm from "./VaultDepositForm";
import VaultWithdrawForm from "./VaultWithdrawForm";
import VaultPositionCard from "./VaultPositionCard";

type Tab = "deposit" | "withdraw";

export default function VaultContent() {
  const [activeTab, setActiveTab] = useState<Tab>("deposit");
  const data = useAutoRollerVault();

  return (
    <>
      {/* Stats Bar - full width above the grid */}
      <div className="col-span-5 mb-2">
        <VaultStatsBar data={data} />
      </div>

      {/* Main content - 3 cols */}
      <div className="col-span-3">
        <div className="bg-[#111827]/80 rounded-xl border border-gray-700/30 p-6 h-full backdrop-blur-sm">
          {/* Tab switcher */}
          <div className="flex justify-center border-b border-gray-700/30 mb-6">
            {(["deposit", "withdraw"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 pb-3 text-2xl font-bold text-center transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? "text-white border-b-3 border-teal-500 -mb-[1px]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "deposit" ? (
            <VaultDepositForm data={data} />
          ) : (
            <VaultWithdrawForm data={data} />
          )}
        </div>
      </div>

      {/* Sidebar - 2 cols */}
      <div className="col-span-2">
        <VaultPositionCard data={data} />
      </div>
    </>
  );
}
