"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ProductivityChartProps {
  data: Array<{
    day: string
    tasks: number
    goals: number
    time: number
  }>
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Produtividade Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="tasks" fill="hsl(var(--primary))" name="Tarefas" />
            <Bar dataKey="goals" fill="hsl(var(--success))" name="Metas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
