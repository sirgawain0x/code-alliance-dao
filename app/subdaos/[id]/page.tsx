import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubDAODetail } from "@/components/subdao-detail"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const title = `SubDAO ${params.id} | ${SITE_NAME}`

  return createSiteMetadata({
    title,
    description: `Explore SubDAO ${params.id} in the Creative Organization DAO ecosystem.`,
    path: `/subdaos/${params.id}`,
    openGraphTitle: title,
  })
}

export default function SubDAODetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6">
          <SubDAODetail subDAOId={params.id} />
        </div>
      </main>
    </div>
  )
}
