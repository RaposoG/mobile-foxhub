"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { CommandPalette } from "@/components/layout/command-palette"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ProductivityChart } from "@/components/dashboard/productivity-chart"
import { useToast } from "@/hooks/use-toast"
import { TodoList } from "@/components/todos/todo-list"
import { GoalsList } from "@/components/goals/goals-list"
import { TimeTracker } from "@/components/time-tracker/time-tracker"
import { NotesList } from "@/components/notes/notes-list"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { SettingsPage } from "@/components/settings/settings-page"
import { CalendarView } from "@/components/calendar/calendar-view"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { mockActivities, mockChartData } from "@/lib/mock-data"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setActiveTab("dashboard")
            break
          case "2":
            e.preventDefault()
            setActiveTab("todos")
            break
          case "3":
            e.preventDefault()
            setActiveTab("calendar")
            break
          case "4":
            e.preventDefault()
            setActiveTab("goals")
            break
          case "5":
            e.preventDefault()
            setActiveTab("time-tracker")
            break
          case "6":
            e.preventDefault()
            setActiveTab("notes")
            break
          case "7":
            e.preventDefault()
            setActiveTab("analytics")
            break
          case "8":
            e.preventDefault()
            setActiveTab("productivity")
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-task":
        setActiveTab("todos")
        toast({
          title: "Redirecionando",
          description: "Indo para a seção de tarefas...",
        })
        break
      case "new-goal":
        setActiveTab("goals")
        toast({
          title: "Redirecionando",
          description: "Indo para a seção de metas...",
        })
        break
      case "new-note":
        setActiveTab("notes")
        toast({
          title: "Redirecionando",
          description: "Indo para a seção de notas...",
        })
        break
      case "start-timer":
        setActiveTab("time-tracker")
        toast({
          title: "Redirecionando",
          description: "Indo para o cronômetro...",
        })
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <LoadingSpinner size="lg" className="border-primary-foreground border-t-transparent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Carregando FoxHub</h2>
            <p className="text-muted-foreground">Preparando sua experiência...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Olá, {user.name}! 👋</h1>
              <p className="text-muted-foreground mt-2">Aqui está um resumo da sua produtividade hoje.</p>
            </div>

            <QuickStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductivityChart data={mockChartData} />
              </div>
              <div className="space-y-6">
                <QuickActions onAction={handleQuickAction} />
              </div>
            </div>

            <RecentActivity activities={mockActivities} />
          </div>
        )
      case "todos":
        return <TodoList />
      case "calendar":
        return <CalendarView />
      case "goals":
        return <GoalsList />
      case "time-tracker":
        return <TimeTracker />
      case "notes":
        return <NotesList />
      case "analytics":
        return <AnalyticsDashboard />
      case "settings":
        return <SettingsPage />
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Em Desenvolvimento</h2>
              <p className="text-muted-foreground">Esta seção está sendo construída...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-bold text-foreground">FoxHub</span>
            </div>
            <MobileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>
      <CommandPalette onNavigate={setActiveTab} />
    </>
  )
}
