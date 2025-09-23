import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubDAODetail } from "@/components/subdao-detail"

export default function SubDAODetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <DashboardHeader />
        <div className="p-6">
          <SubDAODetail subDAOId={params.id} />
        </div>
      </main>
    </div>
  )
}
