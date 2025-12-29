import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ParentDAOOverview } from "@/components/parent-dao-overview"
import { GovernanceMetrics } from "@/components/governance-metrics"
import { RecentProposals } from "@/components/recent-proposals"
import { TreasuryOverview } from "@/components/treasury-overview"

export default function ParentDAOPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <ParentDAOOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GovernanceMetrics />
            <TreasuryOverview />
          </div>
          <RecentProposals />
        </div>
      </main>
    </div>
  )
}
