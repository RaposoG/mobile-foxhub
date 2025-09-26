import type { Todo, Goal, Note, TimeEntry, PomodoroSession } from "@/types/todo"

// Mock Users
export const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    avatar: "/professional-man.jpg",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@example.com",
    avatar: "/professional-woman-diverse.png",
  },
]

// Mock Todos
export const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Finalizar relatório mensal",
    description: "Completar análise de dados do mês de dezembro",
    completed: false,
    priority: "high",
    category: "trabalho",
    tags: ["relatório", "análise"],
    dueDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-10"),
    subtasks: [
      { id: "1-1", title: "Coletar dados", completed: true },
      { id: "1-2", title: "Analisar métricas", completed: true },
      { id: "1-3", title: "Escrever conclusões", completed: false },
    ],
  },
  {
    id: "2",
    title: "Comprar ingredientes para jantar",
    description: "Lista: tomate, cebola, alho, carne",
    completed: true,
    priority: "medium",
    category: "pessoal",
    tags: ["compras", "casa"],
    dueDate: new Date("2024-01-12"),
    createdAt: new Date("2024-01-11"),
    subtasks: [],
  },
  {
    id: "3",
    title: "Estudar React Native",
    description: "Completar curso online de desenvolvimento mobile",
    completed: false,
    priority: "high",
    category: "estudo",
    tags: ["programação", "mobile"],
    dueDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-08"),
    subtasks: [
      { id: "3-1", title: "Módulo 1: Introdução", completed: true },
      { id: "3-2", title: "Módulo 2: Componentes", completed: false },
      { id: "3-3", title: "Módulo 3: Navegação", completed: false },
    ],
  },
  {
    id: "4",
    title: "Agendar consulta médica",
    description: "Check-up anual com cardiologista",
    completed: false,
    priority: "medium",
    category: "saúde",
    tags: ["médico", "saúde"],
    dueDate: new Date("2024-01-18"),
    createdAt: new Date("2024-01-09"),
    subtasks: [],
  },
  {
    id: "5",
    title: "Organizar escritório",
    description: "Limpar e organizar mesa de trabalho",
    completed: false,
    priority: "low",
    category: "casa",
    tags: ["organização", "limpeza"],
    dueDate: new Date("2024-01-16"),
    createdAt: new Date("2024-01-12"),
    subtasks: [],
  },
]

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Ler 12 livros este ano",
    description: "Meta de leitura para desenvolvimento pessoal",
    category: "pessoal",
    targetValue: 12,
    currentValue: 3,
    unit: "livros",
    deadline: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Economizar R$ 10.000",
    description: "Reserva de emergência para o ano",
    category: "financeiro",
    targetValue: 10000,
    currentValue: 2500,
    unit: "reais",
    deadline: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    title: "Correr 500km",
    description: "Meta de exercícios para manter a saúde",
    category: "saúde",
    targetValue: 500,
    currentValue: 85,
    unit: "km",
    deadline: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    title: "Aprender TypeScript",
    description: "Dominar TypeScript para desenvolvimento",
    category: "profissional",
    targetValue: 100,
    currentValue: 65,
    unit: "% progresso",
    deadline: new Date("2024-06-30"),
    createdAt: new Date("2024-01-01"),
  },
]

// Mock Notes
export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Ideias para apresentação",
    content:
      "- Usar mais gráficos visuais\n- Incluir cases de sucesso\n- Preparar demo interativa\n- Focar nos benefícios principais",
    category: "trabalho",
    tags: ["apresentação", "ideias"],
    pinned: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "2",
    title: "Receita de bolo de chocolate",
    content:
      "Ingredientes:\n- 2 xícaras de farinha\n- 1 xícara de açúcar\n- 1/2 xícara de cacau\n- 2 ovos\n- 1 xícara de leite\n\nModo de preparo:\n1. Misture os ingredientes secos\n2. Adicione os líquidos\n3. Asse por 30min a 180°C",
    category: "pessoal",
    tags: ["receita", "doce"],
    pinned: false,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
  {
    id: "3",
    title: "Anotações do curso React",
    content:
      "Hooks importantes:\n- useState: gerenciar estado local\n- useEffect: efeitos colaterais\n- useContext: compartilhar dados\n- useMemo: otimização de performance\n\nBoas práticas:\n- Componentes pequenos e focados\n- Props tipadas com TypeScript\n- Testes unitários",
    category: "estudo",
    tags: ["react", "programação", "hooks"],
    pinned: true,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
  },
]

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    description: "Desenvolvimento da feature de login",
    category: "trabalho",
    duration: 7200, // 2 hours in seconds
    date: new Date("2024-01-12"),
    type: "manual",
  },
  {
    id: "2",
    description: "Estudo de React Native",
    category: "estudo",
    duration: 3600, // 1 hour
    date: new Date("2024-01-12"),
    type: "pomodoro",
  },
  {
    id: "3",
    description: "Reunião de planejamento",
    category: "trabalho",
    duration: 5400, // 1.5 hours
    date: new Date("2024-01-11"),
    type: "manual",
  },
  {
    id: "4",
    description: "Exercícios físicos",
    category: "saúde",
    duration: 2700, // 45 minutes
    date: new Date("2024-01-11"),
    type: "manual",
  },
]

// Mock Pomodoro Sessions
export const mockPomodoroSessions: PomodoroSession[] = [
  {
    id: "1",
    task: "Desenvolvimento da feature de login",
    duration: 25, // 25 minutes
    type: "work" as const,
    completed: true,
    startTime: new Date("2024-01-12T09:00:00"),
    endTime: new Date("2024-01-12T09:25:00"),
  },
  {
    id: "2",
    task: "Estudo de React Native",
    duration: 25,
    type: "work" as const,
    completed: true,
    startTime: new Date("2024-01-12T10:00:00"),
    endTime: new Date("2024-01-12T10:25:00"),
  },
  {
    id: "3",
    task: "Pausa",
    duration: 5,
    type: "break" as const,
    completed: true,
    startTime: new Date("2024-01-12T10:25:00"),
    endTime: new Date("2024-01-12T10:30:00"),
  },
  {
    id: "4",
    task: "Revisão de código",
    duration: 25,
    type: "work" as const,
    completed: false,
    startTime: new Date("2024-01-12T14:00:00"),
    endTime: new Date("2024-01-12T14:25:00"),
  },
]

// Mock Calendar Events
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  category: string
  type: "task" | "goal" | "event" | "reminder"
  priority?: "low" | "medium" | "high"
  completed?: boolean
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunião com cliente",
    description: "Apresentar proposta do novo projeto",
    date: new Date("2024-01-15"),
    startTime: "09:00",
    endTime: "10:30",
    category: "trabalho",
    type: "event",
    priority: "high",
  },
  {
    id: "2",
    title: "Finalizar relatório mensal",
    description: "Deadline para entrega",
    date: new Date("2024-01-15"),
    startTime: "14:00",
    endTime: "17:00",
    category: "trabalho",
    type: "task",
    priority: "high",
    completed: false,
  },
  {
    id: "3",
    title: "Consulta médica",
    description: "Check-up anual",
    date: new Date("2024-01-18"),
    startTime: "15:00",
    endTime: "16:00",
    category: "saúde",
    type: "event",
    priority: "medium",
  },
  {
    id: "4",
    title: "Aula de inglês",
    description: "Conversação avançada",
    date: new Date("2024-01-16"),
    startTime: "19:00",
    endTime: "20:30",
    category: "estudo",
    type: "event",
    priority: "medium",
  },
  {
    id: "5",
    title: "Exercícios físicos",
    description: "Treino de força",
    date: new Date("2024-01-17"),
    startTime: "07:00",
    endTime: "08:30",
    category: "saúde",
    type: "event",
    priority: "medium",
  },
  {
    id: "6",
    title: "Jantar com família",
    description: "Aniversário da mãe",
    date: new Date("2024-01-19"),
    startTime: "19:30",
    endTime: "22:00",
    category: "pessoal",
    type: "event",
    priority: "high",
  },
  {
    id: "7",
    title: "Estudar React Native",
    description: "Módulo 2: Componentes",
    date: new Date("2024-01-20"),
    startTime: "20:00",
    endTime: "22:00",
    category: "estudo",
    type: "task",
    priority: "high",
    completed: false,
  },
]

// Mock Activity Data
export const mockActivities = [
  {
    id: "1",
    type: "task" as const,
    title: "Finalizar relatório mensal",
    description: "Completar análise de dados do mês",
    timestamp: "2 horas atrás",
    status: "completed" as const,
  },
  {
    id: "2",
    type: "goal" as const,
    title: "Meta de exercícios",
    description: "Correr 5km por dia",
    timestamp: "4 horas atrás",
    status: "in-progress" as const,
  },
  {
    id: "3",
    type: "task" as const,
    title: "Revisar código do projeto",
    description: "Code review da nova feature",
    timestamp: "6 horas atrás",
    status: "pending" as const,
  },
  {
    id: "4",
    type: "note" as const,
    title: "Ideias para apresentação",
    description: "Brainstorm para próxima reunião",
    timestamp: "1 dia atrás",
    status: "completed" as const,
  },
]

// Mock Chart Data
export const mockChartData = [
  { day: "Seg", tasks: 8, goals: 2, time: 6 },
  { day: "Ter", tasks: 12, goals: 3, time: 8 },
  { day: "Qua", tasks: 6, goals: 1, time: 4 },
  { day: "Qui", tasks: 15, goals: 4, time: 9 },
  { day: "Sex", tasks: 10, goals: 2, time: 7 },
  { day: "Sáb", tasks: 4, goals: 1, time: 3 },
  { day: "Dom", tasks: 2, goals: 1, time: 2 },
]

// Mock Stats
export const mockStats = {
  totalTasks: 24,
  completedTasks: 18,
  activeGoals: 5,
  productivityScore: 85,
}
