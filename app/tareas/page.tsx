"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  Circle,
  Plus,
  Clock,
  Flag,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  CheckSquare,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in-progress" | "completed"
  dueDate: string
  assignee: string
  category: string
  completed: boolean
  createdAt: Date
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Completar informe mensual",
      description: "Preparar el informe de ventas del mes pasado con gráficos y análisis",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-15",
      assignee: "Juan Pérez",
      category: "Trabajo",
      completed: false,
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "2",
      title: "Revisar propuesta de cliente",
      description: "Analizar la propuesta del cliente ABC y preparar respuesta",
      priority: "urgent",
      status: "todo",
      dueDate: "2024-01-12",
      assignee: "María García",
      category: "Ventas",
      completed: false,
      createdAt: new Date("2024-01-08"),
    },
    {
      id: "3",
      title: "Actualizar documentación",
      description: "Actualizar la documentación técnica del proyecto",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-10",
      assignee: "Carlos López",
      category: "Desarrollo",
      completed: true,
      createdAt: new Date("2024-01-05"),
    },
    {
      id: "4",
      title: "Planificar reunión de equipo",
      description: "Organizar agenda y enviar invitaciones para la reunión semanal",
      priority: "low",
      status: "todo",
      dueDate: "2024-01-16",
      assignee: "Ana Martín",
      category: "Gestión",
      completed: false,
      createdAt: new Date("2024-01-09"),
    },
  ])

  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    dueDate: "",
    assignee: "",
    category: "",
  })

  // Cargar tareas almacenadas
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("tasks-data")
      if (stored) {
        const parsed = JSON.parse(stored)
        setTasks(parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })))
      }
    } catch (err) {
      console.error("Error loading tasks-data", err)
    }
  }, [])

  // Guardar tareas
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "tasks-data",
        JSON.stringify(tasks.map((t) => ({ ...t, createdAt: t.createdAt })))
      )
    } catch (err) {
      console.error("Error saving tasks-data", err)
    }
  }, [tasks])

  // Estadísticas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const urgentTasks = tasks.filter((task) => task.priority === "urgent" && !task.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Filtrar y ordenar tareas
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true
      if (filter === "completed") return task.completed
      if (filter === "pending") return !task.completed
      if (filter === "urgent") return task.priority === "urgent"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (sortBy === "priority") {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === "created") return b.createdAt.getTime() - a.createdAt.getTime()
      return 0
    })

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "completed" : "todo",
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
      dueDate: newTask.dueDate,
      assignee: newTask.assignee,
      category: newTask.category || "General",
      completed: false,
      createdAt: new Date(),
    }

    setTasks((prev) => [task, ...prev])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: "",
      category: "",
    })
    setShowNewTaskDialog(false)
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
      category: task.category,
    })
    setShowEditTaskDialog(true)
  }

  const updateTask = () => {
    if (!editingTask) return

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: newTask.title,
              description: newTask.description,
              priority: newTask.priority,
              dueDate: newTask.dueDate,
              assignee: newTask.assignee,
              category: newTask.category,
            }
          : task,
      ),
    )
    setShowEditTaskDialog(false)
    setEditingTask(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgente"
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return priority
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(filteredTasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Actualizar el orden en el estado principal
    const newTasks = [...tasks]
    const draggedTask = newTasks.find((t) => t.id === reorderedItem.id)
    if (draggedTask) {
      const draggedIndex = newTasks.indexOf(draggedTask)
      newTasks.splice(draggedIndex, 1)
      newTasks.splice(result.destination.index, 0, draggedTask)
      setTasks(newTasks)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Tareas
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Organiza y gestiona tu productividad</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          onClick={() => setShowNewTaskDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{totalTasks}</div>
            <div className="text-xs text-blue-400">tareas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Completadas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{completedTasks}</div>
            <div className="text-xs text-green-400">{completionRate}% completado</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-400">Pendientes</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-orange-400">{pendingTasks}</div>
            <div className="text-xs text-orange-400">por hacer</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-slate-400">Urgentes</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-red-400">{urgentTasks}</div>
            <div className="text-xs text-red-400">requieren atención</div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso General */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg">Progreso General</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Tareas completadas</span>
              <span className="font-semibold">
                {completedTasks} de {totalTasks}
              </span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="text-center text-sm text-slate-400">{completionRate}% de progreso total</div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y Ordenamiento */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm text-slate-400">Filtrar por:</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las tareas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="urgent">Urgentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-sm text-slate-400">Ordenar por:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Fecha de vencimiento</SelectItem>
                  <SelectItem value="priority">Prioridad</SelectItem>
                  <SelectItem value="created">Fecha de creación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tareas con Drag & Drop */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-lg">Lista de Tareas</CardTitle>
              <CardDescription className="text-sm">Arrastra las tareas para reordenarlas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-700/50 hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-300 cursor-move ${
                            snapshot.isDragging ? "shadow-2xl scale-105 rotate-2" : ""
                          } ${task.completed ? "opacity-60" : ""}`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className="hover:scale-110 transition-all duration-200 cursor-pointer mt-1"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-slate-400 hover:text-green-400 transition-colors" />
                              )}
                            </button>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3
                                    className={`font-semibold ${task.completed ? "line-through text-slate-500" : ""}`}
                                  >
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                    <DropdownMenuItem
                                      onClick={() => editTask(task)}
                                      className="hover:bg-slate-700 cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteTask(task.id)}
                                      className="hover:bg-slate-700 cursor-pointer text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <Badge
                                  variant="outline"
                                  className={`text-xs border ${getPriorityColor(task.priority)}`}
                                >
                                  <Flag className="h-3 w-3 mr-1" />
                                  {getPriorityText(task.priority)}
                                </Badge>

                                {task.category && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-slate-700 text-slate-300 border-slate-600"
                                  >
                                    {task.category}
                                  </Badge>
                                )}

                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <Calendar className="h-3 w-3" />
                                    <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}

                                {task.assignee && (
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <User className="h-3 w-3" />
                                    <span className="text-xs">{task.assignee}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay tareas que coincidan con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Nueva Tarea */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              Nueva Tarea
            </DialogTitle>
            <DialogDescription>Crea una nueva tarea para organizar tu trabajo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título de la tarea</Label>
              <Input
                placeholder="Ej: Completar informe mensual"
                className="bg-slate-800 border-slate-700"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe los detalles de la tarea..."
                className="bg-slate-800 border-slate-700"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
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
                <Label>Fecha límite</Label>
                <Input
                  type="date"
                  className="bg-slate-800 border-slate-700"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asignado a</Label>
                <Input
                  placeholder="Nombre de la persona"
                  className="bg-slate-800 border-slate-700"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trabajo">Trabajo</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Gestión">Gestión</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewTaskDialog(false)} className="flex-1 border-slate-700">
                Cancelar
              </Button>
              <Button onClick={addNewTask} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Crear Tarea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Tarea */}
      <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-400" />
              Editar Tarea
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título de la tarea</Label>
              <Input
                placeholder="Ej: Completar informe mensual"
                className="bg-slate-800 border-slate-700"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe los detalles de la tarea..."
                className="bg-slate-800 border-slate-700"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
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
                <Label>Fecha límite</Label>
                <Input
                  type="date"
                  className="bg-slate-800 border-slate-700"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asignado a</Label>
                <Input
                  placeholder="Nombre de la persona"
                  className="bg-slate-800 border-slate-700"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trabajo">Trabajo</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Gestión">Gestión</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditTaskDialog(false)}
                className="flex-1 border-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={updateTask} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
