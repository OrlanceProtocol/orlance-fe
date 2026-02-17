import Image from "next/image";

export default function TokenSelector({
  token,
  onToggle,
}: {
  token: "ETH" | "stETH";
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/30 bg-[#1a2332] hover:bg-[#1e2a3a] transition-colors cursor-pointer"
    >
      <Image
        src="/icon/eth.png"
        alt={token}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="text-sm font-medium text-white">{token}</span>
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
  );
}
