export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  subtasks: Subtask[]
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface TodoCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface CreateTodoData {
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  tags: string[]
}
