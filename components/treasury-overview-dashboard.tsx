"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Shield } from "lucide-react"
import { useDaos } from "@/hooks/useDaos"
import { formatEther } from "viem"

const riskMetrics = [
  { label: "Liquidity Risk", level: 15, status: "low" },
  { label: "Concentration Risk", level: 35, status: "medium" },
  { label: "Market Risk", level: 25, status: "low" },
  { label: "Operational Risk", level: 10, status: "low" },
]

const fundAllocation = [
  { category: "SubDAO Funding", allocated: 1200000, percentage: 50, color: "bg-blue-400" },
  { category: "Operations", allocated: 480000, percentage: 20, color: "bg-green-400" },
  { category: "Reserve Fund", allocated: 360000, percentage: 15, color: "bg-purple-400" },
  { category: "Community Grants", allocated: 240000, percentage: 10, color: "bg-orange-400" },
  { category: "Development", allocated: 120000, percentage: 5, color: "bg-red-400" },
]

export function TreasuryOverviewDashboard() {
  const { dao, isLoading } = useDaos({
    chainid: "8453",
  });

  if (isLoading || !dao) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg"></div>
  }

  const treasuryStats = [
    {
      label: "Total Shares",
      value: Math.round(Number(formatEther(BigInt(dao.totalShares || "0")))).toLocaleString(),
      subValue: dao.shareTokenSymbol,
      change: "+8.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "Total Loot",
      value: Math.round(Number(formatEther(BigInt(dao.totalLoot || "0")))).toLocaleString(),
      subValue: dao.lootTokenSymbol,
      change: "+12.3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      label: "Monthly Outflow",
      value: "$145,000",
      change: "-5.2%",
      changeType: "negative",
      icon: TrendingDown,
      color: "text-purple-400",
    },
    {
      label: "Diversification Score",
      value: "85%",
      change: "Excellent",
      changeType: "neutral",
      icon: PieChart,
      color: "text-orange-400",
    },
  ]
  const getRiskColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {treasuryStats.map((stat) => (
          <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p
                  className={`text-xs ${stat.changeType === "positive"
                      ? "text-green-400"
                      : stat.changeType === "negative"
                        ? "text-red-400"
                        : "text-muted-foreground"
                    }`}
                >
                  {stat.change}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Fund Allocation & Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Allocation */}
        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Fund Allocation</h3>
              <div className="text-sm text-muted-foreground">Total: $2.4M</div>
            </div>

            <div className="space-y-4">
              {fundAllocation.map((fund) => (
                <div key={fund.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{fund.category}</span>
                    <div className="text-right">
                      <span className="text-foreground font-medium">${(fund.allocated / 1000).toFixed(0)}K</span>
                      <span className="text-muted-foreground ml-2">({fund.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={fund.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Assessment */}
        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
              <Shield className="h-5 w-5 text-green-400" />
            </div>

            <div className="space-y-4">
              {riskMetrics.map((risk) => (
                <div key={risk.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{risk.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getRiskColor(risk.status)}`}>
                        {risk.status.toUpperCase()}
                      </span>
                      <span className="text-foreground">{risk.level}%</span>
                    </div>
                  </div>
                  <Progress value={risk.level} className="h-2" />
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">Overall Risk Level: LOW</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Treasury Health Indicators */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Treasury Health Indicators</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Runway (Months)</span>
                <span className="text-foreground">18.5</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-green-400">Excellent sustainability</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asset Utilization</span>
                <span className="text-foreground">76%</span>
              </div>
              <Progress value={76} className="h-2" />
              <p className="text-xs text-muted-foreground">Optimal allocation</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="text-foreground">8.5%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-green-400">Above target</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
