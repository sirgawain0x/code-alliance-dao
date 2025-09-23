import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectDetail } from "@/components/project-detail"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <DashboardHeader />
        <div className="p-6">
          <ProjectDetail projectId={params.id} />
        </div>
      </main>
    </div>
  )
}
