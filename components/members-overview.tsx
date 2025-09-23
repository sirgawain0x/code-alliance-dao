import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, UserPlus, Crown, Shield } from "lucide-react"

const memberStats = [
  {
    label: "Total Members",
    value: "1,247",
    change: "+156 this month",
    icon: Users,
    color: "text-blue-400",
  },
  {
    label: "New Members",
    value: "89",
    change: "This month",
    icon: UserPlus,
    color: "text-green-400",
  },
  {
    label: "Core Contributors",
    value: "45",
    change: "3.6% of total",
    icon: Crown,
    color: "text-purple-400",
  },
  {
    label: "Active Voters",
    value: "892",
    change: "71.5% participation",
    icon: Shield,
    color: "text-orange-400",
  },
]

const membersByRole = [
  { role: "Community Members", count: 856, percentage: 68.6 },
  { role: "Contributors", count: 234, percentage: 18.8 },
  { role: "Project Leads", count: 89, percentage: 7.1 },
  { role: "Core Contributors", count: 45, percentage: 3.6 },
  { role: "Council Members", count: 15, percentage: 1.2 },
  { role: "Administrators", count: 8, percentage: 0.6 },
]

const membersBySubDAO = [
  { subdao: "Innovation Labs DAO", members: 156, active: 89 },
  { subdao: "Community Fund DAO", members: 234, active: 178 },
  { subdao: "Startup Support Lab", members: 89, active: 67 },
  { subdao: "AI Research Collective", members: 45, active: 32 },
  { subdao: "DeFi Protocols DAO", members: 78, active: 56 },
  { subdao: "Sustainability Initiative", members: 123, active: 98 },
]

export function MembersOverview() {
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

      {/* Role Distribution & SubDAO Membership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Members by Role</h3>

            <div className="space-y-3">
              {membersByRole.map((role) => (
                <div key={role.role} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{role.role}</span>
                    <div className="text-right">
                      <span className="text-foreground font-medium">{role.count}</span>
                      <span className="text-muted-foreground ml-2">({role.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={role.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* SubDAO Membership */}
        <Card className="stat-card-gradient p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">SubDAO Membership</h3>

            <div className="space-y-3">
              {membersBySubDAO.map((subdao) => (
                <div
                  key={subdao.subdao}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{subdao.subdao}</h4>
                    <p className="text-xs text-muted-foreground">
                      {subdao.active} active of {subdao.members} total
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{subdao.members}</div>
                    <div className="text-xs text-green-400">
                      {((subdao.active / subdao.members) * 100).toFixed(0)}% active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
