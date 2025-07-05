"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Apple,
  Droplets,
  Target,
  Plus,
  Search,
  Clock,
  Utensils,
  User,
  Scale,
  Ruler,
  CheckCircle,
  Circle,
  Edit,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const MACRO_COLORS = {
  proteinas: "#10b981",
  carbohidratos: "#3b82f6",
  grasas: "#f59e0b",
  fibra: "#8b5cf6",
}

const macroData = [
  { name: "Proteínas", value: 25, color: MACRO_COLORS.proteinas, target: 30 },
  { name: "Carbohidratos", value: 45, color: MACRO_COLORS.carbohidratos, target: 50 },
  { name: "Grasas", value: 18, color: MACRO_COLORS.grasas, target: 20 },
]

const weeklyProgressData = [
  { day: "Lun", calorias: 1850, objetivo: 2000 },
  { day: "Mar", calorias: 1920, objetivo: 2000 },
  { day: "Mié", calorias: 1780, objetivo: 2000 },
  { day: "Jue", calorias: 2100, objetivo: 2000 },
  { day: "Vie", calorias: 1950, objetivo: 2000 },
  { day: "Sáb", calorias: 2200, objetivo: 2000 },
  { day: "Dom", calorias: 1850, objetivo: 2000 },
]

export default function NutricionPage() {
  const [waterGlasses, setWaterGlasses] = useState(6)
  const [showFoodSearch, setShowFoodSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [foodResults, setFoodResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Perfil del usuario
  const [userProfile, setUserProfile] = useState({
    pesoActual: 75,
    altura: 175,
    pesoObjetivo: 70,
    edad: 28,
    genero: "masculino",
    nivelActividad: "moderado",
  })

  // Simular búsqueda en FatSecret API
  const searchFoods = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simulación de API call - en producción usarías la API real de FatSecret
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: "Avena integral", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, per: "30g" },
        { id: 2, name: "Plátano mediano", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, per: "1 unidad" },
        { id: 3, name: "Yogur griego natural", calories: 100, protein: 10, carbs: 6, fat: 5, per: "100g" },
        { id: 4, name: "Pollo pechuga", calories: 165, protein: 31, carbs: 0, fat: 3.6, per: "100g" },
        { id: 5, name: "Arroz integral cocido", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, per: "100g" },
      ].filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))

      setFoodResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }

  const meals = [
    {
      id: "desayuno",
      name: "Desayuno",
      time: "08:00",
      completed: true,
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 18,
      foods: ["Avena con frutas", "Yogur griego", "Café"],
    },
    {
      id: "almuerzo",
      name: "Almuerzo",
      time: "13:00",
      completed: true,
      calories: 650,
      protein: 40,
      carbs: 75,
      fat: 22,
      foods: ["Pollo a la plancha", "Arroz integral", "Ensalada"],
    },
    {
      id: "merienda",
      name: "Merienda",
      time: "16:30",
      completed: false,
      calories: 200,
      protein: 15,
      carbs: 20,
      fat: 8,
      foods: ["Frutos secos", "Fruta"],
    },
    {
      id: "cena",
      name: "Cena",
      time: "20:00",
      completed: false,
      calories: 550,
      protein: 30,
      carbs: 40,
      fat: 25,
      foods: [],
    },
  ]

  const totalCalories = meals.reduce((sum, meal) => (meal.completed ? sum + meal.calories : sum), 0)
  const targetCalories = 2000
  const completedMeals = meals.filter((meal) => meal.completed).length

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Nutrición</h1>
          <p className="text-slate-400 text-sm md:text-base">Alimenta tu cuerpo, nutre tu mente</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-400" />
            <span className="text-sm">{waterGlasses}/8 vasos</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowProfileEdit(true)}
            className="border-slate-700 bg-transparent"
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Calorías</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{totalCalories}</div>
            <div className="text-xs text-slate-400">de {targetCalories}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Comidas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{completedMeals}</div>
            <div className="text-xs text-slate-400">de 4 completadas</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Hidratación</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-cyan-400">{waterGlasses}</div>
            <div className="text-xs text-slate-400">vasos de agua</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Peso</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">{userProfile.pesoActual}kg</div>
            <div className="text-xs text-slate-400">objetivo: {userProfile.pesoObjetivo}kg</div>
          </CardContent>
        </Card>
      </div>

      {/* Perfil Físico y Objetivos */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              <div>
                <CardTitle className="text-lg">Mi Perfil Físico</CardTitle>
                <CardDescription className="text-sm">Tu progreso hacia tus objetivos</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowProfileEdit(true)}
              className="bg-green-600 hover:bg-green-700 border-green-600 text-white text-xs px-3 py-1 h-8"
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">Peso Actual</span>
              </div>
              <div className="text-2xl font-bold">{userProfile.pesoActual} kg</div>
              <div className="text-xs text-slate-400">
                {userProfile.pesoActual > userProfile.pesoObjetivo
                  ? `${userProfile.pesoActual - userProfile.pesoObjetivo}kg por perder`
                  : `${userProfile.pesoObjetivo - userProfile.pesoActual}kg por ganar`}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-400">Altura</span>
              </div>
              <div className="text-2xl font-bold">{userProfile.altura} cm</div>
              <div className="text-xs text-slate-400">
                IMC: {(userProfile.pesoActual / Math.pow(userProfile.altura / 100, 2)).toFixed(1)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-400">Objetivo</span>
              </div>
              <div className="text-2xl font-bold">{userProfile.pesoObjetivo} kg</div>
              <Progress
                value={Math.abs((userProfile.pesoActual - userProfile.pesoObjetivo) / userProfile.pesoActual) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidratación */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-lg">Hidratación Diaria</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Progreso del día</span>
              <span className="font-semibold">{waterGlasses}/8 vasos</span>
            </div>
            <Progress value={(waterGlasses / 8) * 100} className="h-3" />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                variant="outline"
                className="border-slate-700"
              >
                -1
              </Button>
              <Button
                size="sm"
                onClick={() => setWaterGlasses(Math.min(12, waterGlasses + 1))}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                +1 Vaso
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis Nutricional */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribución de Macronutrientes */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-lg">Macronutrientes Hoy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}g`, "Consumido"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {macroData.map((macro, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-slate-300">{macro.name}</span>
                  </div>
                  <span className="font-semibold">
                    {macro.value}g / {macro.target}g
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progreso Semanal */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Progreso Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="calorias" fill="#10b981" name="Consumidas" />
                  <Bar dataKey="objetivo" fill="#374151" name="Objetivo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan de Comidas */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-red-400" />
              <div>
                <CardTitle className="text-lg">Plan de Comidas de Hoy</CardTitle>
                <CardDescription className="text-sm">
                  {targetCalories} kcal planificadas • {completedMeals} de {meals.length} completadas
                </CardDescription>
              </div>
            </div>
            <Button size="sm" onClick={() => setShowFoodSearch(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Comida
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {meal.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                    <div>
                      <h3 className="font-semibold">{meal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{meal.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meal.completed ? (
                    <Badge className="bg-green-600 hover:bg-green-700">Completado</Badge>
                  ) : (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Marcar
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Calorías</span>
                  <div className="font-semibold">{meal.calories}</div>
                </div>
                <div>
                  <span className="text-slate-400">Proteína</span>
                  <div className="font-semibold">{meal.protein}g</div>
                </div>
                <div>
                  <span className="text-slate-400">Carbos</span>
                  <div className="font-semibold">{meal.carbs}g</div>
                </div>
                <div>
                  <span className="text-slate-400">Grasas</span>
                  <div className="font-semibold">{meal.fat}g</div>
                </div>
              </div>

              {meal.foods.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meal.foods.map((food, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                      {food}
                    </Badge>
                  ))}
                </div>
              )}

              {!meal.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedMeal(meal.id)
                    setShowFoodSearch(true)
                  }}
                  className="border-slate-700 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar alimentos
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dialog para búsqueda de alimentos */}
      <Dialog open={showFoodSearch} onOpenChange={setShowFoodSearch}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar Alimentos</DialogTitle>
            <DialogDescription>Busca y agrega alimentos a tu plan nutricional</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar alimentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
              <Button onClick={() => searchFoods(searchQuery)} disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isSearching && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                <p className="text-sm text-slate-400 mt-2">Buscando alimentos...</p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {foodResults.map((food: any) => (
                <div key={food.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div>
                    <h4 className="font-semibold">{food.name}</h4>
                    <p className="text-sm text-slate-400">
                      {food.calories} kcal • {food.protein}g prot • {food.carbs}g carbs • {food.fat}g grasas
                    </p>
                    <p className="text-xs text-slate-500">Por {food.per}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar perfil */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle>Editar Perfil Físico</DialogTitle>
            <DialogDescription>Actualiza tu información para obtener recomendaciones más precisas</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso Actual (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={userProfile.pesoActual}
                onChange={(e) => setUserProfile({ ...userProfile, pesoActual: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                value={userProfile.altura}
                onChange={(e) => setUserProfile({ ...userProfile, altura: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objetivo">Peso Objetivo (kg)</Label>
              <Input
                id="objetivo"
                type="number"
                value={userProfile.pesoObjetivo}
                onChange={(e) => setUserProfile({ ...userProfile, pesoObjetivo: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={userProfile.edad}
                onChange={(e) => setUserProfile({ ...userProfile, edad: Number(e.target.value) })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={userProfile.genero}
                onValueChange={(value) => setUserProfile({ ...userProfile, genero: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actividad">Nivel de Actividad</Label>
              <Select
                value={userProfile.nivelActividad}
                onValueChange={(value) => setUserProfile({ ...userProfile, nivelActividad: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentario</SelectItem>
                  <SelectItem value="ligero">Actividad Ligera</SelectItem>
                  <SelectItem value="moderado">Actividad Moderada</SelectItem>
                  <SelectItem value="intenso">Actividad Intensa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setShowProfileEdit(false)} className="bg-green-600 hover:bg-green-700 flex-1">
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={() => setShowProfileEdit(false)} className="border-slate-700">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
