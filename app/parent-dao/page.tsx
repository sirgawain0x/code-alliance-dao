import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ParentDAOOverview } from "@/components/parent-dao-overview"
import { GovernanceMetrics } from "@/components/governance-metrics"
import { RecentProposals } from "@/components/recent-proposals"
import { TreasuryOverview } from "@/components/treasury-overview"

export default function ParentDAOPage() {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0 overflow-x-hidden">
        <div className="pt-16 md:pt-0 min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 space-y-6 min-w-0 max-w-full">
            <ParentDAOOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
              <GovernanceMetrics />
              <TreasuryOverview />
            </div>
            <RecentProposals />
          </div>
        </div>
      </main>
    </div>
  )
}
