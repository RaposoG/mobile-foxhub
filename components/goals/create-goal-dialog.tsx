"use client"

import type React from "react"

import { useState } from "react"
import { useCreateGoal } from "@/hooks/use-goals"
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

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetValue: "",
    unit: "",
    deadline: "",
  })

  const createGoal = useCreateGoal()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.targetValue || !formData.unit || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      await createGoal.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetValue: Number(formData.targetValue),
        currentValue: 0,
        unit: formData.unit,
        deadline: formData.deadline || undefined,
        completed: false,
      })

      toast({
        title: "Sucesso!",
        description: "Meta criada com sucesso",
      })

      setFormData({
        title: "",
        description: "",
        category: "",
        targetValue: "",
        unit: "",
        deadline: "",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>Defina uma nova meta para acompanhar seu progresso</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Correr 100km este mês"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={createGoal.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua meta em detalhes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={createGoal.isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={createGoal.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saúde">Saúde</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                disabled={createGoal.isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Meta *</Label>
              <Input
                id="targetValue"
                type="number"
                placeholder="100"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                disabled={createGoal.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidade *</Label>
              <Input
                id="unit"
                placeholder="km, livros, R$..."
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                disabled={createGoal.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createGoal.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createGoal.isPending}>
              {createGoal.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Meta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
