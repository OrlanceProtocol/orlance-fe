export default function ExecuteButton({
  enabled = false,
  fullWidth = false,
  pending = false,
  label = "Execute",
  pendingLabel = "Processing...",
  onClick,
}: {
  enabled?: boolean;
  fullWidth?: boolean;
  pending?: boolean;
  label?: string;
  pendingLabel?: string;
  onClick?: () => void;
}) {
  const disabled = !enabled || pending;
  const text = pending ? pendingLabel : label;

  if (fullWidth) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={`w-full py-3 text-base font-semibold rounded-xl shadow-sm transition-colors cursor-pointer ${
          !disabled
            ? "bg-teal-500 hover:bg-teal-600 text-white"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
        }`}
      >
        {text}
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        disabled={disabled}
        onClick={onClick}
        className={`px-16 py-3 text-base font-semibold rounded-xl shadow-sm ${
          !disabled
            ? "bg-teal-500 hover:bg-teal-600 text-white cursor-pointer transition-colors"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
        }`}
      >
        {text}
      </button>
    </div>
  );
}
