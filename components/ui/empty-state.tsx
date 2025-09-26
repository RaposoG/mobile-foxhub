"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-8 text-center">
        <div className="text-muted-foreground mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </CardContent>
    </Card>
  )
}
