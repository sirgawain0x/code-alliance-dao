"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tv,
  Newspaper,
  Landmark,
  ExternalLink,
  Gift,
  Palette,
  Music,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import { useYeeters } from "@/hooks/useYeeters"
import { calcProgressPerc } from "@/utils/yeeter-data-helpers"
import { formatUnits } from "ethers"
import { Skeleton } from "@/components/ui/skeleton"
import { OFFCHAIN_ECOSYSTEM_PRODUCTS } from "@/config/offchain-ecosystem"

const OFFCHAIN_ICONS = {
  "creative-tv": Tv,
  "dear-creative": Newspaper,
  "creative-bank": Landmark,
  bitrewards: Gift,
  create: Palette,
  "beat-me": Music,
} as const

const BASE_CHAIN = "8453"

export function EcosystemGrid() {
  const { yeeters, isLoading, isError } = useYeeters({ chainid: BASE_CHAIN, filter: "all" })

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">On-chain fundraises</h2>
          <p className="text-sm text-muted-foreground">
            Yeeter campaigns indexed from the DAOhaus subgraph on Base.
          </p>
        </div>
        {isError ? (
          <p className="text-sm text-muted-foreground">Could not load yeeter campaigns (check graph key).</p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} className="stat-card-gradient p-6 space-y-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))
            : (yeeters || []).slice(0, 12).map((y) => {
                const now = Date.now() / 1000
                const ended = Number(y.endTime) < now
                const active = Number(y.startTime) < now && Number(y.endTime) > now
                const soon = Number(y.startTime) > now
                const progress = Math.min(100, Math.round(calcProgressPerc(y.balance, y.goal)))
                const raised = Number(formatUnits(y.balance, 18))
                const goal = Number(formatUnits(y.goal, 18))
                return (
                  <Card key={y.id} className="stat-card-gradient p-6 dao-card-hover border-border/50">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Rocket className="h-8 w-8" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {active ? "Active" : ended ? "Ended" : soon ? "Soon" : "Campaign"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground line-clamp-1">{y.dao?.name || "Yeeter"}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Goal {goal.toLocaleString(undefined, { maximumFractionDigits: 2 })} · Raised{" "}
                          {raised.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end border-t border-border/50">
                        <Button asChild variant="ghost" size="sm" className="gap-2">
                          <Link href={`/projects/${y.id.toLowerCase()}`}>
                            View campaign
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Creative platforms</h2>
          <p className="text-sm text-muted-foreground">Products and experiences across the Creative ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFCHAIN_ECOSYSTEM_PRODUCTS.map((project) => {
            const Icon = OFFCHAIN_ICONS[project.id as keyof typeof OFFCHAIN_ICONS] || Tv
            return (
              <Card
                key={project.id}
                className="stat-card-gradient p-6 dao-card-hover group relative overflow-hidden border-border/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-secondary/50 text-primary border border-border">
                      <Icon className="h-8 w-8" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                      {project.category}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="gap-2">
                      <Link href={`/projects/${project.id}`}>
                        Details
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
