export default function AutoCompoundBadge({ active = true }: { active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            active ? "animate-pulse bg-teal-400" : "bg-gray-600"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            active ? "bg-teal-500" : "bg-gray-500"
          }`}
        />
      </span>
      <span className={`text-sm font-medium ${active ? "text-teal-400" : "text-gray-400"}`}>
        {active ? "Auto-Compounding Active" : "Idle"}
      </span>
    </div>
  );
}
