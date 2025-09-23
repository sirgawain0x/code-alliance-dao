import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProposalDetail } from "@/components/proposal-detail"

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <DashboardHeader />
        <div className="p-6">
          <ProposalDetail proposalId={params.id} />
        </div>
      </main>
    </div>
  )
}
