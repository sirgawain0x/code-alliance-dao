import { Card } from "@/components/ui/card"
import { TrendingUp, FileText, Vote, Users } from "lucide-react"

const stats = [
  {
    label: "DAOs",
    value: "4",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    label: "Proposals",
    value: "100",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    label: "Votes cast",
    value: "1000",
    icon: Vote,
    color: "text-purple-400",
  },
  {
    label: "Unique voters",
    value: "40",
    icon: Users,
    color: "text-orange-400",
  },
]

const additionalStats = [
  {
    label: "TVL",
    value: "$97,097,765.47",
    icon: TrendingUp,
  },
  {
    label: "Chains",
    value: "1",
    icon: FileText,
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="stat-card-gradient p-6 dao-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
