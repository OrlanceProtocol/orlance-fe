export default function ApproveButton({
  approved,
  onApprove,
  pending = false,
  disabled = false,
}: {
  approved: boolean;
  onApprove: () => void;
  pending?: boolean;
  disabled?: boolean;
}) {
  if (approved) {
    return (
      <span className="text-sm font-medium text-gray-400">Approved</span>
    );
  }

  return (
    <button
      onClick={onApprove}
      disabled={pending || disabled}
      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        pending || disabled
          ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
          : "bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
      }`}
    >
      {pending ? "Approving..." : "Approve"}
    </button>
  );
}
