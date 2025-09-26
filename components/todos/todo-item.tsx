"use client"

import { useState } from "react"
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MoreHorizontal,
  Calendar,
  Tag,
  Trash2,
  Edit,
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  ArrowUp,
} from "lucide-react"
import type { Todo } from "@/types/todo"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()
  const { toast } = useToast()

  const handleToggleComplete = async () => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        updates: { completed: !todo.completed },
      })
      toast({
        title: todo.completed ? "Tarefa reaberta" : "Tarefa concluída",
        description: todo.title,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTodo.mutateAsync(todo.id)
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3" />
      case "medium":
        return <ArrowUp className="h-3 w-3" />
      case "low":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  const completedSubtasks = todo.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = todo.subtasks.length

  return (
    <>
      <Card className={cn("animate-fade-in transition-all hover:shadow-md", todo.completed && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Checkbox */}
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
              disabled={updateTodo.isPending}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-medium text-foreground",
                      todo.completed && "line-through text-muted-foreground",
                    )}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{todo.description}</p>
                  )}

                  {/* Subtasks Progress */}
                  {totalSubtasks > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        {completedSubtasks === totalSubtasks ? (
                          <CheckSquare className="h-4 w-4 text-green-500" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {completedSubtasks}/{totalSubtasks} subtarefas
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center space-x-4 mt-3">
                    {/* Priority */}
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(todo.priority))}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1 capitalize">{todo.priority}</span>
                    </Badge>

                    {/* Category */}
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {todo.category}
                    </Badge>

                    {/* Due Date */}
                    {todo.dueDate && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs", isOverdue && "bg-red-500/10 text-red-500 border-red-500/20")}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(todo.dueDate).toLocaleDateString("pt-BR")}
                      </Badge>
                    )}

                    {/* Tags */}
                    {todo.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{todo.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
