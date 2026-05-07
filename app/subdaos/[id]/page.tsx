import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubDAODetail } from "@/components/subdao-detail"

export default async function SubDAODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6">
          <SubDAODetail subDAOId={id} />
        </div>
      </main>
    </div>
  )
}
