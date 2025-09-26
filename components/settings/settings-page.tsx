"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Bell, Shield, Database, Trash2, Download, Upload } from "lucide-react"

export function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  const handleExportData = () => {
    const data = {
      todos: localStorage.getItem("foxhub-todos"),
      goals: localStorage.getItem("foxhub-goals"),
      notes: localStorage.getItem("foxhub-notes"),
      timeEntries: localStorage.getItem("foxhub-time-entries"),
      pomodoroSessions: localStorage.getItem("foxhub-pomodoro"),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `foxhub-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Dados exportados!",
      description: "Backup dos seus dados foi baixado com sucesso",
    })
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.todos) localStorage.setItem("foxhub-todos", data.todos)
        if (data.goals) localStorage.setItem("foxhub-goals", data.goals)
        if (data.notes) localStorage.setItem("foxhub-notes", data.notes)
        if (data.timeEntries) localStorage.setItem("foxhub-time-entries", data.timeEntries)
        if (data.pomodoroSessions) localStorage.setItem("foxhub-pomodoro", data.pomodoroSessions)

        toast({
          title: "Dados importados!",
          description: "Seus dados foram restaurados com sucesso. Recarregue a página para ver as mudanças.",
        })
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Arquivo inválido ou corrompido",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    localStorage.removeItem("foxhub-todos")
    localStorage.removeItem("foxhub-goals")
    localStorage.removeItem("foxhub-notes")
    localStorage.removeItem("foxhub-time-entries")
    localStorage.removeItem("foxhub-pomodoro")

    toast({
      title: "Dados limpos!",
      description: "Todos os seus dados foram removidos. Recarregue a página.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie suas preferências e dados do FoxHub</p>
      </div>

      {/* Profile Settings */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="text-lg">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={user?.name} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email} disabled className="mt-1" />
              </div>
            </div>
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Receber notificações sobre tarefas e metas</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Salvamento Automático</Label>
              <p className="text-sm text-muted-foreground">Salvar automaticamente suas alterações</p>
            </div>
            <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">Usar tema escuro (recomendado)</p>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gerenciamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar Dados
            </Button>
            <div>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
              <Button asChild variant="outline" className="gap-2 w-full bg-transparent">
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Importar Dados
                </label>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-destructive">Zona de Perigo</h4>
            <p className="text-sm text-muted-foreground">
              Esta ação irá remover permanentemente todos os seus dados do FoxHub.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Limpar Todos os Dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá remover permanentemente todos os seus dados: tarefas,
                    metas, notas, registros de tempo e sessões pomodoro.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Sim, limpar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Sobre o FoxHub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Versão</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Última atualização</span>
            <span>Janeiro 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Desenvolvido com</span>
            <span>Next.js + TanStack Query</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
