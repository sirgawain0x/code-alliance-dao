import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign, Users, Clock, Settings } from "lucide-react"

interface ProjectDetailProps {
  projectId: string
}

// Mock data - in real app this would come from API
const projectData = {
  id: "proj-001",
  name: "Quantum Computing Framework",
  description: "Development of quantum computing algorithms and frameworks for distributed systems",
  fullDescription: `This project aims to develop a comprehensive quantum computing framework that can be used across various distributed systems. The framework will include quantum algorithms, simulation tools, and integration capabilities with existing infrastructure.

## Objectives
- Develop quantum algorithms for distributed computing
- Create simulation and testing tools
- Build integration APIs for existing systems
- Establish performance benchmarks

## Technical Approach
- Quantum circuit design and optimization
- Distributed quantum computing protocols
- Classical-quantum hybrid algorithms
- Performance analysis and benchmarking

## Expected Outcomes
- Open-source quantum computing framework
- Research publications and documentation
- Community adoption and contributions
- Integration with partner organizations`,
  category: "AI/ML Research",
  subDAO: "Innovation Labs DAO",
  status: "active",
  priority: "high",
  progress: 75,
  budget: 45000,
  spent: 33750,
  team: [
    { name: "Dr. Alice Chen", role: "Project Lead", avatar: "AC", contributions: 234 },
    { name: "Bob Martinez", role: "Senior Developer", avatar: "BM", contributions: 189 },
    { name: "Carol Kim", role: "Research Scientist", avatar: "CK", contributions: 156 },
    { name: "David Wilson", role: "QA Engineer", avatar: "DW", contributions: 98 },
  ],
  deadline: "2024-06-15",
  startDate: "2024-01-15",
  daysLeft: 45,
  milestones: [
    { name: "Research Phase", status: "completed", dueDate: "2024-02-15", progress: 100 },
    { name: "Algorithm Development", status: "completed", dueDate: "2024-03-30", progress: 100 },
    { name: "Framework Implementation", status: "active", dueDate: "2024-05-15", progress: 80 },
    { name: "Testing & Optimization", status: "pending", dueDate: "2024-06-01", progress: 0 },
    { name: "Documentation & Release", status: "pending", dueDate: "2024-06-15", progress: 0 },
  ],
  lastUpdate: "2 days ago",
}

const projectUpdates = [
  {
    date: "2024-04-20",
    author: "Dr. Alice Chen",
    title: "Framework Core Implementation Complete",
    content:
      "Successfully completed the core quantum computing framework implementation. All major algorithms are now functional and tested.",
    type: "milestone",
  },
  {
    date: "2024-04-18",
    author: "Bob Martinez",
    title: "Performance Optimization Results",
    content: "Latest optimization efforts have improved algorithm performance by 35%. Ready to move to testing phase.",
    type: "update",
  },
  {
    date: "2024-04-15",
    author: "Carol Kim",
    title: "Research Paper Submitted",
    content: "Submitted our research findings to the International Quantum Computing Conference. Awaiting peer review.",
    type: "achievement",
  },
]

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const budgetUsed = (projectData.spent / projectData.budget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{projectData.status}</Badge>
            <Badge variant="outline">{projectData.category}</Badge>
            <Badge variant="secondary">{projectData.priority} priority</Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{projectData.name}</h1>
          <p className="text-muted-foreground">{projectData.description}</p>
          <p className="text-sm text-muted-foreground">SubDAO: {projectData.subDAO}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>Update Status</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-foreground">{projectData.progress}%</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Used</p>
              <p className="text-2xl font-bold text-foreground">{budgetUsed.toFixed(0)}%</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-bold text-foreground">{projectData.team.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
        <Card className="stat-card-gradient p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Days Left</p>
              <p className="text-2xl font-bold text-foreground">{projectData.daysLeft}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Project Description</h3>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground">{projectData.fullDescription}</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="stat-card-gradient p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Project Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="text-foreground">{projectData.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="text-foreground">{projectData.deadline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className="text-foreground">{projectData.daysLeft} days</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="stat-card-gradient p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Budget</span>
                    <span className="text-foreground">${projectData.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="text-foreground">${projectData.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="text-foreground">
                      ${(projectData.budget - projectData.spent).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={budgetUsed} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Project Milestones</h3>

              <div className="space-y-4">
                {projectData.milestones.map((milestone, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{milestone.name}</h4>
                      <Badge
                        variant={
                          milestone.status === "completed"
                            ? "default"
                            : milestone.status === "active"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {milestone.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Due: {milestone.dueDate}</span>
                      <span>Progress: {milestone.progress}%</span>
                    </div>

                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                <Button size="sm">Add Member</Button>
              </div>

              <div className="space-y-4">
                {projectData.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{member.contributions}</p>
                      <p className="text-xs text-muted-foreground">contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Budget Breakdown</h3>
              <p className="text-muted-foreground">Detailed budget allocation and spending analysis.</p>
              {/* Add budget breakdown content here */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card className="stat-card-gradient p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Project Updates</h3>
                <Button size="sm">Add Update</Button>
              </div>

              <div className="space-y-4">
                {projectUpdates.map((update, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{update.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {update.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{update.date}</span>
                    </div>
                    <h4 className="font-medium text-foreground">{update.title}</h4>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
