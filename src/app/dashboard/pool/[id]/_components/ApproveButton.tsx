export default function ApproveButton({
  approved,
  onApprove,
}: {
  approved: boolean;
  onApprove: () => void;
}) {
  if (approved) {
    return (
      <span className="text-sm font-medium text-gray-500">Approved</span>
    );
  }

  return (
    <button
      onClick={onApprove}
      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
    >
      Approve
    </button>
  );
}
