import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Plus, FileText, Users, DollarSign } from "lucide-react"

const requirements = [
  {
    icon: FileText,
    title: "Project Proposal",
    description: "Detailed project scope and objectives",
  },
  {
    icon: Users,
    title: "Team Formation",
    description: "Minimum 3 core contributors",
  },
  {
    icon: DollarSign,
    title: "Budget Request",
    description: "Initial funding requirements",
  },
]

export function CreateSubDAOCard() {
  return (
    <Card className="stat-card-gradient p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Create New SubDAO</h3>
            <p className="text-sm text-muted-foreground">Launch a specialized DAO for your project or initiative</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <a href="https://forms.gle/NUayP6QpKeX4ePxZ8" target="_blank" rel="noopener noreferrer">
              <Plus className="h-4 w-4 mr-2" />
              Start Application
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requirements.map((req) => (
            <div key={req.title} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <req.icon className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground text-sm">{req.title}</h4>
                <p className="text-xs text-muted-foreground">{req.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
