import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const chains = [
  {
    name: "Code Alliance Hub",
    description: "Native chain governance for Code Alliance.",
    value: "$0.00 est. USD value",
    proposals: "288 proposals",
    icon: "🚀",
    verified: true,
  },
  {
    name: "Innovation Labs",
    description: "Native chain governance for Innovation Labs.",
    value: "$0.00 est. USD value",
    proposals: "156 proposals",
    icon: "⚡",
    verified: true,
  },
  {
    name: "Tech Incubator",
    description: "Native chain governance for Tech Incubator.",
    value: "$0.00 est. USD value",
    proposals: "904 proposals",
    icon: "🔬",
    verified: true,
  },
  {
    name: "Startup Accelerator",
    description: "Native chain governance for Startup Accelerator.",
    value: "$0.00 est. USD value",
    proposals: "342 proposals",
    icon: "🎯",
    verified: true,
  },
]

export function ChainGovernance() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Chain governance</h2>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Find another chain
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chains.map((chain) => (
          <Card key={chain.name} className="stat-card-gradient p-6 dao-card-hover">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                    {chain.icon}
                  </div>
                  {chain.verified && (
                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">{chain.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{chain.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-2">💰</span>
                    {chain.value}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-2">📄</span>
                    {chain.proposals}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
