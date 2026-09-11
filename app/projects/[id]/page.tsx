import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectDetail } from "@/components/project-detail"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const title = `Project ${params.id} | ${SITE_NAME}`

  return createSiteMetadata({
    title,
    description: `View project ${params.id} in the Creative Organization DAO incubator.`,
    path: `/projects/${params.id}`,
    openGraphTitle: title,
  })
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6">
          <ProjectDetail projectId={params.id} />
        </div>
      </main>
    </div>
  )
}
