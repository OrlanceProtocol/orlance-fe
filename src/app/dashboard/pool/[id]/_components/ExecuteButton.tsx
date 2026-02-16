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
            ? "bg-gray-900 hover:bg-gray-800 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
            ? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer transition-colors"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Execute
      </button>
    </div>
  );
}
