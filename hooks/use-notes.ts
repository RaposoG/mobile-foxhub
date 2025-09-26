"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Note } from "@/types/productivity"
import { mockNotes } from "@/lib/mock-data"

const STORAGE_KEY = "foxhub-notes"

const getNotes = (): Note[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return mock data and reset storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes))
      return mockNotes
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotes))
  return mockNotes
}

const saveNotes = (notes: Note[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }
}

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
      const notes = getNotes()
      const newNote: Note = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedNotes = [newNote, ...notes]
      saveNotes(updatedNotes)
      return newNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Note> }): Promise<Note> => {
      const notes = getNotes()
      const noteIndex = notes.findIndex((n) => n.id === id)
      if (noteIndex === -1) throw new Error("Note not found")

      const updatedNote = {
        ...notes[noteIndex],
        ...updates,
        updatedAt: new Date(),
      }
      notes[noteIndex] = updatedNote
      saveNotes(notes)
      return updatedNote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const notes = getNotes()
      const filteredNotes = notes.filter((n) => n.id !== id)
      saveNotes(filteredNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}
