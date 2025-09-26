export interface Goal {
  id: string
  title: string
  description?: string
  category: string
  targetValue: number
  currentValue: number
  unit: string
  deadline?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  taskId?: string
  description: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  category: string
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface PomodoroSession {
  id: string
  type: "work" | "short-break" | "long-break"
  duration: number // in minutes
  completed: boolean
  startTime: string
  endTime?: string
}
