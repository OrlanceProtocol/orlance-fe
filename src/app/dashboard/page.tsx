import Header from "./_components/Header";
import PoolTable from "./_components/PoolTable";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto px-30 py-10 flex flex-col min-h-screen">
        <Header />
        <PoolTable />
      </main>
    </div>
  );
}
