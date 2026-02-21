import { getPoolById } from "@/data/pools";
import { notFound } from "next/navigation";
import Header from "../../_components/Header";
import PoolContent from "./_components/PoolContent";
import Sidebar from "./_components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function ManagePoolPage({ params }: Props) {
  const { id } = await params;
  const pool = getPoolById(id);
  if (!pool) notFound();

  return (
    <ScrollArea className="h-screen">
    <div className="min-h-screen bg-[#0B1120] relative overflow-hidden">
      {/* Top-left glow */}
      <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-teal-500/20 blur-[150px] pointer-events-none" />
      {/* Bottom-right glow */}
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full bg-teal-500/20 blur-[150px] pointer-events-none" />

      <main className="relative mx-auto px-30 py-10 flex flex-col min-h-screen">
        <Header />
        <div className="grid grid-cols-5 gap-6 mt-6 flex-1">
          <div className="col-span-3">
            <PoolContent pool={pool} />
          </div>
          <div className="col-span-2">
            <Sidebar pool={pool} />
          </div>
        </div>
      </main>
    </div>
    </ScrollArea>
  );
}
