"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CheckCircle,
  Circle,
  Plus,
  CalendarIcon,
  List,
  Grid3X3,
  Search,
  Clock,
  Flag,
  Tag,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns"
import { es } from "date-fns/locale"

type Priority = "low" | "medium" | "high" | "urgent"
type Status = "todo" | "in-progress" | "completed"
type ViewMode = "list" | "board" | "calendar"

interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: Status
  category: string
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  tags: string[]
  startTime?: string
  endTime?: string
}

const priorityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
}

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

const statusColors = {
  todo: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
}

const statusLabels = {
  todo: "Por hacer",
  "in-progress": "En progreso",
  completed: "Completado",
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return `${hour}:00`
})

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Completar módulo de React",
      description: "Terminar las lecciones 5-8 del curso avanzado",
      priority: "high",
      status: "in-progress",
      category: "Aprendizaje",
      dueDate: new Date("2025-01-10"),
      createdAt: new Date("2025-01-05"),
      tags: ["react", "programación", "curso"],
      startTime: "09:00",
      endTime: "11:00",
    },
    {
      id: "2",
      title: "Revisar presupuesto mensual",
      description: "Analizar gastos y ajustar presupuesto para febrero",
      priority: "medium",
      status: "completed",
      category: "Finanzas",
      dueDate: new Date("2025-01-08"),
      createdAt: new Date("2025-01-03"),
      completedAt: new Date("2025-01-07"),
      tags: ["finanzas", "presupuesto"],
      startTime: "14:00",
      endTime: "15:30",
    },
    {
      id: "3",
      title: "Ejercicio matutino",
      description: "Rutina de cardio de 30 minutos",
      priority: "medium",
      status: "todo",
      category: "Salud",
      dueDate: new Date("2025-01-06"),
      createdAt: new Date("2025-01-05"),
      tags: ["ejercicio", "salud", "rutina"],
      startTime: "07:00",
      endTime: "07:30",
    },
    {
      id: "4",
      title: "Llamar al dentista",
      description: "Agendar cita para limpieza dental",
      priority: "low",
      status: "todo",
      category: "Salud",
      createdAt: new Date("2025-01-04"),
      tags: ["salud", "cita"],
      dueDate: new Date("2025-01-09"),
      startTime: "16:00",
      endTime: "16:15",
    },
    {
      id: "5",
      title: "Preparar presentación",
      description: "Slides para reunión del equipo",
      priority: "urgent",
      status: "todo",
      category: "Trabajo",
      dueDate: new Date("2025-01-07"),
      createdAt: new Date("2025-01-05"),
      tags: ["trabajo", "presentación", "equipo"],
      startTime: "10:00",
      endTime: "12:00",
    },
  ])

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Nuevo task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    category: "",
    dueDate: undefined as Date | undefined,
    tags: [] as string[],
    startTime: "",
    endTime: "",
  })

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
              completedAt: task.status === "completed" ? undefined : new Date(),
            }
          : task,
      ),
    )
  }

  const addNewTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: "todo",
      category: newTask.category || "General",
      dueDate: newTask.dueDate,
      createdAt: new Date(),
      tags: newTask.tags,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
    }

    setTasks((prev) => [task, ...prev])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "",
      dueDate: undefined,
      tags: [],
      startTime: "",
      endTime: "",
    })
    setShowNewTaskDialog(false)
  }

  // Filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesCategory = filterCategory === "all" || task.category === filterCategory

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory
  })

  // Obtener categorías únicas
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  // Estadísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status !== "completed").length,
    overdue: tasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "completed").length,
  }

  // Calendar functions
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getTasksForDay = (date: Date) => {
    return filteredTasks.filter((task) => task.dueDate && isSameDay(task.dueDate, date))
  }

  const getTaskPosition = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0])
    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1])
    const duration = endHour - start + endMinute / 60
    return {
      top: `${start * 60}px`,
      height: `${duration * 60}px`,
    }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      className={`rounded-lg p-4 space-y-3 transition-all duration-300 border ${
        task.status === "completed"
          ? "bg-gradient-to-r from-green-600/10 to-green-800/10 border-green-500/30 shadow-lg"
          : "bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className="hover:scale-110 transition-all duration-200 cursor-pointer mt-1"
          >
            {task.status === "completed" ? (
              <CheckCircle className="h-5 w-5 text-green-400 drop-shadow-lg" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400 hover:text-green-400 transition-colors" />
            )}
          </button>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-slate-400" : ""}`}>
                {task.title}
              </h3>
              {task.description && <p className="text-sm text-slate-400 mt-1">{task.description}</p>}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs border ${priorityColors[task.priority]}`}>
                <Flag className="h-3 w-3 mr-1" />
                {priorityLabels[task.priority]}
              </Badge>

              <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600/50">
                <Tag className="h-3 w-3 mr-1" />
                {task.category}
              </Badge>

              {task.dueDate && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    task.dueDate < new Date() && task.status !== "completed"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {format(task.dueDate, "dd/MM", { locale: es })}
                </Badge>
              )}

              {task.startTime && task.endTime && (
                <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {task.startTime} - {task.endTime}
                </Badge>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-slate-700/30 text-slate-400 border border-slate-600/30"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {task.status === "completed" && (
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-xs">Completado</Badge>
          )}
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-700/50">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  // Notion-style Calendar Component
  const NotionCalendar = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">{format(currentWeek, "MMMM yyyy", { locale: es })}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="h-8 w-8 p-0 hover:bg-slate-700/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
              className="text-xs px-2 h-8 hover:bg-slate-700/50"
            >
              Hoy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="h-8 w-8 p-0 hover:bg-slate-700/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setShowNewTaskDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear evento
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex">
        {/* Time column */}
        <div className="w-16 border-r border-slate-700">
          <div className="h-12 border-b border-slate-700"></div>
          {timeSlots.map((time) => (
            <div key={time} className="h-16 border-b border-slate-700/50 flex items-start justify-end pr-2 pt-1">
              <span className="text-xs text-slate-400">{time}</span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 flex">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDay(day)
            const isToday = isSameDay(day, new Date())

            return (
              <div key={day.toISOString()} className="flex-1 border-r border-slate-700 last:border-r-0">
                {/* Day header */}
                <div
                  className={`h-12 border-b border-slate-700 flex flex-col items-center justify-center ${
                    isToday ? "bg-blue-600/20" : ""
                  }`}
                >
                  <span className="text-xs text-slate-400 uppercase">{format(day, "EEE", { locale: es })}</span>
                  <span className={`text-sm font-medium ${isToday ? "text-blue-400" : "text-white"}`}>
                    {format(day, "d")}
                  </span>
                </div>

                {/* Day content */}
                <div className="relative">
                  {/* Time grid */}
                  {timeSlots.map((time) => (
                    <div key={time} className="h-16 border-b border-slate-700/30"></div>
                  ))}

                  {/* Tasks */}
                  {dayTasks.map((task) => {
                    if (!task.startTime || !task.endTime) return null
                    const position = getTaskPosition(task.startTime, task.endTime)

                    return (
                      <div
                        key={task.id}
                        className={`absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer transition-all hover:shadow-lg ${
                          task.status === "completed"
                            ? "bg-green-600/80 text-white"
                            : task.priority === "urgent"
                              ? "bg-red-600/80 text-white"
                              : task.priority === "high"
                                ? "bg-orange-600/80 text-white"
                                : task.priority === "medium"
                                  ? "bg-yellow-600/80 text-white"
                                  : "bg-blue-600/80 text-white"
                        }`}
                        style={position}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="text-xs opacity-90">
                          {task.startTime} - {task.endTime}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <div className="absolute right-4 top-4 w-80 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl z-10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">{selectedTask.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTask(null)}
              className="h-6 w-6 p-0 hover:bg-slate-700"
            >
              ×
            </Button>
          </div>
          {selectedTask.description && <p className="text-sm text-slate-400 mb-3">{selectedTask.description}</p>}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">
                {selectedTask.startTime} - {selectedTask.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-slate-400" />
              <Badge variant="outline" className={`text-xs ${priorityColors[selectedTask.priority]}`}>
                {priorityLabels[selectedTask.priority]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">{selectedTask.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Tareas
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            {stats.completed} de {stats.total} tareas completadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "board" ? "default" : "ghost"}
              onClick={() => setViewMode("board")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "calendar" ? "default" : "ghost"}
              onClick={() => setViewMode("calendar")}
              className="h-8 w-8 p-0"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => setShowNewTaskDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <List className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Completadas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Pendientes</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-yellow-400">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="h-4 w-4 text-red-400" />
              <span className="text-xs text-slate-400">Vencidas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-red-400">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      {viewMode !== "calendar" && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar tareas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | "all")}>
                  <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Status | "all")}>
                  <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="todo">Por hacer</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista de Tareas */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron tareas que coincidan con los filtros</p>
            </div>
          )}
        </div>
      )}

      {viewMode === "board" && (
        <div className="grid md:grid-cols-3 gap-6">
          {(["todo", "in-progress", "completed"] as Status[]).map((status) => (
            <Card key={status} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status].split(" ")[0]}`} />
                  {statusLabels[status]}
                  <Badge variant="secondary" className="ml-auto">
                    {filteredTasks.filter((t) => t.status === status).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="h-[800px]">
          <NotionCalendar />
        </div>
      )}

      {/* Dialog Nueva Tarea */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Nueva Tarea
            </DialogTitle>
            <DialogDescription>Crea una nueva tarea para tu lista de pendientes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="¿Qué necesitas hacer?"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Detalles adicionales..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as Priority })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input
                  placeholder="Ej: Trabajo, Personal, Salud..."
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-800/50 border-slate-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(newTask.dueDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <div className="p-3">
                      <Input
                        type="date"
                        value={newTask.dueDate ? format(newTask.dueDate, "yyyy-MM-dd") : ""}
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value ? new Date(e.target.value) : undefined })
                        }
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Hora inicio</Label>
                <Select
                  value={newTask.startTime}
                  onValueChange={(value) => setNewTask({ ...newTask, startTime: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hora fin</Label>
                <Select value={newTask.endTime} onValueChange={(value) => setNewTask({ ...newTask, endTime: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={addNewTask}
                disabled={!newTask.title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 shadow-lg"
              >
                Crear Tarea
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewTaskDialog(false)}
                className="border-slate-700 hover:bg-slate-700/50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
