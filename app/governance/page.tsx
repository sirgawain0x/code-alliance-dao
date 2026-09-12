import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { GovernanceOverview } from "@/components/governance-overview"
import { ActiveProposals } from "@/components/active-proposals"
import { VotingHistory } from "@/components/voting-history"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export const metadata: Metadata = createSiteMetadata({
  title: `Governance | ${SITE_NAME}`,
  description:
    "View active proposals, voting history, and governance metrics for Creative Organization DAO.",
  path: "/governance",
  openGraphTitle: `Governance | ${SITE_NAME}`,
})

export default function GovernancePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Governance</h1>
                <p className="text-muted-foreground">Participate in DAO decision-making and proposal voting</p>
              </div>
            </div>
            <GovernanceOverview />
            <ActiveProposals />
            <VotingHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
