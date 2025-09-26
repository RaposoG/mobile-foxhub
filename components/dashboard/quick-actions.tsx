"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target, FileText, Clock } from "lucide-react"

interface QuickActionsProps {
  onAction: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: "new-task",
      label: "Nova Tarefa",
      icon: Plus,
      description: "Criar uma nova tarefa",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "new-goal",
      label: "Nova Meta",
      icon: Target,
      description: "Definir uma nova meta",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "new-note",
      label: "Nova Nota",
      icon: FileText,
      description: "Criar uma nova nota",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "start-timer",
      label: "Iniciar Timer",
      icon: Clock,
      description: "Começar a cronometrar",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent bg-transparent"
                onClick={() => onAction(action.id)}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
