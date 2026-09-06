import { BuyCRTV } from "@/components/buy-crtv"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"

export default function BuyPage() {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 min-w-0 relative z-0">
                <div className="pt-16 md:pt-0">
                    <DashboardHeader />
                    <div className="p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">Buy CRTVAI</h1>
                            <p className="text-muted-foreground mt-2">
                                Mint CRTVAI with USDC on Base via the MeToken hub. Connect a wallet on Base to get a live quote and mint.
                            </p>
                        </div>
                        <div className="mt-8">
                            <BuyCRTV />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
