"use client"

import type React from "react"

import { useState } from "react"
import { useCreateNote } from "@/hooks/use-notes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const createNote = useCreateNote()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await createNote.mutateAsync({
        title: formData.title,
        content: formData.content,
        category: formData.category || "geral",
        tags,
        isPinned: false,
      })

      toast({
        title: "Sucesso!",
        description: "Nota criada com sucesso",
      })

      setFormData({
        title: "",
        content: "",
        category: "",
        tags: "",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a nota",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Nota</DialogTitle>
          <DialogDescription>Crie uma nova nota para organizar suas ideias</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Digite o título da nota"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={createNote.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              placeholder="Escreva o conteúdo da sua nota..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={createNote.isPending}
              rows={8}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={createNote.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="projeto">Projeto</SelectItem>
                  <SelectItem value="ideias">Ideias</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={createNote.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createNote.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Nota"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
