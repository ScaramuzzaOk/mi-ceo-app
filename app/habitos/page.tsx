"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CheckCircle,
  Circle,
  Plus,
  Target,
  TrendingUp,
  Flame,
  Clock,
  Star,
  Edit,
  BarChart3,
  Activity,
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

// Datos de ejemplo para el progreso semanal
const weeklyProgressData = [
  { day: "Lun", completados: 3, total: 4, fullDay: "Lunes" },
  { day: "Mar", completados: 4, total: 4, fullDay: "Martes" },
  { day: "Mié", completados: 2, total: 4, fullDay: "Miércoles" },
  { day: "Jue", completados: 4, total: 4, fullDay: "Jueves" },
  { day: "Vie", completados: 3, total: 4, fullDay: "Viernes" },
  { day: "Sáb", completados: 1, total: 4, fullDay: "Sábado" },
  { day: "Dom", completados: 3, total: 4, fullDay: "Domingo" },
]

// Datos de racha mensual
const streakData = [
  { week: "S1", dias: 5, fullWeek: "Semana 1" },
  { week: "S2", dias: 7, fullWeek: "Semana 2" },
  { week: "S3", dias: 4, fullWeek: "Semana 3" },
  { week: "S4", dias: 6, fullWeek: "Semana 4" },
]

interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: "daily" | "weekly"
  target: number
  completed: boolean
  streak: number
  bestStreak: number
  weeklyProgress: number
  completedToday: boolean
  icon: string
  color: string
  lastCompleted?: Date
}

export default function HabitosPage() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Ejercicio Matutino",
      description: "30 minutos de ejercicio cada mañana",
      category: "Salud",
      frequency: "daily",
      target: 7,
      completed: true,
      streak: 12,
      bestStreak: 25,
      weeklyProgress: 71,
      completedToday: true,
      icon: "💪",
      color: "from-green-500 to-green-600",
      lastCompleted: new Date(),
    },
    {
      id: "2",
      name: "Lectura Diaria",
      description: "Leer al menos 20 páginas",
      category: "Aprendizaje",
      frequency: "daily",
      target: 7,
      completed: false,
      streak: 8,
      bestStreak: 15,
      weeklyProgress: 57,
      completedToday: false,
      icon: "📚",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "3",
      name: "Meditación",
      description: "10 minutos de meditación mindfulness",
      category: "Bienestar",
      frequency: "daily",
      target: 7,
      completed: true,
      streak: 5,
      bestStreak: 18,
      weeklyProgress: 43,
      completedToday: true,
      icon: "🧘",
      color: "from-purple-500 to-purple-600",
      lastCompleted: new Date(),
    },
    {
      id: "4",
      name: "Escribir Diario",
      description: "Reflexionar y escribir pensamientos del día",
      category: "Desarrollo Personal",
      frequency: "daily",
      target: 7,
      completed: false,
      streak: 3,
      bestStreak: 12,
      weeklyProgress: 29,
      completedToday: false,
      icon: "✍️",
      color: "from-orange-500 to-orange-600",
    },
  ])

  const [showNewHabitDialog, setShowNewHabitDialog] = useState(false)

  // Nuevo hábito form
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "",
    frequency: "daily" as "daily" | "weekly",
    target: 7,
    icon: "⭐",
  })

  // Cargar hábitos almacenados
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("habitos-data")
      if (stored) {
        const parsed = JSON.parse(stored)
        setHabits(
          parsed.map((h: any) => ({
            ...h,
            lastCompleted: h.lastCompleted ? new Date(h.lastCompleted) : undefined,
          }))
        )
      }
    } catch (err) {
      console.error("Error loading habitos-data", err)
    }
  }, [])

  // Guardar hábitos
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "habitos-data",
        JSON.stringify(
          habits.map((h) => ({ ...h, lastCompleted: h.lastCompleted }))
        )
      )
    } catch (err) {
      console.error("Error saving habitos-data", err)
    }
  }, [habits])

  // Función para reiniciar hábitos a las 00:00
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date()
      if (typeof window === "undefined") return
      const lastReset = localStorage.getItem("lastHabitReset")
      const today = now.toDateString()

      if (lastReset !== today) {
        setHabits((prevHabits) =>
          prevHabits.map((habit) => ({
            ...habit,
            completedToday: false,
            completed: false,
          })),
        )
        try {
          localStorage.setItem("lastHabitReset", today)
        } catch (err) {
          console.error("Error saving lastHabitReset", err)
        }
      }
    }

    // Verificar al cargar la página
    checkMidnight()

    // Verificar cada minuto
    const interval = setInterval(checkMidnight, 60000)

    return () => clearInterval(interval)
  }, [])

  const toggleHabitCompletion = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completedToday: !habit.completedToday,
              completed: !habit.completedToday,
              streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
              lastCompleted: !habit.completedToday ? new Date() : habit.lastCompleted,
            }
          : habit,
      ),
    )
  }

  const addNewHabit = () => {
    if (!newHabit.name.trim()) return

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category || "General",
      frequency: newHabit.frequency,
      target: newHabit.target,
      completed: false,
      streak: 0,
      bestStreak: 0,
      weeklyProgress: 0,
      completedToday: false,
      icon: newHabit.icon,
      color: "from-gray-500 to-gray-600",
    }

    setHabits((prev) => [...prev, habit])
    setNewHabit({
      name: "",
      description: "",
      category: "",
      frequency: "daily",
      target: 7,
      icon: "⭐",
    })
    setShowNewHabitDialog(false)
  }

  // Estadísticas
  const completedToday = habits.filter((h) => h.completedToday).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
  const bestStreak = Math.max(...habits.map((h) => h.bestStreak))
  const activeStreaks = habits.filter((h) => h.streak > 0).length

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Hábitos
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Construye la mejor versión de ti mismo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {completedToday}/{totalHabits}
            </div>
            <div className="text-xs text-slate-400">Hoy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{completionRate}%</div>
            <div className="text-xs text-slate-400">Completado</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Completados Hoy</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">{completedToday}</div>
            <div className="text-xs text-purple-400">de {totalHabits} hábitos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Mejor Racha</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{bestStreak}</div>
            <div className="text-xs text-green-400">días consecutivos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Rachas Activas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{activeStreaks}</div>
            <div className="text-xs text-blue-400">en progreso</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-400">Tasa de Éxito</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-orange-400">{completionRate}%</div>
            <div className="text-xs text-orange-400">esta semana</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Progreso */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progreso Semanal */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Progreso Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgressData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value, name, props) => [`${value}/${props.payload.total}`, props.payload.fullDay]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload
                      return data ? data.fullDay : label
                    }}
                  />
                  <Bar dataKey="completados" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Racha Mensual */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Racha Mensual</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streakData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="streakGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value, name, props) => [`${value} días`, props.payload.fullWeek]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload
                      return data ? data.fullWeek : label
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dias"
                    stroke="url(#streakGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mis Hábitos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Mis Hábitos</h2>
          <Button
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            onClick={() => setShowNewHabitDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Hábito
          </Button>
        </div>

        <div className="grid gap-4">
          {habits.map((habit) => (
            <Card
              key={habit.id}
              className={`bg-gradient-to-r ${habit.color}/10 border-l-4 ${
                habit.completedToday ? "border-l-green-500" : "border-l-slate-600"
              } border-slate-800 transition-all duration-300 hover:shadow-lg`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className="hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      {habit.completedToday ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-400 hover:text-green-400 transition-colors" />
                      )}
                    </button>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{habit.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{habit.name}</h3>
                          <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                            {habit.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{habit.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-orange-400" />
                            <span className="text-slate-300">{habit.streak} días</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-slate-300">Mejor: {habit.bestStreak}</span>
                          </div>
                          {habit.lastCompleted && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-400" />
                              <span className="text-slate-300">{habit.lastCompleted.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {habit.completedToday && (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">¡Completado!</Badge>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progreso semanal */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progreso semanal</span>
                    <span className="font-semibold">{habit.weeklyProgress}%</span>
                  </div>
                  <Progress value={habit.weeklyProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog Nuevo Hábito */}
      <Dialog open={showNewHabitDialog} onOpenChange={setShowNewHabitDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-400" />
              Nuevo Hábito
            </DialogTitle>
            <DialogDescription>Crea un nuevo hábito para mejorar tu rutina diaria</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del hábito</Label>
              <Input
                placeholder="Ej: Ejercicio matutino"
                className="bg-slate-800 border-slate-700"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Ej: 30 minutos de ejercicio cada mañana"
                className="bg-slate-800 border-slate-700"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salud">Salud</SelectItem>
                    <SelectItem value="Aprendizaje">Aprendizaje</SelectItem>
                    <SelectItem value="Bienestar">Bienestar</SelectItem>
                    <SelectItem value="Desarrollo Personal">Desarrollo Personal</SelectItem>
                    <SelectItem value="Productividad">Productividad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Icono</Label>
                <Select value={newHabit.icon} onValueChange={(value) => setNewHabit({ ...newHabit, icon: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="💪">💪 Ejercicio</SelectItem>
                    <SelectItem value="📚">📚 Lectura</SelectItem>
                    <SelectItem value="🧘">🧘 Meditación</SelectItem>
                    <SelectItem value="✍️">✍️ Escritura</SelectItem>
                    <SelectItem value="💧">💧 Agua</SelectItem>
                    <SelectItem value="🌅">🌅 Despertar temprano</SelectItem>
                    <SelectItem value="🎯">🎯 Objetivos</SelectItem>
                    <SelectItem value="⭐">⭐ General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowNewHabitDialog(false)}
                className="flex-1 border-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={addNewHabit} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Crear Hábito
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
