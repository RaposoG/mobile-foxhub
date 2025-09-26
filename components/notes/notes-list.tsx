"use client"

import { useState } from "react"
import { useNotes, useUpdateNote, useDeleteNote } from "@/hooks/use-notes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pin, Edit, Trash2, FileText } from "lucide-react"
import { CreateNoteDialog } from "./create-note-dialog"
import type { Note } from "@/types/productivity"

export function NotesList() {
  const { data: notes = [], isLoading } = useNotes()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const filteredNotes = notes.filter(
    (note: Note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const pinnedNotes = filteredNotes.filter((note: Note) => note.isPinned)
  const regularNotes = filteredNotes.filter((note: Note) => !note.isPinned)

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    await updateNote.mutateAsync({
      id: noteId,
      updates: { isPinned: !isPinned },
    })
  }

  const handleDelete = async (noteId: string) => {
    if (confirm("Tem certeza que deseja excluir esta nota?")) {
      await deleteNote.mutateAsync(noteId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando notas...</p>
        </div>
      </div>
    )
  }

  const NoteCard = ({ note }: { note: Note }) => (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base md:text-lg flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
            <span className="truncate">{note.title}</span>
          </CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleTogglePin(note.id, note.isPinned)}
              className={`${note.isPinned ? "text-yellow-500" : "text-muted-foreground"} h-8 w-8 p-0`}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(note.id)}
              className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{note.content}</div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {note.category}
            </Badge>
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {new Date(note.updatedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notas</h1>
          <p className="text-muted-foreground mt-1 md:mt-2">{filteredNotes.length} notas encontradas</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nova Nota
        </Button>
      </div>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <Pin className="h-5 w-5 text-yellow-500" />
            Fixadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pinnedNotes.map((note: Note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Todas as Notas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {regularNotes.map((note: Note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {notes.length === 0 && (
        <Card>
          <CardContent className="p-6 md:p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold mb-2">Nenhuma nota ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie sua primeira nota para começar a organizar suas ideias
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Criar primeira nota</Button>
          </CardContent>
        </Card>
      )}

      <CreateNoteDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
