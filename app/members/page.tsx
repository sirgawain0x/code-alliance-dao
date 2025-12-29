import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MembersOverview } from "@/components/members-overview"
import { MemberGrid } from "@/components/member-grid"
import { RoleManagement } from "@/components/role-management"

export default function MembersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Member Management</h1>
              <p className="text-muted-foreground">Manage members, roles, and permissions across the DAO ecosystem</p>
            </div>
          </div>
          <MembersOverview />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MemberGrid />
            </div>
            <div>
              <RoleManagement />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
