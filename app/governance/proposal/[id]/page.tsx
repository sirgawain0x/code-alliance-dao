import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { GovernanceProposalSurface } from "@/components/governance-proposal-surface"
import { getProposalMetadata } from "@/app/actions"

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const metadata = await getProposalMetadata(id)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6">
          <GovernanceProposalSurface proposalId={id} initialMetadata={metadata} />
        </div>
      </main>
    </div>
  )
}

