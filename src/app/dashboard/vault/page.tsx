import Header from "@/app/dashboard/_components/Header";
import VaultContent from "./_components/VaultContent";

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/3 rounded-full blur-[150px]" />

      <main className="relative mx-auto px-30 py-10 flex flex-col min-h-screen">
        <Header />

        <div className="grid grid-cols-5 gap-6 mt-6 flex-1">
          <VaultContent />
        </div>
      </main>
    </div>
  );
}
