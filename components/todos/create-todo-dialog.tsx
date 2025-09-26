"use client"

import type React from "react"

import { useState } from "react"
import { useCreateTodo } from "@/hooks/use-todos"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { CreateTodoData } from "@/types/todo"

interface CreateTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
}

export function CreateTodoDialog({ open, onOpenChange, categories }: CreateTodoDialogProps) {
  const [formData, setFormData] = useState<CreateTodoData>({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: "",
    tags: [],
  })
  const [tagsInput, setTagsInput] = useState("")

  const createTodo = useCreateTodo()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria",
        variant: "destructive",
      })
      return
    }

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await createTodo.mutateAsync({
        ...formData,
        tags,
      })

      toast({
        title: "Sucesso!",
        description: "Tarefa criada com sucesso",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "",
        dueDate: "",
        tags: [],
      })
      setTagsInput("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>Crie uma nova tarefa para organizar seu trabalho</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={createTodo.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da tarefa"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={createTodo.isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
                disabled={createTodo.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={createTodo.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="saúde">Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              disabled={createTodo.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Digite as tags separadas por vírgula"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={createTodo.isPending}
            />
            <p className="text-xs text-muted-foreground">Exemplo: urgente, reunião, cliente</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createTodo.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createTodo.isPending}>
              {createTodo.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
