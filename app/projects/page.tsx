import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsOverview } from "@/components/projects-overview"
import { ProjectGrid } from "@/components/project-grid"
import { ProjectFilters } from "@/components/project-filters"

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
              <p className="text-muted-foreground">Track and manage projects across all SubDAOs</p>
            </div>
          </div>
          <ProjectsOverview />
          <ProjectFilters />
          <ProjectGrid />
        </div>
      </main>
    </div>
  )
}
