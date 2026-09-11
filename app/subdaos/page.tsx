import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubDAOGrid } from "@/components/subdao-grid"
import { SubDAOStats } from "@/components/subdao-stats"
import { CreateSubDAOCard } from "@/components/create-subdao-card"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export const metadata: Metadata = createSiteMetadata({
  title: `SubDAOs | ${SITE_NAME}`,
  description:
    "Explore Creative Organization DAO subDAOs, incubator projects, and ecosystem stats.",
  path: "/subdaos",
  openGraphTitle: `SubDAOs | ${SITE_NAME}`,
})

export default function SubDAOsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">SubDAO Management</h1>
                <p className="text-muted-foreground">Manage and oversee all SubDAOs in the ecosystem</p>
              </div>
            </div>
            <SubDAOStats />
            <CreateSubDAOCard />
            <SubDAOGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
