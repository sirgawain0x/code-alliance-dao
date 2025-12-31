import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, TrendingUp, Settings } from "lucide-react"

const subDAOs = [
  {
    id: "innovation-labs",
    name: "Innovation Labs DAO",
    description: "Breakthrough technology research and development",
    type: "Research",
    status: "active",
    members: 156,
    treasury: "$320K",
    projects: 12,
    completion: 85,
    icon: "🔬",
    governance: "Token-based",
  },
  {
    id: "startup-support",
    name: "Startup Support Lab",
    description: "Resources and mentorship for early-stage startups",
    type: "Incubation",
    status: "active",
    members: 89,
    treasury: "$180K",
    projects: 8,
    completion: 92,
    icon: "🚀",
    governance: "Reputation-based",
  },
  {
    id: "community-fund",
    name: "Community Fund DAO",
    description: "Community grants and educational initiatives",
    type: "Grants",
    status: "active",
    members: 234,
    treasury: "$450K",
    projects: 15,
    completion: 78,
    icon: "🎓",
    governance: "Hybrid",
  },
  {
    id: "ai-research",
    name: "AI Research Collective",
    description: "Artificial intelligence and machine learning projects",
    type: "Research",
    status: "pending",
    members: 45,
    treasury: "$0",
    projects: 0,
    completion: 0,
    icon: "🤖",
    governance: "Token-based",
  },
  {
    id: "defi-protocols",
    name: "DeFi Protocols DAO",
    description: "Decentralized finance protocol development",
    type: "Development",
    status: "active",
    members: 78,
    treasury: "$280K",
    projects: 6,
    completion: 67,
    icon: "💰",
    governance: "Token-based",
  },
  {
    id: "sustainability",
    name: "Sustainability Initiative",
    description: "Environmental and social impact projects",
    type: "Impact",
    status: "active",
    members: 123,
    treasury: "$150K",
    projects: 9,
    completion: 88,
    icon: "🌱",
    governance: "Reputation-based",
  },
]

export function SubDAOGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">All SubDAOs</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
            Filter
          </Button>
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 active:scale-95">
            Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subDAOs.map((subdao) => (
          <Card key={subdao.id} className="stat-card-gradient p-6 dao-card-hover cursor-pointer">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                    {subdao.icon}
                  </div>
                  <div>
                    <Badge variant={subdao.status === "active" ? "default" : "secondary"} className="text-xs mb-1">
                      {subdao.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs ml-1">
                      {subdao.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-110 active:scale-95">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">{subdao.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{subdao.description}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Governance</span>
                    <span className="text-foreground">{subdao.governance}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <Users className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                  <p className="text-foreground font-medium">{subdao.members}</p>
                  <p className="text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-400" />
                  <p className="text-foreground font-medium">{subdao.treasury}</p>
                  <p className="text-muted-foreground">Treasury</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                  <p className="text-foreground font-medium">{subdao.projects}</p>
                  <p className="text-muted-foreground">Projects</p>
                </div>
              </div>

              {/* Progress */}
              {subdao.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Project Completion</span>
                    <span className="text-foreground">{subdao.completion}%</span>
                  </div>
                  <Progress value={subdao.completion} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  View Details
                </Button>
                {subdao.status === "active" && (
                  <Button
                    size="sm"
                    className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Manage
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
