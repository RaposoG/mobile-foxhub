"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Clock,
  Zap,
  FileText,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: Home, shortcut: ["⌘", "1"] },
  { id: "todos", label: "Tarefas", icon: CheckSquare, shortcut: ["⌘", "2"] },
  { id: "calendar", label: "Calendário", icon: Calendar, shortcut: ["⌘", "3"] },
  { id: "goals", label: "Metas", icon: Target, shortcut: ["⌘", "4"] },
  { id: "time-tracker", label: "Tempo", icon: Clock, shortcut: ["⌘", "5"] },
  { id: "notes", label: "Notas", icon: FileText, shortcut: ["⌘", "6"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, shortcut: ["⌘", "7"] },
  { id: "productivity", label: "Produtividade", icon: Zap, shortcut: ["⌘", "8"] },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div
      className={cn(
        "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="font-bold text-sidebar-foreground">FoxHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Command Palette Hint */}
      {!collapsed && (
        <div className="p-2">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground hover:bg-sidebar-accent bg-transparent border-sidebar-border"
            onClick={() => {
              // This would trigger the command palette
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true })
              document.dispatchEvent(event)
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="flex-1 text-left">Buscar...</span>
            <KeyboardShortcut keys={["⌘", "K"]} />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                collapsed && "px-2 justify-center",
                activeTab === item.id && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <KeyboardShortcut keys={item.shortcut} className="opacity-60" />
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="p-2 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                collapsed && "px-2 justify-center",
              )}
            >
              <Avatar className={cn("h-6 w-6", !collapsed && "mr-2")}>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-xs">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onTabChange("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
