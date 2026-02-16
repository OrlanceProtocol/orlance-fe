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
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <Image
        src="/icon/eth.png"
        alt={token}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="text-sm font-medium text-gray-900">{token}</span>
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
