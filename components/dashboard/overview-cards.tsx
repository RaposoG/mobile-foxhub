"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, Target, TrendingUp } from "lucide-react"

interface OverviewCardsProps {
  stats: {
    totalTasks: number
    completedTasks: number
    activeGoals: number
    productivityScore: number
  }
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      title: "Tarefas Totais",
      value: stats.totalTasks,
      icon: CheckSquare,
      description: `${stats.completedTasks} concluídas`,
      color: "text-blue-500",
    },
    {
      title: "Tarefas Concluídas",
      value: stats.completedTasks,
      icon: Clock,
      description: `${Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}% do total`,
      color: "text-green-500",
    },
    {
      title: "Metas Ativas",
      value: stats.activeGoals,
      icon: Target,
      description: "Em progresso",
      color: "text-purple-500",
    },
    {
      title: "Produtividade",
      value: `${stats.productivityScore}%`,
      icon: TrendingUp,
      description: "Esta semana",
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
