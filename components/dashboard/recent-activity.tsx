"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, Target } from "lucide-react"

interface Activity {
  id: string
  type: "task" | "goal" | "note"
  title: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "in-progress"
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string, status: string) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (type === "goal") return <Target className="h-4 w-4 text-purple-500" />
    if (status === "in-progress") return <Clock className="h-4 w-4 text-orange-500" />
    return <Circle className="h-4 w-4 text-muted-foreground" />
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      "in-progress": "outline",
    } as const

    const labels = {
      completed: "Concluído",
      pending: "Pendente",
      "in-progress": "Em andamento",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              {getIcon(activity.type, activity.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
