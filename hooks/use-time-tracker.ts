"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TimeEntry, PomodoroSession } from "@/types/productivity"
import { mockTimeEntries, mockPomodoroSessions } from "@/lib/mock-data"

const TIME_ENTRIES_KEY = "foxhub-time-entries"
const POMODORO_KEY = "foxhub-pomodoro"

const getTimeEntries = (): TimeEntry[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(TIME_ENTRIES_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return mock data and reset storage
      localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(mockTimeEntries))
      return mockTimeEntries
    }
  }
  localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(mockTimeEntries))
  return mockTimeEntries
}

const saveTimeEntries = (entries: TimeEntry[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(entries))
  }
}

const getPomodoroSessions = (): PomodoroSession[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(POMODORO_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return mock data and reset storage
      localStorage.setItem(POMODORO_KEY, JSON.stringify(mockPomodoroSessions))
      return mockPomodoroSessions
    }
  }
  localStorage.setItem(POMODORO_KEY, JSON.stringify(mockPomodoroSessions))
  return mockPomodoroSessions
}

const savePomodoroSessions = (sessions: PomodoroSession[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(POMODORO_KEY, JSON.stringify(sessions))
  }
}

export function useTimeEntries() {
  return useQuery({
    queryKey: ["time-entries"],
    queryFn: getTimeEntries,
  })
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<TimeEntry, "id" | "createdAt">): Promise<TimeEntry> => {
      const entries = getTimeEntries()
      const newEntry: TimeEntry = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      const updatedEntries = [newEntry, ...entries]
      saveTimeEntries(updatedEntries)
      return newEntry
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
    },
  })
}

export function usePomodoroSessions() {
  return useQuery({
    queryKey: ["pomodoro-sessions"],
    queryFn: getPomodoroSessions,
  })
}

export function useCreatePomodoroSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<PomodoroSession, "id">): Promise<PomodoroSession> => {
      const sessions = getPomodoroSessions()
      const newSession: PomodoroSession = {
        ...data,
        id: Date.now().toString(),
      }
      const updatedSessions = [newSession, ...sessions]
      savePomodoroSessions(updatedSessions)
      return newSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pomodoro-sessions"] })
    },
  })
}
