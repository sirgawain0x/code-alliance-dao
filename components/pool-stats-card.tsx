"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCrtvPool } from "@/hooks/useCrtvPool"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Server } from "lucide-react"

export function PoolStatsCard() {
    const { data: stats, isLoading } = useCrtvPool()

    const getChainName = (chainId: number) => {
        switch (chainId) {
            case 8453: return "Base"
            case 10: return "Optimism"
            case 137: return "Polygon"
            default: return "Unknown"
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Network Liquidity
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Network Liquidity
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {stats?.map((stat) => (
                    <div key={stat.chainId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{getChainName(stat.chainId)}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold">
                                {parseFloat(stat.liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })} CRTV
                            </div>
                            {/* Potentially show rate limit status here later */}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
