"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV_ITEMS = [
  { label: "Pools", href: "/dashboard", match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/pool") },
  { label: "Vault", href: "/dashboard/vault", match: (p: string) => p.startsWith("/dashboard/vault") },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            className="text-teal-400"
          >
            <path
              d="M6 10 L16 4 L26 10 L26 22 L16 28 L6 22Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M6 16 L16 10 L26 16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span className="text-2xl font-bold text-white tracking-tight">
            orlance
          </span>
        </div>

        <nav className="flex items-center gap-1">
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
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </button>

        <ConnectButton />
      </div>
    </div>
  );
}
