"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <svg
          width="40"
          height="40"
          viewBox="0 0 32 32"
          fill="none"
          className="text-gray-800"
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
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          orlance
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-gray-500">
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
