import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

const assets = [
  {
    name: "USDC",
    type: "Stablecoin",
    amount: 850000,
    percentage: 35.4,
    change: "+2.1%",
    changeType: "positive",
    risk: "low",
    yield: "4.2%",
  },
  {
    name: "ETH",
    type: "Cryptocurrency",
    amount: 480000,
    percentage: 20.0,
    change: "+15.3%",
    changeType: "positive",
    risk: "high",
    yield: "5.8%",
  },
  {
    name: "Treasury Bills",
    type: "Traditional",
    amount: 360000,
    percentage: 15.0,
    change: "+1.2%",
    changeType: "positive",
    risk: "low",
    yield: "3.1%",
  },
  {
    name: "BTC",
    type: "Cryptocurrency",
    amount: 240000,
    percentage: 10.0,
    change: "+8.7%",
    changeType: "positive",
    risk: "high",
    yield: "0%",
  },
  {
    name: "USDT",
    type: "Stablecoin",
    amount: 216000,
    percentage: 9.0,
    change: "+0.1%",
    changeType: "positive",
    risk: "low",
    yield: "3.8%",
  },
  {
    name: "Money Market",
    type: "Traditional",
    amount: 144000,
    percentage: 6.0,
    change: "+0.8%",
    changeType: "positive",
    risk: "low",
    yield: "2.9%",
  },
  {
    name: "Other Assets",
    type: "Mixed",
    amount: 110400,
    percentage: 4.6,
    change: "+3.2%",
    changeType: "positive",
    risk: "medium",
    yield: "4.5%",
  },
]

export function AssetAllocation() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case "Stablecoin":
        return "text-blue-400"
      case "Cryptocurrency":
        return "text-purple-400"
      case "Traditional":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          <Button variant="outline" size="sm">
            Rebalance
          </Button>
        </div>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.name} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-foreground">{asset.name}</h4>
                    <p className={`text-xs ${getAssetTypeColor(asset.type)}`}>{asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${(asset.amount / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">{asset.percentage}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <Badge className={getRiskColor(asset.risk)} variant="outline">
                    {asset.risk} risk
                  </Badge>
                  <span className="text-muted-foreground">Yield: {asset.yield}</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    asset.changeType === "positive" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {asset.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{asset.change}</span>
                </div>
              </div>

              <Progress value={asset.percentage} className="h-1" />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Portfolio Value</span>
            <span className="font-medium text-foreground">$2,400,000</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
