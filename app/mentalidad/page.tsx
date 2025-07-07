"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Heart,
  Star,
  Plus,
  CheckCircle,
  Circle,
  Zap,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Datos de progreso en diferentes áreas
const mentalProgressData = [
  { area: "Confianza", progreso: 75, objetivo: 90, color: "#3b82f6" },
  { area: "Resiliencia", progreso: 68, objetivo: 85, color: "#10b981" },
  { area: "Enfoque", progreso: 82, objetivo: 95, color: "#f59e0b" },
  { area: "Creatividad", progreso: 60, objetivo: 80, color: "#8b5cf6" },
  { area: "Liderazgo", progreso: 55, objetivo: 75, color: "#ef4444" },
  { area: "Comunicación", progreso: 70, objetivo: 85, color: "#06b6d4" },
]

// Datos de progreso semanal
const weeklyMentalData = [
  { day: "Lun", puntuacion: 7.2, fullDay: "Lunes" },
  { day: "Mar", puntuacion: 8.1, fullDay: "Martes" },
  { day: "Mié", puntuacion: 6.8, fullDay: "Miércoles" },
  { day: "Jue", puntuacion: 8.5, fullDay: "Jueves" },
  { day: "Vie", puntuacion: 7.9, fullDay: "Viernes" },
  { day: "Sáb", puntuacion: 8.3, fullDay: "Sábado" },
  { day: "Dom", puntuacion: 7.6, fullDay: "Domingo" },
]

interface MentalGoal {
  id: string
  title: string
  description: string
  category: string
  progress: number
  target: number
  completed: boolean
  exercises: string[]
  resources: string[]
  dailyPractice: boolean
}

interface Reflection {
  id: string
  date: Date
  mood: number
  gratitude: string[]
  challenges: string
  achievements: string
  tomorrow: string
}

export default function MentalidadPage() {
  const [mentalGoals, setMentalGoals] = useState<MentalGoal[]>([
    {
      id: "1",
      title: "Desarrollar Confianza",
      description: "Mejorar la autoestima y confianza en situaciones sociales y profesionales",
      category: "Autoestima",
      progress: 75,
      target: 100,
      completed: false,
      exercises: ["Afirmaciones diarias", "Visualización de éxito", "Registro de logros"],
      resources: ["Libro: El Poder de la Confianza", "Podcast: Mindset Growth", "Video: Técnicas de PNL"],
      dailyPractice: true,
    },
    {
      id: "2",
      title: "Gestión del Estrés",
      description: "Aprender técnicas efectivas para manejar el estrés y la ansiedad",
      category: "Bienestar",
      progress: 60,
      target: 100,
      completed: false,
      exercises: ["Respiración profunda", "Meditación mindfulness", "Ejercicio físico regular"],
      resources: ["App: Headspace", "Curso: Gestión del Estrés", "Libro: El Arte de No Amargarse la Vida"],
      dailyPractice: true,
    },
    {
      id: "3",
      title: "Mejorar Comunicación",
      description: "Desarrollar habilidades de comunicación asertiva y empática",
      category: "Habilidades Sociales",
      progress: 45,
      target: 100,
      completed: false,
      exercises: ["Práctica de escucha activa", "Role playing", "Feedback constructivo"],
      resources: ["Taller: Comunicación Efectiva", "Libro: Comunicación No Violenta", "Video: Lenguaje Corporal"],
      dailyPractice: false,
    },
  ])

  const [reflections, setReflections] = useState<Reflection[]>([
    {
      id: "1",
      date: new Date(),
      mood: 8,
      gratitude: ["Familia saludable", "Nuevo proyecto", "Buen clima"],
      challenges: "Dificultad para concentrarme en la tarde",
      achievements: "Completé la presentación importante",
      tomorrow: "Empezar el día con meditación de 10 minutos",
    },
  ])

  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [showReflectionDialog, setShowReflectionDialog] = useState(false)
  const [showResourcesDialog, setShowResourcesDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<MentalGoal | null>(null)

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    exercises: "",
    resources: "",
  })

  const [dailyReflection, setDailyReflection] = useState({
    mood: 5,
    gratitude: ["", "", ""],
    challenges: "",
    achievements: "",
    tomorrow: "",
  })

  // Cargar datos almacenados
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("mentalidad-data")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.mentalGoals) setMentalGoals(parsed.mentalGoals)
        if (parsed.reflections)
          setReflections(
            parsed.reflections.map((r: any) => ({ ...r, date: new Date(r.date) }))
          )
      }
    } catch (err) {
      console.error("Error loading mentalidad-data", err)
    }
  }, [])

  // Guardar datos
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "mentalidad-data",
        JSON.stringify({
          mentalGoals,
          reflections: reflections.map((r) => ({ ...r, date: r.date })),
        })
      )
    } catch (err) {
      console.error("Error saving mentalidad-data", err)
    }
  }, [mentalGoals, reflections])

  const toggleGoalCompletion = (goalId: string) => {
    setMentalGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? { ...goal, completed: !goal.completed, progress: !goal.completed ? 100 : goal.progress }
          : goal,
      ),
    )
  }

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setMentalGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, progress: newProgress, completed: newProgress >= goal.target } : goal,
      ),
    )
  }

  const addNewGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: MentalGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category || "General",
      progress: 0,
      target: 100,
      completed: false,
      exercises: newGoal.exercises
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e),
      resources: newGoal.resources
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r),
      dailyPractice: false,
    }

    setMentalGoals((prev) => [...prev, goal])
    setNewGoal({ title: "", description: "", category: "", exercises: "", resources: "" })
    setShowNewGoalDialog(false)
  }

  const saveReflection = () => {
    const reflection: Reflection = {
      id: Date.now().toString(),
      date: new Date(),
      mood: dailyReflection.mood,
      gratitude: dailyReflection.gratitude.filter((g) => g.trim()),
      challenges: dailyReflection.challenges,
      achievements: dailyReflection.achievements,
      tomorrow: dailyReflection.tomorrow,
    }

    setReflections((prev) => [reflection, ...prev])
    setDailyReflection({
      mood: 5,
      gratitude: ["", "", ""],
      challenges: "",
      achievements: "",
      tomorrow: "",
    })
    setShowReflectionDialog(false)
  }

  const averageProgress = Math.round(mentalGoals.reduce((sum, goal) => sum + goal.progress, 0) / mentalGoals.length)
  const completedGoals = mentalGoals.filter((goal) => goal.completed).length
  const dailyPractices = mentalGoals.filter((goal) => goal.dailyPractice).length

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Mentalidad
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Fortalece tu mente, transforma tu vida</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{averageProgress}%</div>
            <div className="text-xs text-slate-400">Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{completedGoals}</div>
            <div className="text-xs text-slate-400">Objetivos</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Progreso Mental</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">{averageProgress}%</div>
            <div className="text-xs text-purple-400">desarrollo general</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Objetivos</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{completedGoals}</div>
            <div className="text-xs text-green-400">completados</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Prácticas Diarias</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{dailyPractices}</div>
            <div className="text-xs text-blue-400">activas</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-400">Bienestar</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-orange-400">8.2</div>
            <div className="text-xs text-orange-400">puntuación promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Progreso */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart - Áreas de Desarrollo */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Áreas de Desarrollo Mental</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mentalProgressData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Radar
                    name="Progreso Actual"
                    dataKey="progreso"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Objetivo"
                    dataKey="objetivo"
                    stroke="#10b981"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progreso Semanal */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Bienestar Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyMentalData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="mentalGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value, name, props) => [`${value}/10`, props.payload.fullDay]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload
                      return data ? data.fullDay : label
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="puntuacion"
                    stroke="url(#mentalGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objetivos de Desarrollo Mental */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Objetivos de Desarrollo</h2>
          <Button
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            onClick={() => setShowNewGoalDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Objetivo
          </Button>
        </div>

        <div className="grid gap-4">
          {mentalGoals.map((goal) => (
            <Card
              key={goal.id}
              className={`bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-800 transition-all duration-300 hover:shadow-lg ${
                goal.completed ? "border-l-4 border-l-green-500" : "border-l-4 border-l-purple-500"
              }`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleGoalCompletion(goal.id)}
                      className="hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      {goal.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-400 hover:text-green-400 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                          {goal.category}
                        </Badge>
                        {goal.dailyPractice && (
                          <Badge className="text-xs bg-blue-600 text-white">Práctica Diaria</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{goal.description}</p>

                      {/* Progreso con control deslizante */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progreso en confianza</span>
                          <span className="font-semibold">{goal.progress}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={goal.progress} className="flex-1 h-2" />
                          <Input
                            type="range"
                            min="0"
                            max="100"
                            value={goal.progress}
                            onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                            className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {goal.completed && (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">¡Completado!</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setShowResourcesDialog(true)
                      }}
                      className="border-slate-700 bg-transparent"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Recursos
                    </Button>
                  </div>
                </div>

                {/* Ejercicios */}
                {goal.exercises.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-300">Ejercicios recomendados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {goal.exercises.map((exercise, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-slate-700/50 text-slate-300 border border-slate-600/50"
                        >
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reflexión Diaria */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              <div>
                <CardTitle className="text-lg">Reflexión Diaria</CardTitle>
                <CardDescription className="text-sm">
                  Conecta contigo mismo y registra tu crecimiento personal
                </CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setShowReflectionDialog(true)}
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reflexión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reflections.length > 0 ? (
            <div className="space-y-4">
              {reflections.slice(0, 3).map((reflection) => (
                <div key={reflection.id} className="p-4 bg-slate-800/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{reflection.date.toLocaleDateString()}</span>
                      <Badge className="bg-pink-600 text-white">Estado: {reflection.mood}/10</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Gratitud:</h4>
                      <ul className="text-slate-400 space-y-1">
                        {reflection.gratitude.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Logros:</h4>
                      <p className="text-slate-400">{reflection.achievements}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Comienza tu viaje de autoconocimiento con tu primera reflexión</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Nuevo Objetivo */}
      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-400" />
              Nuevo Objetivo Mental
            </DialogTitle>
            <DialogDescription>Define un nuevo objetivo para tu desarrollo personal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título del objetivo</Label>
              <Input
                placeholder="Ej: Desarrollar confianza"
                className="bg-slate-800 border-slate-700"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe tu objetivo en detalle..."
                className="bg-slate-800 border-slate-700"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Autoestima">Autoestima</SelectItem>
                  <SelectItem value="Bienestar">Bienestar</SelectItem>
                  <SelectItem value="Habilidades Sociales">Habilidades Sociales</SelectItem>
                  <SelectItem value="Liderazgo">Liderazgo</SelectItem>
                  <SelectItem value="Creatividad">Creatividad</SelectItem>
                  <SelectItem value="Resiliencia">Resiliencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ejercicios (separados por comas)</Label>
              <Textarea
                placeholder="Ej: Afirmaciones diarias, Visualización, Meditación"
                className="bg-slate-800 border-slate-700"
                value={newGoal.exercises}
                onChange={(e) => setNewGoal({ ...newGoal, exercises: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Recursos (separados por comas)</Label>
              <Textarea
                placeholder="Ej: Libro X, Curso Y, App Z"
                className="bg-slate-800 border-slate-700"
                value={newGoal.resources}
                onChange={(e) => setNewGoal({ ...newGoal, resources: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewGoalDialog(false)} className="flex-1 border-slate-700">
                Cancelar
              </Button>
              <Button onClick={addNewGoal} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Crear Objetivo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Reflexión Diaria */}
      <Dialog open={showReflectionDialog} onOpenChange={setShowReflectionDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              Reflexión Diaria
            </DialogTitle>
            <DialogDescription>Tómate un momento para reflexionar sobre tu día</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>¿Cómo te sientes hoy? (1-10)</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={dailyReflection.mood}
                  onChange={(e) => setDailyReflection({ ...dailyReflection, mood: Number(e.target.value) })}
                  className="flex-1"
                />
                <Badge className="bg-pink-600 text-white min-w-[3rem]">{dailyReflection.mood}/10</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>3 cosas por las que estoy agradecido:</Label>
              {dailyReflection.gratitude.map((item, index) => (
                <Input
                  key={index}
                  placeholder={`Gratitud ${index + 1}`}
                  className="bg-slate-800 border-slate-700"
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...dailyReflection.gratitude]
                    newGratitude[index] = e.target.value
                    setDailyReflection({ ...dailyReflection, gratitude: newGratitude })
                  }}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label>¿Qué desafíos enfrenté hoy?</Label>
              <Textarea
                placeholder="Describe los desafíos del día..."
                className="bg-slate-800 border-slate-700"
                value={dailyReflection.challenges}
                onChange={(e) => setDailyReflection({ ...dailyReflection, challenges: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>¿Qué logré hoy?</Label>
              <Textarea
                placeholder="Celebra tus logros del día..."
                className="bg-slate-800 border-slate-700"
                value={dailyReflection.achievements}
                onChange={(e) => setDailyReflection({ ...dailyReflection, achievements: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>¿Qué haré diferente mañana?</Label>
              <Textarea
                placeholder="Tu intención para mañana..."
                className="bg-slate-800 border-slate-700"
                value={dailyReflection.tomorrow}
                onChange={(e) => setDailyReflection({ ...dailyReflection, tomorrow: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReflectionDialog(false)}
                className="flex-1 border-slate-700"
              >
                Cancelar
              </Button>
              <Button onClick={saveReflection} className="flex-1 bg-pink-600 hover:bg-pink-700">
                Guardar Reflexión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Recursos */}
      <Dialog open={showResourcesDialog} onOpenChange={setShowResourcesDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Recursos para: {selectedGoal?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-slate-300">Recursos recomendados:</h4>
                <div className="space-y-2">
                  {selectedGoal.resources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => setShowResourcesDialog(false)} className="w-full bg-blue-600 hover:bg-blue-700">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
