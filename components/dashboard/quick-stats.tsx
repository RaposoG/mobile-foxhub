"use client"

import { useTodos } from "@/hooks/use-todos"
import { useGoals } from "@/hooks/use-goals"
import { useTimeEntries } from "@/hooks/use-time-tracker"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Target, Clock, TrendingUp } from "lucide-react"

export function QuickStats() {
  const { data: todos = [] } = useTodos()
  const { data: goals = [] } = useGoals()
  const { data: timeEntries = [] } = useTimeEntries()

  const completedTasks = todos.filter((todo) => todo.completed).length
  const completionRate = todos.length > 0 ? Math.round((completedTasks / todos.length) * 100) : 0

  const activeGoals = goals.filter((goal) => !goal.completed).length
  const completedGoals = goals.filter((goal) => goal.completed).length

  const todayTime = timeEntries
    .filter((entry) => {
      const entryDate = new Date(entry.createdAt).toDateString()
      const today = new Date().toDateString()
      return entryDate === today
    })
    .reduce((total, entry) => total + entry.duration, 0)

  const weeklyAverage = Math.round(
    timeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return entryDate >= weekAgo
      })
      .reduce((total, entry) => total + entry.duration, 0) / 7,
  )

  const stats = [
    {
      label: "Taxa de Conclusão",
      value: `${completionRate}%`,
      progress: completionRate,
      icon: CheckCircle,
      color: "text-green-500",
      description: `${completedTasks}/${todos.length} tarefas`,
    },
    {
      label: "Metas Ativas",
      value: activeGoals,
      progress: activeGoals > 0 ? 100 : 0,
      icon: Target,
      color: "text-purple-500",
      description: `${completedGoals} concluídas`,
    },
    {
      label: "Tempo Hoje",
      value: `${Math.round(todayTime / 60)}h`,
      progress: Math.min((todayTime / (8 * 60)) * 100, 100),
      icon: Clock,
      color: "text-blue-500",
      description: `${todayTime}min registrados`,
    },
    {
      label: "Média Semanal",
      value: `${Math.round(weeklyAverage / 60)}h`,
      progress: Math.min((weeklyAverage / (8 * 60)) * 100, 100),
      icon: TrendingUp,
      color: "text-orange-500",
      description: `${weeklyAverage}min/dia`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                <span className="text-lg md:text-xl font-bold">{stat.value}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</p>
                <Progress value={stat.progress} className="h-1 md:h-2" />
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
