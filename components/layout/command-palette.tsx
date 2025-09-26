"use client"

import { useState, useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast"
import { Home, CheckSquare, Target, Clock, FileText, BarChart3, Settings, Plus } from "lucide-react"

interface CommandPaletteProps {
  onNavigate: (tab: string) => void
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (action: string) => {
    setOpen(false)

    if (action.startsWith("navigate:")) {
      const tab = action.replace("navigate:", "")
      onNavigate(tab)
    } else if (action === "new-task") {
      onNavigate("todos")
      toast({
        title: "Redirecionando",
        description: "Indo para criar nova tarefa...",
      })
    } else if (action === "new-goal") {
      onNavigate("goals")
      toast({
        title: "Redirecionando",
        description: "Indo para criar nova meta...",
      })
    } else if (action === "new-note") {
      onNavigate("notes")
      toast({
        title: "Redirecionando",
        description: "Indo para criar nova nota...",
      })
    } else if (action === "start-timer") {
      onNavigate("time-tracker")
      toast({
        title: "Redirecionando",
        description: "Indo para o cronômetro...",
      })
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando ou busque..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => handleSelect("navigate:dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("navigate:todos")}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Tarefas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("navigate:goals")}>
            <Target className="mr-2 h-4 w-4" />
            <span>Metas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("navigate:time-tracker")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Cronômetro</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("navigate:notes")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Notas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("navigate:analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações Rápidas">
          <CommandItem onSelect={() => handleSelect("new-task")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nova Tarefa</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("new-goal")}>
            <Target className="mr-2 h-4 w-4" />
            <span>Nova Meta</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("new-note")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Nova Nota</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("start-timer")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Iniciar Cronômetro</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Configurações">
          <CommandItem onSelect={() => handleSelect("navigate:settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
