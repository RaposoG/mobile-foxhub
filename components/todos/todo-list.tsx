"use client"

import { useState } from "react"
import { useTodos } from "@/hooks/use-todos"
import { TodoItem } from "./todo-item"
import { TodoFilters } from "./todo-filters"
import { CreateTodoDialog } from "./create-todo-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import type { Todo } from "@/types/todo"

export function TodoList() {
  const { data: todos = [], isLoading } = useTodos()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredTodos = todos.filter((todo: Todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || todo.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || todo.priority === selectedPriority
    const matchesCompleted = showCompleted || !todo.completed

    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
  })

  const categories = Array.from(new Set(todos.map((todo: Todo) => todo.category)))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">
            {filteredTodos.length} de {todos.length} tarefas
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <TodoFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              showCompleted={showCompleted}
              onShowCompletedChange={setShowCompleted}
            />
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all" || selectedPriority !== "all" ? (
                  <div>
                    <p className="text-base md:text-lg mb-2">Nenhuma tarefa encontrada</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-base md:text-lg mb-2">Nenhuma tarefa ainda</p>
                    <p className="text-sm">Crie sua primeira tarefa para começar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTodos.map((todo: Todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>

      <CreateTodoDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} categories={categories} />
    </div>
  )
}
