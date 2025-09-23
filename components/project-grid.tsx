import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign, AlertTriangle } from "lucide-react"

const projects = [
  {
    id: "proj-001",
    name: "Quantum Computing Framework",
    description: "Development of quantum computing algorithms and frameworks for distributed systems",
    category: "AI/ML Research",
    subDAO: "Innovation Labs DAO",
    status: "active",
    priority: "high",
    progress: 75,
    budget: "$45,000",
    spent: "$33,750",
    team: [
      { name: "Alice Chen", role: "Lead" },
      { name: "Bob Martinez", role: "Dev" },
      { name: "Carol Kim", role: "Research" },
    ],
    deadline: "2024-06-15",
    daysLeft: 45,
    milestones: { completed: 3, total: 5 },
    lastUpdate: "2 days ago",
  },
  {
    id: "proj-002",
    name: "Community Education Platform",
    description: "Interactive learning platform for blockchain and DAO governance education",
    category: "Education",
    subDAO: "Community Fund DAO",
    status: "active",
    priority: "medium",
    progress: 60,
    budget: "$28,000",
    spent: "$16,800",
    team: [
      { name: "David Wilson", role: "Lead" },
      { name: "Eva Rodriguez", role: "Design" },
    ],
    deadline: "2024-07-30",
    daysLeft: 90,
    milestones: { completed: 2, total: 4 },
    lastUpdate: "1 day ago",
  },
  {
    id: "proj-003",
    name: "DeFi Protocol Integration",
    description: "Integration of multiple DeFi protocols for treasury management optimization",
    category: "Blockchain Development",
    subDAO: "DeFi Protocols DAO",
    status: "at-risk",
    priority: "high",
    progress: 35,
    budget: "$60,000",
    spent: "$42,000",
    team: [
      { name: "Frank Thompson", role: "Lead" },
      { name: "Grace Liu", role: "Smart Contracts" },
      { name: "Henry Park", role: "Security" },
    ],
    deadline: "2024-05-20",
    daysLeft: 15,
    milestones: { completed: 1, total: 4 },
    lastUpdate: "5 hours ago",
  },
  {
    id: "proj-004",
    name: "Sustainability Metrics Dashboard",
    description: "Real-time dashboard for tracking environmental impact of DAO operations",
    category: "Infrastructure",
    subDAO: "Sustainability Initiative",
    status: "completed",
    priority: "medium",
    progress: 100,
    budget: "$22,000",
    spent: "$21,500",
    team: [
      { name: "Iris Johnson", role: "Lead" },
      { name: "Jack Brown", role: "Data" },
    ],
    deadline: "2024-03-15",
    daysLeft: 0,
    milestones: { completed: 3, total: 3 },
    lastUpdate: "1 week ago",
  },
  {
    id: "proj-005",
    name: "Startup Mentorship Network",
    description: "Platform connecting experienced entrepreneurs with early-stage startups",
    category: "Community Initiatives",
    subDAO: "Startup Support Lab",
    status: "active",
    priority: "medium",
    progress: 85,
    budget: "$35,000",
    spent: "$29,750",
    team: [
      { name: "Kelly Davis", role: "Lead" },
      { name: "Liam Wilson", role: "Community" },
      { name: "Maya Patel", role: "Operations" },
    ],
    deadline: "2024-08-10",
    daysLeft: 120,
    milestones: { completed: 4, total: 5 },
    lastUpdate: "3 days ago",
  },
  {
    id: "proj-006",
    name: "AI Ethics Framework",
    description: "Comprehensive framework for ethical AI development and deployment",
    category: "AI/ML Research",
    subDAO: "AI Research Collective",
    status: "planning",
    priority: "high",
    progress: 15,
    budget: "$50,000",
    spent: "$7,500",
    team: [
      { name: "Nina Garcia", role: "Lead" },
      { name: "Oscar Lee", role: "Ethics" },
    ],
    deadline: "2024-09-30",
    daysLeft: 180,
    milestones: { completed: 0, total: 6 },
    lastUpdate: "1 day ago",
  },
]

export function ProjectGrid() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "at-risk":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "planning":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">All Projects</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="stat-card-gradient p-6 dao-card-hover cursor-pointer">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                    {project.status === "at-risk" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                  </div>
                  <h4 className="font-semibold text-foreground">{project.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <p className="text-xs text-muted-foreground">{project.subDAO}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Milestones: {project.milestones.completed}/{project.milestones.total}
                  </span>
                  <span className={getPriorityColor(project.priority)}>{project.priority} priority</span>
                </div>
              </div>

              {/* Team */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team</span>
                  <span className="text-xs text-muted-foreground">{project.team.length} members</span>
                </div>
                <div className="flex items-center space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>Budget</span>
                  </div>
                  <div className="text-foreground font-medium">{project.budget}</div>
                  <div className="text-muted-foreground">Spent: {project.spent}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Deadline</span>
                  </div>
                  <div className="text-foreground font-medium">
                    {project.status === "completed" ? "Completed" : `${project.daysLeft} days`}
                  </div>
                  <div className="text-muted-foreground">Updated {project.lastUpdate}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
