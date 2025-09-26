"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTimeEntry, useTimeEntries } from "@/hooks/use-time-tracker"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, Square, Clock, Timer } from "lucide-react"
import { PomodoroTimer } from "./pomodoro-timer"

export function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const { data: timeEntries = [] } = useTimeEntries()
  const createTimeEntry = useCreateTimeEntry()
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime())
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!description.trim() || !category) {
      toast({
        title: "Erro",
        description: "Preencha a descrição e categoria antes de iniciar",
        variant: "destructive",
      })
      return
    }

    setStartTime(new Date())
    setIsRunning(true)
    setElapsedTime(0)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = async () => {
    if (!startTime) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60) // in minutes

    try {
      await createTimeEntry.mutateAsync({
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        category,
      })

      toast({
        title: "Tempo registrado!",
        description: `${duration} minutos adicionados ao seu registro`,
      })

      // Reset
      setIsRunning(false)
      setStartTime(null)
      setElapsedTime(0)
      setDescription("")
      setCategory("")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o registro de tempo",
        variant: "destructive",
      })
    }
  }

  const todayEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.createdAt).toDateString()
    const today = new Date().toDateString()
    return entryDate === today
  })

  const todayTotal = todayEntries.reduce((total, entry) => total + entry.duration, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cronômetro</h1>
        <p className="text-muted-foreground mt-2">Acompanhe seu tempo e produtividade</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cronômetro Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-primary mb-4">{formatTime(elapsedTime)}</div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da atividade</Label>
                <Input
                  id="description"
                  placeholder="O que você está fazendo?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} disabled={isRunning}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalho">Trabalho</SelectItem>
                    <SelectItem value="estudo">Estudo</SelectItem>
                    <SelectItem value="projeto">Projeto</SelectItem>
                    <SelectItem value="reunião">Reunião</SelectItem>
                    <SelectItem value="pessoal">Pessoal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} className="flex-1 gap-2">
                  <Play className="h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <>
                  <Button onClick={handlePause} variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Pause className="h-4 w-4" />
                    Pausar
                  </Button>
                  <Button onClick={handleStop} variant="destructive" className="flex-1 gap-2">
                    <Square className="h-4 w-4" />
                    Parar
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pomodoro Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Pomodoro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer />
          </CardContent>
        </Card>
      </div>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Math.floor(todayTotal / 60)}h {todayTotal % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Tempo total</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{todayEntries.length}</div>
              <div className="text-sm text-muted-foreground">Sessões</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {todayEntries.length > 0 ? Math.round(todayTotal / todayEntries.length) : 0}m
              </div>
              <div className="text-sm text-muted-foreground">Média por sessão</div>
            </div>
          </div>

          {todayEntries.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Atividades de hoje:</h4>
              {todayEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-accent/50 rounded">
                  <div>
                    <span className="font-medium">{entry.description}</span>
                    <span className="text-sm text-muted-foreground ml-2">({entry.category})</span>
                  </div>
                  <span className="text-sm font-mono">{entry.duration}m</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
