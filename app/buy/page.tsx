import { BuyCRTV } from "@/components/buy-crtv"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { createSiteMetadata, SITE_NAME } from "@/lib/site-metadata"
import type { Metadata } from "next"

export const metadata: Metadata = createSiteMetadata({
  title: `Buy CRTV | ${SITE_NAME}`,
  description: "Purchase CRTV tokens to participate in Creative Organization DAO governance.",
  path: "/buy",
  openGraphTitle: `Buy CRTV | ${SITE_NAME}`,
})

export default function BuyPage() {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 min-w-0 relative z-0">
                <div className="pt-16 md:pt-0">
                    <DashboardHeader />
                    <div className="p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">Buy &amp; Sell CRTVAI</h1>
                            <p className="text-muted-foreground mt-2">
                                Mint or burn CRTVAI with USDC on Base via the MeToken hub. Connect a wallet on Base to get live quotes.
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
