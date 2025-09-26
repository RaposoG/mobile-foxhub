"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Todo, CreateTodoData } from "@/types/todo"
import { mockTodos } from "@/lib/mock-data"

// Mock data storage
const STORAGE_KEY = "foxhub-todos"

const getTodos = (): Todo[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return mock data and reset storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTodos))
      return mockTodos
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTodos))
  return mockTodos
}

const saveTodos = (todos: Todo[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTodoData): Promise<Todo> => {
      const todos = getTodos()
      const newTodo: Todo = {
        id: Date.now().toString(),
        ...data,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
      }
      const updatedTodos = [newTodo, ...todos]
      saveTodos(updatedTodos)
      return newTodo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Todo> }): Promise<Todo> => {
      const todos = getTodos()
      const todoIndex = todos.findIndex((t) => t.id === id)
      if (todoIndex === -1) throw new Error("Todo not found")

      const updatedTodo = {
        ...todos[todoIndex],
        ...updates,
        updatedAt: new Date(),
      }
      todos[todoIndex] = updatedTodo
      saveTodos(todos)
      return updatedTodo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const todos = getTodos()
      const filteredTodos = todos.filter((t) => t.id !== id)
      saveTodos(filteredTodos)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
