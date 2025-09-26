"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TodoFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedPriority: string
  onPriorityChange: (priority: string) => void
  showCompleted: boolean
  onShowCompletedChange: (show: boolean) => void
}

export function TodoFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  showCompleted,
  onShowCompletedChange,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="low">Baixa</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Switch id="show-completed" checked={showCompleted} onCheckedChange={onShowCompletedChange} />
        <Label htmlFor="show-completed" className="text-sm">
          Mostrar concluídas
        </Label>
      </div>
    </div>
  )
}
