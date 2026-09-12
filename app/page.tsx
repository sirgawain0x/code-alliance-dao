import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { ChainGovernance } from "@/components/chain-governance"
import { FeaturedDAOs } from "@/components/featured-daos"
import { SubDAOStats } from "@/components/subdao-stats"
import { PushNotificationStub } from "@/components/push-notification-stub"
import { createSiteMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/site-metadata"
import type { Metadata } from "next"

export const metadata: Metadata = createSiteMetadata({
  title: `${SITE_NAME} | Dashboard`,
  description: SITE_TAGLINE,
  path: "/",
  openGraphTitle: SITE_NAME,
})

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <SubDAOStats />
            <StatsOverview />
            <ChainGovernance />
            <FeaturedDAOs />
            <PushNotificationStub />
          </div>
        </div>
      </main>
    </div>
  )
}
