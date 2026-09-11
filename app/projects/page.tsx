import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { EcosystemGrid } from "@/components/ecosystem-grid"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export const metadata: Metadata = createSiteMetadata({
  title: `Projects | ${SITE_NAME}`,
  description:
    "Discover projects and ecosystem partners in the Creative Organization DAO incubator.",
  path: "/projects",
  openGraphTitle: `Projects | ${SITE_NAME}`,
})

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Our Ecosystem</h1>
                <p className="text-muted-foreground">Explore the platforms powering the Creative economy</p>
              </div>
            </div>
            <EcosystemGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
