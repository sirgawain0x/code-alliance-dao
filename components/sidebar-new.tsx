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

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CA</span>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">Code Alliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileOpen(false)}
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
                className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
                  item.current ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>

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
