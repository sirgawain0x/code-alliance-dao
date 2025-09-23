import { Card } from "@/components/ui/card"
import { TrendingUp, Building2, DollarSign, Users } from "lucide-react"

const stats = [
  {
    label: "Active SubDAOs",
    value: "8",
    change: "+2 this quarter",
    icon: Building2,
    color: "text-blue-400",
  },
  {
    label: "Total Members",
    value: "1,247",
    change: "+156 this month",
    icon: Users,
    color: "text-green-400",
  },
  {
    label: "Combined Treasury",
    value: "$1.8M",
    change: "+12.3% growth",
    icon: DollarSign,
    color: "text-purple-400",
  },
  {
    label: "Success Rate",
    value: "94%",
    change: "Project completion",
    icon: TrendingUp,
    color: "text-orange-400",
  },
]

export function SubDAOStats() {
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
