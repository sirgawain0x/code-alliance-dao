import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { TreasuryOverviewDashboard } from "@/components/treasury-overview-dashboard"
import { AssetAllocation } from "@/components/asset-allocation"
import { TransactionHistory } from "@/components/transaction-history"
import { TreasuryProposals } from "@/components/treasury-proposals"

export default function TreasuryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 relative z-0">
        <div className="pt-16 md:pt-0">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Treasury Management</h1>
                <p className="text-muted-foreground">Monitor and manage DAO treasury assets and allocations</p>
              </div>
            </div>
            <TreasuryOverviewDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AssetAllocation />
              <TreasuryProposals />
            </div>
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
