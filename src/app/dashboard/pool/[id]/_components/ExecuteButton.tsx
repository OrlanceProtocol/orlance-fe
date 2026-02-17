export default function ExecuteButton({
  enabled = false,
  fullWidth = false,
}: {
  enabled?: boolean;
  fullWidth?: boolean;
}) {
  if (fullWidth) {
    return (
      <button
        disabled={!enabled}
        className={`w-full py-3 text-base font-semibold rounded-xl shadow-sm transition-colors cursor-pointer ${
          enabled
            ? "bg-teal-500 hover:bg-teal-600 text-white"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
        }`}
      >
        Execute
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        disabled={!enabled}
        className={`px-16 py-3 text-base font-semibold rounded-xl shadow-sm ${
          enabled
            ? "bg-teal-500 hover:bg-teal-600 text-white cursor-pointer transition-colors"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
        }`}
      >
        Execute
      </button>
    </div>
  );
}
