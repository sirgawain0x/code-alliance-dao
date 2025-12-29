"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, FileText, Vote, Users } from "lucide-react"
import { useDao } from "@/hooks/useDao"
import { useProposals } from "@/hooks/useProposals"
import { formatEther } from "viem"

const safeFormatEther = (val: string | undefined | null) => {
  try {
    if (!val) return "0";
    const cleanVal = val.toString().split('.')[0];
    if (cleanVal === "") return "0";
    return formatEther(BigInt(cleanVal));
  } catch (e) {
    return "0";
  }
}

export function StatsOverview() {
  const { dao, isLoading: daoLoading } = useDao({
    chainid: "8453",
    daoid: process.env.NEXT_PUBLIC_TARGET_DAO_ADDRESS
  });
  const { proposals, activeProposals, isLoading: proposalsLoading } = useProposals({
    chainid: "8453",
  });

  if (daoLoading || proposalsLoading || !dao) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg"></div>
  }

  const stats = [
    {
      label: "Active Members",
      value: dao.activeMemberCount,
      subValue: undefined,
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Proposals",
      value: `${activeProposals?.length || 0} Active`,
      subValue: `${proposals?.length || 0} Total`,
      icon: FileText,
      color: "text-blue-400",
    },
    {
      label: "Total Shares",
      value: Math.round(Number(safeFormatEther(dao.totalShares))).toLocaleString(),
      subValue: undefined,
      icon: Vote,
      color: "text-purple-400",
    },
    {
      label: "Total Loot",
      value: Math.round(Number(safeFormatEther(dao.totalLoot))).toLocaleString(),
      subValue: undefined,
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ]

  const additionalStats = [
    {
      label: "Quorum",
      value: `${dao.quorumPercent}%`,
      icon: TrendingUp,
    },
    {
      label: "Voting Period",
      value: `${Number(dao.votingPeriod) / 3600}h`, // Assuming seconds
      icon: FileText,
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
              {stat.subValue && (
                <p className="text-xs text-muted-foreground">{stat.subValue}</p>
              )}
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}

      {additionalStats.map((stat) => (
        <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <stat.icon className="h-8 w-8 text-primary" />
          </div>
        </Card>
      ))}
    </div>
  )
}
