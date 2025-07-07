"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Clock,
  Flame,
  Target,
  Plus,
  Play,
  CheckCircle,
  Circle,
  Edit,
  Calendar,
  TrendingUp,
  Dumbbell,
  Heart,
  Zap,
  Weight,
  RotateCcw,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

export default function EntrenamientoPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [showNewWorkoutDialog, setShowNewWorkoutDialog] = useState(false)

  // Datos del progreso semanal
  const weeklyStats = {
    entrenamientos: 4,
    calorias: 1250,
    minutos: 180,
    completado: 67,
    metaSemanal: 6,
  }

  // Datos de tiempo por día
  const timeData = [
    { day: "Lun", tiempo: 45, fullDay: "Lunes" },
    { day: "Mar", tiempo: 60, fullDay: "Martes" },
    { day: "Mié", tiempo: 0, fullDay: "Miércoles" },
    { day: "Jue", tiempo: 50, fullDay: "Jueves" },
    { day: "Vie", tiempo: 40, fullDay: "Viernes" },
    { day: "Sáb", tiempo: 0, fullDay: "Sábado" },
    { day: "Dom", tiempo: 35, fullDay: "Domingo" },
  ]

  // Entrenamientos de hoy
  const [todayWorkouts, setTodayWorkouts] = useState([
    {
      id: "fuerza-superior",
      name: "Pecho y Tríceps",
      category: "Fuerza",
      level: "intermediate",
      duration: 45,
      calories: 320,
      exercises: [
        { name: "Press de banca", sets: 4, reps: 10, weight: 80 },
        { name: "Press inclinado", sets: 3, reps: 12, weight: 60 },
        { name: "Fondos", sets: 3, reps: 15, weight: 0 },
        { name: "Extensiones tríceps", sets: 3, reps: 12, weight: 25 },
      ],
      completed: false,
      note: "Aumentar peso en press de banca",
      color: "border-red-500",
      day: "Lunes",
    },
    {
      id: "cardio-hiit",
      name: "Piernas",
      category: "Fuerza",
      level: "advanced",
      duration: 60,
      calories: 400,
      exercises: [
        { name: "Sentadillas", sets: 4, reps: 12, weight: 100 },
        { name: "Peso muerto", sets: 4, reps: 8, weight: 120 },
        { name: "Prensa", sets: 3, reps: 15, weight: 200 },
        { name: "Extensiones cuádriceps", sets: 3, reps: 12, weight: 40 },
      ],
      completed: true,
      note: "Excelente sesión, muy intensa",
      color: "border-purple-500",
      day: "Martes",
    },
    {
      id: "yoga-flexibilidad",
      name: "Espalda y Bíceps",
      category: "Fuerza",
      level: "intermediate",
      duration: 50,
      calories: 280,
      exercises: [
        { name: "Dominadas", sets: 4, reps: 8, weight: 0 },
        { name: "Remo con barra", sets: 4, reps: 10, weight: 70 },
        { name: "Curl con barra", sets: 3, reps: 12, weight: 30 },
        { name: "Martillo", sets: 3, reps: 12, weight: 15 },
      ],
      completed: false,
      note: "",
      color: "border-green-500",
      day: "Miércoles",
    },
  ])

  // Cargar entrenamientos almacenados
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("entrenamiento-data")
      if (stored) {
        setTodayWorkouts(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Error loading entrenamiento-data", err)
    }
  }, [])

  // Guardar entrenamientos
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "entrenamiento-data",
        JSON.stringify(todayWorkouts)
      )
    } catch (err) {
      console.error("Error saving entrenamiento-data", err)
    }
  }, [todayWorkouts])

  // Próximos entrenamientos
  const upcomingWorkouts = [
    {
      id: "cardio-matutino",
      name: "Cardio Matutino",
      day: "Jueves",
      duration: 30,
      intensity: "Intensidad media",
      status: "Programado",
    },
    {
      id: "fuerza-inferior",
      name: "Hombros y Abdomen",
      day: "Viernes",
      duration: 45,
      intensity: "Alta intensidad",
      status: "Programado",
    },
  ]

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    category: "",
    level: "beginner",
    duration: 30,
    day: "",
    exercises: [],
  })

  const toggleWorkoutCompletion = (workoutId: string) => {
    setTodayWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              completed: !workout.completed,
            }
          : workout,
      ),
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Principiante"
      case "intermediate":
        return "Intermedio"
      case "advanced":
        return "Avanzado"
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="w-full max-w-none mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Entrenamiento
            </h1>
            <p className="text-slate-400 text-sm md:text-base">Mantén tu cuerpo fuerte y saludable</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Activity className="h-4 w-4" />
              <span>
                {weeklyStats.entrenamientos}/{weeklyStats.metaSemanal} esta semana
              </span>
            </div>
          </div>
        </div>

        {/* Progreso Semanal */}
        <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-800/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <div>
                <CardTitle className="text-lg text-white">Progreso Semanal</CardTitle>
                <CardDescription className="text-slate-300">
                  Tu rendimiento y consistencia en el entrenamiento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{weeklyStats.entrenamientos}</div>
                <div className="text-sm text-slate-400">Entrenamientos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400">{weeklyStats.calorias}</div>
                <div className="text-sm text-slate-400">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{weeklyStats.minutos}</div>
                <div className="text-sm text-slate-400">Minutos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-400">{weeklyStats.completado}%</div>
                <div className="text-sm text-slate-400">Completado</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Meta semanal</span>
                <span>
                  {weeklyStats.entrenamientos}/{weeklyStats.metaSemanal}
                </span>
              </div>
              <Progress value={weeklyStats.completado} className="h-2 bg-slate-800" />
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Tiempo por Día */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Tiempo de Entrenamiento Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value, name, props) => [`${value} min`, props.payload.fullDay]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload
                      return data ? data.fullDay : label
                    }}
                  />
                  <Bar dataKey="tiempo" fill="url(#timeGradient)" name="Minutos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Entrenamientos de Hoy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Entrenamientos de Hoy</h2>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowNewWorkoutDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Entrenamiento
            </Button>
          </div>
          <div className="space-y-4">
            {todayWorkouts.map((workout) => (
              <Card key={workout.id} className={`bg-slate-900/50 border-slate-800 ${workout.color}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleWorkoutCompletion(workout.id)}
                            className="hover:scale-110 transition-all duration-200 cursor-pointer"
                          >
                            {workout.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-400 hover:text-green-400 transition-colors flex-shrink-0" />
                            )}
                          </button>
                          <div>
                            <h3 className="font-semibold text-white text-base md:text-lg">{workout.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                                {workout.category}
                              </Badge>
                              <Badge variant="outline" className={`text-xs border ${getLevelColor(workout.level)}`}>
                                {getLevelText(workout.level)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"
                              >
                                {workout.day}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {workout.completed ? (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white">Completado</Badge>
                          ) : (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <Play className="h-4 w-4 mr-1" />
                              Comenzar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <Input
                            type="number"
                            value={workout.duration}
                            onChange={(e) => {
                              const newDuration = Number.parseInt(e.target.value) || 0
                              setTodayWorkouts((prev) =>
                                prev.map((w) => (w.id === workout.id ? { ...w, duration: newDuration } : w)),
                              )
                            }}
                            className="w-16 h-6 text-xs bg-slate-800 border-slate-700 text-center"
                          />
                          <span>min</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Flame className="h-4 w-4 text-slate-400" />
                          <span>{workout.calories} cal</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Dumbbell className="h-4 w-4 text-slate-400" />
                          <span>{workout.exercises.length} ejercicios</span>
                        </div>
                      </div>

                      {/* Ejercicios con pesos y repeticiones */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-300">Ejercicios:</h4>
                        <div className="grid gap-2">
                          {workout.exercises.map((exercise, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-slate-800/30 rounded text-xs"
                            >
                              <span className="text-slate-300">{exercise.name}</span>
                              <div className="flex items-center gap-2 text-slate-400">
                                <div className="flex items-center gap-1">
                                  <RotateCcw className="h-3 w-3" />
                                  <span>
                                    {exercise.sets}x{exercise.reps}
                                  </span>
                                </div>
                                {exercise.weight > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Weight className="h-3 w-3" />
                                    <span>{exercise.weight}kg</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {workout.note && <div className="text-sm text-slate-400 italic">"{workout.note}"</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Próximos Entrenamientos */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div>
                <CardTitle className="text-lg text-white">Próximos Entrenamientos</CardTitle>
                <CardDescription className="text-slate-400">
                  Tu plan de entrenamiento para los próximos días
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{workout.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    <span>{workout.day}</span>
                    <span>•</span>
                    <span>{workout.duration} min</span>
                    <span>•</span>
                    <span>{workout.intensity}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                  {workout.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-400">Cardio</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-red-400">2</div>
              <div className="text-xs text-slate-400">esta semana</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Fuerza</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-blue-400">1</div>
              <div className="text-xs text-slate-400">esta semana</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-slate-400">HIIT</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-yellow-400">1</div>
              <div className="text-xs text-slate-400">esta semana</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-400">Flexibilidad</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-green-400">0</div>
              <div className="text-xs text-slate-400">esta semana</div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog Nuevo Entrenamiento */}
        <Dialog open={showNewWorkoutDialog} onOpenChange={setShowNewWorkoutDialog}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                Nuevo Entrenamiento
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del entrenamiento</Label>
                <Input
                  placeholder="Ej: Pecho y Tríceps"
                  className="bg-slate-800 border-slate-700"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select
                    value={newWorkout.category}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, category: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuerza">Fuerza</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="flexibilidad">Flexibilidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel</Label>
                  <Select
                    value={newWorkout.level}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, level: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duración (min)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    className="bg-slate-800 border-slate-700"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: Number.parseInt(e.target.value) || 30 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Día</Label>
                  <Select
                    value={newWorkout.day}
                    onValueChange={(value) => setNewWorkout({ ...newWorkout, day: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lunes">Lunes</SelectItem>
                      <SelectItem value="Martes">Martes</SelectItem>
                      <SelectItem value="Miércoles">Miércoles</SelectItem>
                      <SelectItem value="Jueves">Jueves</SelectItem>
                      <SelectItem value="Viernes">Viernes</SelectItem>
                      <SelectItem value="Sábado">Sábado</SelectItem>
                      <SelectItem value="Domingo">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewWorkoutDialog(false)}
                  className="flex-1 border-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Aquí se agregaría la lógica para crear el entrenamiento
                    setShowNewWorkoutDialog(false)
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Crear Entrenamiento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
