import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, PieChart } from "lucide-react"

const treasuryAllocations = [
  { category: "SubDAO Funding", amount: "$1.2M", percentage: 50, color: "bg-blue-400" },
  { category: "Operations", amount: "$480K", percentage: 20, color: "bg-green-400" },
  { category: "Reserve Fund", amount: "$360K", percentage: 15, color: "bg-purple-400" },
  { category: "Community Grants", amount: "$240K", percentage: 10, color: "bg-orange-400" },
  { category: "Development", amount: "$120K", percentage: 5, color: "bg-red-400" },
]

export function TreasuryOverview() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Treasury Overview</h3>
          <Button variant="outline" size="sm">
            <PieChart className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Total Assets</span>
            </div>
            <p className="text-2xl font-bold text-foreground">$2.4M</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Monthly Growth</span>
            </div>
            <p className="text-2xl font-bold text-green-400">+8.5%</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Fund Allocation</h4>
          {treasuryAllocations.map((allocation) => (
            <div key={allocation.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{allocation.category}</span>
                <span className="text-foreground">{allocation.amount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={allocation.percentage} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground w-8">{allocation.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
