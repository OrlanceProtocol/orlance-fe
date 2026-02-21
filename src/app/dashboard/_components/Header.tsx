"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV_ITEMS = [
  { label: "Pools", href: "/dashboard", match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/pool") },
  { label: "Vault", href: "/dashboard/vault", match: (p: string) => p.startsWith("/dashboard/vault") },
  { label: "Lottery", href: "/dashboard/lottery", match: (p: string) => p.startsWith("/dashboard/lottery") },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {/* Logo + Nav (desktop) */}
        <div className="flex items-center gap-8">
          <img src="/icon/orlance-polos.png" alt="Orlance" className="h-8 w-auto" />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "text-gray-400 hover:text-gray-200 border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop connect button */}
          <div className="hidden sm:block">
            <ConnectButton />
          </div>

          {/* Mobile connect button - left of hamburger */}
          <div className="sm:hidden">
            <ConnectButton />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-gray-700/50 pt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-gray-400 hover:text-gray-200 border border-transparent hover:bg-gray-800/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
)}
    </div>
  );
}
