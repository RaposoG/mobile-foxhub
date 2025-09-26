"use client"

import { useState } from "react"
import { useGoals, useUpdateGoal } from "@/hooks/use-goals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Calendar, TrendingUp } from "lucide-react"
import { CreateGoalDialog } from "./create-goal-dialog"
import type { Goal } from "@/types/productivity"

export function GoalsList() {
  const { data: goals = [], isLoading } = useGoals()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const updateGoal = useUpdateGoal()

  const activeGoals = goals.filter((goal: Goal) => !goal.completed)
  const completedGoals = goals.filter((goal: Goal) => goal.completed)

  const handleProgressUpdate = async (goalId: string, newValue: number) => {
    const goal = goals.find((g: Goal) => g.id === goalId)
    if (!goal) return

    const completed = newValue >= goal.targetValue
    await updateGoal.mutateAsync({
      id: goalId,
      updates: { currentValue: newValue, completed },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando metas...</p>
        </div>
      </div>
    )
  }

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed

    return (
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                {goal.title}
              </CardTitle>
              {goal.description && <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>}
            </div>
            <Badge variant={goal.completed ? "default" : "secondary"} className="text-xs">
              {goal.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% concluído</span>
              {goal.deadline && (
                <span className={isOverdue ? "text-destructive" : ""}>
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </div>

          {!goal.completed && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProgressUpdate(goal.id, goal.currentValue + 1)}
                disabled={updateGoal.isPending}
                className="flex-1 min-w-0"
              >
                +1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProgressUpdate(goal.id, goal.currentValue + 5)}
                disabled={updateGoal.isPending}
                className="flex-1 min-w-0"
              >
                +5
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleProgressUpdate(goal.id, goal.targetValue)}
                disabled={updateGoal.isPending}
                className="flex-1 min-w-0"
              >
                Concluir
              </Button>
            </div>
          )}

          {goal.completed && (
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Meta concluída!</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Metas</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">
            {activeGoals.length} ativas • {completedGoals.length} concluídas
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Metas Ativas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeGoals.map((goal: Goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Metas Concluídas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedGoals.map((goal: Goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-6 md:p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Nenhuma meta ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie sua primeira meta para começar a acompanhar seu progresso
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Criar primeira meta</Button>
          </CardContent>
        </Card>
      )}

      <CreateGoalDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
