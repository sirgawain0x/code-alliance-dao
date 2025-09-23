import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const featuredDAOs = [
  {
    name: "Code Alliance DAO",
    description: "Main governance DAO for the Code Alliance Incubator ecosystem.",
    icon: "🏛️",
    verified: true,
    type: "Parent DAO",
  },
  {
    name: "Innovation Labs DAO",
    description: "SubDAO focused on breakthrough technology research and development.",
    icon: "🔬",
    verified: true,
    type: "SubDAO",
  },
  {
    name: "Startup Support Lab",
    description: "SubDAO providing resources and mentorship for early-stage startups.",
    icon: "🚀",
    verified: true,
    type: "SubDAO",
  },
  {
    name: "Community Fund DAO",
    description: "SubDAO managing community grants and educational initiatives.",
    icon: "🎓",
    verified: true,
    type: "SubDAO",
  },
]

export function FeaturedDAOs() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Featured DAOs</h2>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Find another DAO
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredDAOs.map((dao) => (
          <Card key={dao.name} className="stat-card-gradient p-6 dao-card-hover cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                    {dao.icon}
                  </div>
                  {dao.verified && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                      ✓
                    </Badge>
                  )}
                </div>
                <Badge variant={dao.type === "Parent DAO" ? "default" : "secondary"} className="text-xs">
                  {dao.type}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">{dao.name}</h3>
                <p className="text-sm text-muted-foreground">{dao.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
