export default function AutoCompoundBadge() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
      </span>
      <span className="text-sm font-medium text-teal-400">
        Auto-Compounding Active
      </span>
    </div>
  );
}
