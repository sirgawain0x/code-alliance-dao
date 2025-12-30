import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { ChainGovernance } from "@/components/chain-governance"
import { FeaturedDAOs } from "@/components/featured-daos"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <StatsOverview />
            <ChainGovernance />
            <FeaturedDAOs />
          </div>
        </div>
      </main>
    </div>
  )
}
