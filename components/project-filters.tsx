import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"

const activeFilters = [
  { label: "Active", type: "status" },
  { label: "AI/ML Research", type: "category" },
]

export function ProjectFilters() {
  return (
    <Card className="stat-card-gradient p-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10 bg-muted border-border" />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-32 bg-muted border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40 bg-muted border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai-ml">AI/ML Research</SelectItem>
                <SelectItem value="blockchain">Blockchain Development</SelectItem>
                <SelectItem value="community">Community Initiatives</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32 bg-muted border-border">
                <SelectValue placeholder="SubDAO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SubDAOs</SelectItem>
                <SelectItem value="innovation">Innovation Labs</SelectItem>
                <SelectItem value="startup">Startup Support</SelectItem>
                <SelectItem value="community">Community Fund</SelectItem>
                <SelectItem value="ai">AI Research</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {filter.label}
              <button className="ml-1 hover:text-foreground">×</button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-xs">
            Clear all
          </Button>
        </div>
      )}
    </Card>
  )
}
