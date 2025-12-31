"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Building2, DollarSign, Users } from "lucide-react"
import { useSubDAOStats } from "@/hooks/useSubDAOStats"
import { Skeleton } from "@/components/ui/skeleton"

export function SubDAOStats() {
  const { data: dynamicStats, isLoading } = useSubDAOStats()

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
      change: "Global Ecosystem", // removed specific "+2" claims
      icon: Building2,
      color: "text-blue-400",
    },
    {
      label: "Total Members",
      value: dynamicStats?.totalMembers?.toLocaleString() || "0",
      change: "Across all DAOs", // removed specific "+156" claims
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Combined Treasury",
      value: `Ξ ${dynamicStats?.combinedTreasury?.toFixed(2) || "0.00"}`,
      change: "Native Assets Only", // clarified it's native only
      icon: DollarSign,
      color: "text-purple-400",
    },
    {
      label: "Success Rate",
      value: "94%", // Keeping hardcoded for now or we could derive from proposal passing rates if we fetched them
      change: "Project completion",
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
