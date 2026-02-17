export default function PlusConnector() {
  return (
    <div className="flex justify-center -my-2 relative z-10">
      <div className="w-8 h-8 rounded-full bg-[#1a2332] border border-gray-700/30 flex items-center justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="text-gray-400"
        >
          <path
            d="M7 2V12M2 7H12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
