"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, Crown, Shield } from "lucide-react"
import { useDaoMembers } from "@/hooks/useDaoMembers"


export function MembersOverview() {
  const { members, isLoading } = useDaoMembers({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS,
  })

  const stats = {
    total: members?.length || 0,
    newMembers: members?.filter(m => {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return new Date(Number(m.createdAt) * 1000) > oneMonthAgo
    }).length || 0,
    activeVoters: members?.filter(m => Number(m.shares) > 0).length || 0,
    sharesTotal: members?.reduce((acc, m) => acc + Number(m.shares), 0) || 0
  }

  const memberStats = [
    {
      label: "Total Members",
      value: stats.total.toLocaleString(),
      change: `+${stats.newMembers} this month`,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "New Members",
      value: stats.newMembers.toLocaleString(),
      change: "This month",
      icon: UserPlus,
      color: "text-green-400",
    },
    {
      label: "Voting Members",
      value: stats.activeVoters.toLocaleString(),
      change: `${stats.total > 0 ? ((stats.activeVoters / stats.total) * 100).toFixed(1) : 0}% of total`,
      icon: Crown,
      color: "text-purple-400",
    },
    {
      label: "Total Shares",
      value: stats.sharesTotal.toLocaleString(),
      change: "Voting Power",
      icon: Shield,
      color: "text-orange-400",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="stat-card-gradient p-6 h-32 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memberStats.map((stat) => (
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
    </div>
  )
}


