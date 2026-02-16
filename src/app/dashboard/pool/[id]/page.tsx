import { getPoolById } from "@/data/pools";
import { notFound } from "next/navigation";
import Header from "../../_components/Header";
import PoolInfoBar from "./_components/PoolInfoBar";
import DepositWithdrawForm from "./_components/DepositWithdrawForm";
import Sidebar from "./_components/Sidebar";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function ManagePoolPage({ params }: Props) {
  const { id } = await params;
  const pool = getPoolById(id);
  if (!pool) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto px-30 py-10 flex flex-col min-h-screen">
        <Header />
        <div className="grid grid-cols-5 gap-6 mt-6 flex-1">
          <div className="col-span-3 flex flex-col gap-6">
            <PoolInfoBar pool={pool} />
            <DepositWithdrawForm pool={pool} />
          </div>
          <div className="col-span-2">
            <Sidebar pool={pool} />
          </div>
        </div>
      </main>
    </div>
  );
}
