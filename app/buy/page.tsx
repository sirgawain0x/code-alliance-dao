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
                            <h1 className="text-3xl font-bold tracking-tight">Buy CRTV</h1>
                            <p className="text-muted-foreground mt-2">
                                Acquire CRTV tokens to participate in governance and access exclusive features.
                            </p>
                        </div>
                        <div className="flex justify-center mt-12">
                            <BuyCRTV />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
