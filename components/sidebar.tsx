"use client"

import React, { useState } from "react"
import { Home, Plus, FileText, ExternalLink, Building2, Vote, FolderOpen, Wallet, Users, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navigation = [
  { name: "Home", icon: Home, current: false, href: "/" },
  { name: "Parent DAO", icon: Building2, current: false, href: "/parent-dao" },
  { name: "SubDAOs", icon: Building2, current: false, href: "/subdaos" },
  { name: "Governance", icon: Vote, current: false, href: "/governance" },
  { name: "Projects", icon: FolderOpen, current: false, href: "/projects" },
  { name: "Treasury", icon: Wallet, current: false, href: "/treasury" },
  { name: "Members", icon: Users, current: true, href: "/members" },
  { name: "Create", icon: Plus, current: false, href: "/create" },
]

const external = [
  { name: "Documentation", icon: FileText },
  { name: "Discord", icon: ExternalLink },
  { name: "GitHub", icon: ExternalLink },
  { name: "Status", icon: ExternalLink },
]

import { useDaos } from "@/hooks/useDaos"

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { dao } = useDaos({
    chainid: "8453",
  });

  return (
    <>
      {/* Mobile menu button - only show when sidebar is closed */}
      {!isMobileOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 border-r border-sidebar-border z-[50] transform transition-transform duration-300 ease-in-out shadow-2xl bg-sidebar bg-card ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:z-auto md:flex-shrink-0 md:shadow-none`}
        style={{ 
          backgroundColor: 'hsl(var(--sidebar) / 1)',
          opacity: 1 
        }}
      >
        <div 
          className="flex flex-col h-full relative bg-sidebar bg-card w-full"
          style={{ 
            backgroundColor: 'hsl(var(--sidebar) / 1)',
            opacity: 1 
          }}
        >
          {/* Logo with Close Button - Mobile Only */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {process.env.NEXT_PUBLIC_DAO_AVATAR_URL ? (
                <img
                  src={process.env.NEXT_PUBLIC_DAO_AVATAR_URL}
                  alt={dao?.name || "DAO"}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">CA</span>
                </div>
              )}
              <span className="text-lg font-semibold text-sidebar-foreground truncate">{dao?.name || "Code Alliance"}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              {/* Close button - Mobile Only */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMobileOpen(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-background/50 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${item.current ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                  }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Connect Wallet - Mobile Only */}
          <div className="px-6 py-4 border-t border-sidebar-border md:hidden">
            <appkit-button />
          </div>

          {/* External Links */}
          <div className="px-6 py-4 border-t border-sidebar-border">
            <div className="space-y-1">
              {external.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
