import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Folder, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const projectStats = [
  {
    label: "Total Projects",
    value: "47",
    change: "+8 this month",
    icon: Folder,
    color: "text-blue-400",
  },
  {
    label: "Active Projects",
    value: "32",
    change: "68% of total",
    icon: Clock,
    color: "text-orange-400",
  },
  {
    label: "Completed",
    value: "12",
    change: "85% success rate",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    label: "At Risk",
    value: "3",
    change: "Need attention",
    icon: AlertTriangle,
    color: "text-red-400",
  },
]

const projectsByCategory = [
  { category: "AI/ML Research", count: 12, percentage: 25 },
  { category: "Blockchain Development", count: 8, percentage: 17 },
  { category: "Community Initiatives", count: 10, percentage: 21 },
  { category: "Infrastructure", count: 7, percentage: 15 },
  { category: "Education", count: 6, percentage: 13 },
  { category: "Other", count: 4, percentage: 9 },
]

export function ProjectsOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat) => (
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

      {/* Project Categories */}
      <Card className="stat-card-gradient p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Projects by Category</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsByCategory.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{category.category}</span>
                  <span className="text-foreground">{category.count} projects</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">{category.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
