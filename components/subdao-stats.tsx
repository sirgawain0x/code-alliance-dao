"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Building2, DollarSign, Users } from "lucide-react"
import { useSubDAOStats } from "@/hooks/useSubDAOStats"
import { Skeleton } from "@/components/ui/skeleton"

export function SubDAOStats() {
  const { data: dynamicStats, isLoading, isError } = useSubDAOStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="stat-card-gradient p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-8 rounded mr-2" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      label: "Active SubDAOs",
      value: dynamicStats?.activeSubDAOs?.toString() || "0",
      change: dynamicStats ? `${dynamicStats.networkCount} active networks` : "Global ecosystem",
      icon: Building2,
      color: "text-blue-400",
    },
    {
      label: "Featured DAO Members",
      value: dynamicStats?.totalMembers?.toLocaleString() || "0",
      change: isError ? "Live sync unavailable" : "Sum of featured DAOs on-chain",
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Combined Treasury",
      value: `Ξ ${dynamicStats?.combinedTreasury?.toFixed(4) || "0.0000"}`,
      change: isError ? "Live sync unavailable" : "Featured DAO native balances",
      icon: DollarSign,
      color: "text-purple-400",
    },
    {
      label: "Networks",
      value: String(dynamicStats?.networkCount || 0),
      change: isError ? "Live sync unavailable" : "Chains with featured DAOs",
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-green-400">{stat.change}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  )
}
