"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockCalendarEvents, type CalendarEvent } from "@/lib/mock-data"

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const categoryColors = {
  trabalho: "bg-blue-500",
  pessoal: "bg-green-500",
  saúde: "bg-red-500",
  estudo: "bg-purple-500",
  financeiro: "bg-yellow-500",
  casa: "bg-orange-500",
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    category: "trabalho",
    type: "event" as const,
    priority: "medium" as const,
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getDayEvents = (day: number) => {
    const date = new Date(year, month, day)
    return events.filter(
      (event) => event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year,
    )
  }

  const handleCreateEvent = () => {
    if (!selectedDate || !newEvent.title) return

    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...newEvent,
      date: selectedDate,
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      category: "trabalho",
      type: "event",
      priority: "medium",
    })
    setSelectedDate(null)
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getDayEvents(day)
      const isToday =
        new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

      days.push(
        <div
          key={day}
          className={cn(
            "h-24 md:h-32 border border-border p-1 cursor-pointer hover:bg-accent/50 transition-colors",
            isToday && "bg-primary/10 border-primary",
          )}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          <div className={cn("text-sm font-medium mb-1", isToday && "text-primary font-bold")}>{day}</div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "text-xs p-1 rounded truncate text-white",
                  categoryColors[event.category as keyof typeof categoryColors] || "bg-gray-500",
                )}
                title={`${event.title} - ${event.startTime}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} mais</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  const selectedDateEvents = selectedDate
    ? events.filter(
        (event) =>
          event.date.getDate() === selectedDate.getDate() &&
          event.date.getMonth() === selectedDate.getMonth() &&
          event.date.getFullYear() === selectedDate.getFullYear(),
      )
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground">Gerencie seus eventos e compromissos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Nome do evento"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detalhes do evento"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Fim</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={newEvent.category}
                  onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalho">Trabalho</SelectItem>
                    <SelectItem value="pessoal">Pessoal</SelectItem>
                    <SelectItem value="saúde">Saúde</SelectItem>
                    <SelectItem value="estudo">Estudo</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateEvent} className="w-full">
                Criar Evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0 mb-4">
            {DAYS.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0 border-l border-t">{renderCalendarDays()}</div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Eventos de {selectedDate.toLocaleDateString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum evento nesta data</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full mt-1.5",
                        categoryColors[event.category as keyof typeof categoryColors] || "bg-gray-500",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.startTime} - {event.endTime}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                        {event.priority && (
                          <Badge
                            variant={
                              event.priority === "high"
                                ? "destructive"
                                : event.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
