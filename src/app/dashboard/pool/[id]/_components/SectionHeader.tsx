export default function SectionHeader({
  title,
  withDivider = false,
}: {
  title: string;
  withDivider?: boolean;
}) {
  if (withDivider) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex-1 border-t border-gray-200" />
      </div>
    );
  }

  return <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>;
}
