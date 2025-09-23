import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 md:px-6 pl-20 md:pl-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">All chains</span>
            <Badge variant="secondary" className="text-xs">
              15
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">
              All
            </Badge>
            <Badge variant="outline" className="text-xs">
              30d
            </Badge>
            <Badge variant="outline" className="text-xs">
              7d
            </Badge>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Log in</Button>
      </div>
    </header>
  )
}
