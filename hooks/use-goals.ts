"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Goal } from "@/types/productivity"
import { mockGoals } from "@/lib/mock-data"

const STORAGE_KEY = "foxhub-goals"

const getGoals = (): Goal[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return mock data and reset storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoals))
      return mockGoals
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoals))
  return mockGoals
}

const saveGoals = (goals: Goal[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }
}

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Goal, "id" | "createdAt" | "updatedAt">): Promise<Goal> => {
      const goals = getGoals()
      const newGoal: Goal = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedGoals = [newGoal, ...goals]
      saveGoals(updatedGoals)
      return newGoal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Goal> }): Promise<Goal> => {
      const goals = getGoals()
      const goalIndex = goals.findIndex((g) => g.id === id)
      if (goalIndex === -1) throw new Error("Goal not found")

      const updatedGoal = {
        ...goals[goalIndex],
        ...updates,
        updatedAt: new Date(),
      }
      goals[goalIndex] = updatedGoal
      saveGoals(goals)
      return updatedGoal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
    },
  })
}
