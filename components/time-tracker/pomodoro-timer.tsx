"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useCreatePomodoroSession } from "@/hooks/use-time-tracker"
import { useToast } from "@/hooks/use-toast"
import { Play, Pause, RotateCcw } from "lucide-react"

const POMODORO_TIMES = {
  work: 25 * 60, // 25 minutes
  "short-break": 5 * 60, // 5 minutes
  "long-break": 15 * 60, // 15 minutes
}

export function PomodoroTimer() {
  const [currentType, setCurrentType] = useState<"work" | "short-break" | "long-break">("work")
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIMES.work)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  const createSession = useCreatePomodoroSession()
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleSessionComplete = async () => {
    setIsRunning(false)

    try {
      await createSession.mutateAsync({
        type: currentType,
        duration: POMODORO_TIMES[currentType] / 60,
        completed: true,
        startTime: new Date(Date.now() - POMODORO_TIMES[currentType] * 1000).toISOString(),
        endTime: new Date().toISOString(),
      })

      if (currentType === "work") {
        setSessionCount((prev) => prev + 1)
        const nextType = sessionCount % 4 === 3 ? "long-break" : "short-break"
        setCurrentType(nextType)
        setTimeLeft(POMODORO_TIMES[nextType])
        toast({
          title: "Pomodoro concluído! 🍅",
          description: `Hora de fazer uma ${nextType === "long-break" ? "pausa longa" : "pausa curta"}`,
        })
      } else {
        setCurrentType("work")
        setTimeLeft(POMODORO_TIMES.work)
        toast({
          title: "Pausa concluída!",
          description: "Hora de voltar ao trabalho",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a sessão",
        variant: "destructive",
      })
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(POMODORO_TIMES[currentType])
  }

  const progress = ((POMODORO_TIMES[currentType] - timeLeft) / POMODORO_TIMES[currentType]) * 100

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "work":
        return "Trabalho"
      case "short-break":
        return "Pausa Curta"
      case "long-break":
        return "Pausa Longa"
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-lg font-medium text-muted-foreground mb-2">{getTypeLabel(currentType)}</div>
        <div className="text-4xl font-mono font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
        <Progress value={progress} className="h-2 mb-4" />
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <Button onClick={handleStart} className="flex-1 gap-2">
            <Play className="h-4 w-4" />
            Iniciar
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" className="flex-1 gap-2 bg-transparent">
            <Pause className="h-4 w-4" />
            Pausar
          </Button>
        )}
        <Button onClick={handleReset} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">Sessões concluídas hoje: {sessionCount}</div>
    </div>
  )
}
