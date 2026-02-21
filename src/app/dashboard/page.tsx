import Header from "./_components/Header";
import PoolTable from "./_components/PoolTable";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Top-left glow */}
      <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-teal-500/20 blur-[150px] pointer-events-none" />

      {/* Bottom-right glow */}
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full bg-teal-500/20 blur-[150px] pointer-events-none" />

      <main className="relative mx-auto px-4 md:px-8 lg:px-30 py-6 md:py-10 flex flex-col min-h-screen">
        <Header />
        <PoolTable />
      </main>
    </div>
  );
}
