"use client"

import { useTodos } from "@/hooks/use-todos"
import { useGoals } from "@/hooks/use-goals"
import { useTimeEntries } from "@/hooks/use-time-tracker"
import { useNotes } from "@/hooks/use-notes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { CheckSquare, Target, Clock, FileText, TrendingUp, Calendar } from "lucide-react"

export function AnalyticsDashboard() {
  const { data: todos = [] } = useTodos()
  const { data: goals = [] } = useGoals()
  const { data: timeEntries = [] } = useTimeEntries()
  const { data: notes = [] } = useNotes()

  // Calculate statistics
  const completedTasks = todos.filter((todo) => todo.completed).length
  const completionRate = todos.length > 0 ? Math.round((completedTasks / todos.length) * 100) : 0

  const completedGoals = goals.filter((goal) => goal.completed).length
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0

  const totalTimeThisWeek = timeEntries
    .filter((entry) => {
      const entryDate = new Date(entry.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    })
    .reduce((total, entry) => total + entry.duration, 0)

  // Task completion by category
  const tasksByCategory = todos.reduce(
    (acc, todo) => {
      if (!acc[todo.category]) {
        acc[todo.category] = { total: 0, completed: 0 }
      }
      acc[todo.category].total++
      if (todo.completed) {
        acc[todo.category].completed++
      }
      return acc
    },
    {} as Record<string, { total: number; completed: number }>,
  )

  const categoryData = Object.entries(tasksByCategory).map(([category, data]) => ({
    category,
    total: data.total,
    completed: data.completed,
    rate: Math.round((data.completed / data.total) * 100),
  }))

  // Time tracking by category
  const timeByCategory = timeEntries.reduce(
    (acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.duration
      return acc
    },
    {} as Record<string, number>,
  )

  const timeData = Object.entries(timeByCategory).map(([category, minutes]) => ({
    category,
    hours: Math.round((minutes / 60) * 10) / 10,
  }))

  // Priority distribution
  const priorityData = todos.reduce(
    (acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    name: priority === "high" ? "Alta" : priority === "medium" ? "Média" : "Baixa",
    value: count,
    color: priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#10b981",
  }))

  // Weekly productivity trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const weeklyData = last7Days.map((date) => {
    const dayTasks = todos.filter((todo) => {
      const todoDate = new Date(todo.updatedAt)
      return todoDate.toDateString() === date.toDateString() && todo.completed
    }).length

    const dayTime = timeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.createdAt)
        return entryDate.toDateString() === date.toDateString()
      })
      .reduce((total, entry) => total + entry.duration, 0)

    return {
      day: date.toLocaleDateString("pt-BR", { weekday: "short" }),
      tasks: dayTasks,
      time: Math.round((dayTime / 60) * 10) / 10,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">Insights sobre sua produtividade e progresso</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} de {todos.length} tarefas
            </p>
            <Progress value={completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals} de {goals.length} metas
            </p>
            <Progress value={goalCompletionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Esta Semana</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalTimeThisWeek / 60)}h</div>
            <p className="text-xs text-muted-foreground">{totalTimeThisWeek} minutos registrados</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">{notes.filter((note) => note.isPinned).length} fixadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produtividade Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--primary))" name="Tarefas" />
                <Bar dataKey="time" fill="hsl(var(--success))" name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Distribuição por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {priorityChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Performance por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{category.category}</span>
                    <Badge variant="outline">{category.rate}%</Badge>
                  </div>
                  <Progress value={category.rate} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {category.completed} de {category.total} tarefas concluídas
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Tempo por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-muted-foreground" />
                <YAxis dataKey="category" type="category" className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{todos.length}</div>
              <div className="text-sm text-muted-foreground">Total de Tarefas</div>
              <div className="text-xs text-muted-foreground mt-1">
                {todos.filter((todo) => !todo.completed).length} pendentes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{goals.length}</div>
              <div className="text-sm text-muted-foreground">Metas Definidas</div>
              <div className="text-xs text-muted-foreground mt-1">
                {goals.filter((goal) => !goal.completed).length} em progresso
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(timeEntries.reduce((total, entry) => total + entry.duration, 0) / 60)}h
              </div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
              <div className="text-xs text-muted-foreground mt-1">{timeEntries.length} sessões registradas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
