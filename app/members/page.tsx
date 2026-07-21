import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MembersOverview } from "@/components/members-overview"
import { MemberGrid } from "@/components/member-grid"
import { RoleManagement } from "@/components/role-management"
import { RagequitPanel } from "@/components/ragequit-panel"
import { Button } from "@/components/ui/button"
import { getDaoHausAdminMembersUrl } from "@/lib/dao-haus-links"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MembersPage() {
  const adminMembersUrl = getDaoHausAdminMembersUrl()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Member Management</h1>
                <p className="text-muted-foreground">
                  Live membership from the Base Moloch v3 DAO, matching DAOhaus Admin.
                </p>
              </div>
              {adminMembersUrl && (
                <Button variant="outline" asChild>
                  <Link href={adminMembersUrl} target="_blank" rel="noopener noreferrer">
                    Open in DAOhaus
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
            <MembersOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MemberGrid />
              </div>
              <div className="space-y-6">
                <RagequitPanel />
                <RoleManagement />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
