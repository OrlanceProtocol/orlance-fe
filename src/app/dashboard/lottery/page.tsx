import Header from "@/app/dashboard/_components/Header";
import LotteryContent from "./_components/LotteryContent";

export default function LotteryPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      <div className="absolute top-0 -left-16 w-[620px] h-[620px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="absolute -bottom-20 -right-16 w-[640px] h-[640px] bg-cyan-500/10 rounded-full blur-[140px]" />

      <main className="relative mx-auto px-30 py-10 flex flex-col min-h-screen">
        <Header />
        <LotteryContent />
      </main>
    </div>
  );
}
