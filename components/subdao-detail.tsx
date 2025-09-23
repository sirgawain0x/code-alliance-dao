import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, FileText, Settings, TrendingUp, Clock } from "lucide-react"

interface SubDAODetailProps {
  subDAOId: string
}

// Mock data - in real app this would come from API
const subDAOData = {
  name: "Innovation Labs DAO",
  description: "Breakthrough technology research and development focused on emerging technologies",
  type: "Research",
  status: "active",
  created: "March 2024",
  members: 156,
  treasury: "$320,000",
  projects: 12,
  completion: 85,
  icon: "🔬",
  governance: "Token-based",
}

const projects = [
  {
    id: 1,
    name: "Quantum Computing Framework",
    status: "active",
    progress: 75,
    budget: "$45K",
    team: 8,
    deadline: "Q2 2024",
  },
  {
    id: 2,
    name: "Neural Network Optimization",
    status: "completed",
    progress: 100,
    budget: "$32K",
    team: 5,
    deadline: "Q1 2024",
  },
  {
    id: 3,
    name: "Blockchain Scalability Research",
    status: "planning",
    progress: 15,
    budget: "$60K",
    team: 12,
    deadline: "Q3 2024",
  },
]

const members = [
  { name: "Dr. Alice Chen", role: "Lead Researcher", reputation: 95, contributions: 234 },
  { name: "Bob Martinez", role: "Senior Developer", reputation: 88, contributions: 189 },
  { name: "Carol Kim", role: "Project Manager", reputation: 92, contributions: 156 },
  { name: "David Wilson", role: "Research Analyst", reputation: 76, contributions: 98 },
]

export function SubDAODetail({ subDAOId }: SubDAODetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl">
            {subDAOData.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{subDAOData.name}</h1>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{subDAOData.status}</Badge>
            </div>
            <p className="text-muted-foreground mb-2">{subDAOData.description}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Created {subDAOData.created}</span>
              <span>•</span>
              <span>{subDAOData.governance} governance</span>
              <span>•</span>
              <span>{subDAOData.type} SubDAO</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>Create Proposal</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold text-foreground">{subDAOData.members}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Treasury</p>
              <p className="text-2xl font-bold text-foreground">{subDAOData.treasury}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold text-foreground">{subDAOData.projects}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">{subDAOData.completion}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Active Projects</h3>
                <Button size="sm">New Project</Button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {project.budget}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {project.team} members
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {project.deadline}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === "completed"
                            ? "default"
                            : project.status === "active"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">SubDAO Members</h3>
                <Button size="sm">Invite Members</Button>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">Reputation: {member.reputation}</p>
                      <p className="text-xs text-muted-foreground">{member.contributions} contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Governance Overview</h3>
              <p className="text-muted-foreground">
                This SubDAO uses token-based governance with reputation weighting for technical decisions.
              </p>
              {/* Add governance content here */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="treasury" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Treasury Management</h3>
              <p className="text-muted-foreground">Current treasury balance and fund allocation details.</p>
              {/* Add treasury content here */}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
