"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Apple,
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
  AlertCircle,
  Trash2,
  Save,
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

const weeklyProgressData = [
  { day: "Lun", calorias: 1850, objetivo: 2000, fullDay: "Lunes" },
  { day: "Mar", calorias: 1920, objetivo: 2000, fullDay: "Martes" },
  { day: "Mié", calorias: 1780, objetivo: 2000, fullDay: "Miércoles" },
  { day: "Jue", calorias: 2100, objetivo: 2000, fullDay: "Jueves" },
  { day: "Vie", calorias: 1950, objetivo: 2000, fullDay: "Viernes" },
  { day: "Sáb", calorias: 2200, objetivo: 2000, fullDay: "Sábado" },
  { day: "Dom", calorias: 1850, objetivo: 2000, fullDay: "Domingo" },
]

export default function NutricionPage() {
  const [showFoodSearch, setShowFoodSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showEditMeal, setShowEditMeal] = useState(false)
  const [foodResults, setFoodResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString())

  // Perfil del usuario
  const [userProfile, setUserProfile] = useState({
    pesoActual: 75,
    altura: 175,
    pesoObjetivo: 70,
    edad: 28,
    genero: "masculino",
    nivelActividad: "moderado",
  })

  // Estado de las comidas con alimentos agregados
  const [meals, setMeals] = useState([
    {
      id: "desayuno",
      name: "Desayuno",
      time: "08:00",
      completed: true,
      foods: [
        { id: "1", name: "Avena integral", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, quantity: 50 },
        { id: "2", name: "Banana mediana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, quantity: 1 },
        { id: "3", name: "Yogur griego natural", calories: 100, protein: 10, carbs: 6, fat: 5, quantity: 150 },
      ],
    },
    {
      id: "almuerzo",
      name: "Almuerzo",
      time: "13:00",
      completed: true,
      foods: [
        { id: "4", name: "Pollo pechuga sin piel", calories: 165, protein: 31, carbs: 0, fat: 3.6, quantity: 150 },
        { id: "5", name: "Arroz integral cocido", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, quantity: 100 },
        { id: "6", name: "Brócoli cocido", calories: 35, protein: 2.4, carbs: 7, fat: 0.4, quantity: 100 },
      ],
    },
    {
      id: "merienda",
      name: "Merienda",
      time: "16:30",
      completed: false,
      foods: [{ id: "7", name: "Almendras", calories: 579, protein: 21, carbs: 22, fat: 50, quantity: 30 }],
    },
    {
      id: "cena",
      name: "Cena",
      time: "20:00",
      completed: false,
      foods: [
        { id: "8", name: "Salmón atlántico", calories: 208, protein: 25, carbs: 0, fat: 12, quantity: 120 },
        { id: "9", name: "Quinoa cocida", calories: 120, protein: 4.4, carbs: 22, fat: 1.9, quantity: 80 },
      ],
    },
  ])

  // Estado para editar comida
  const [editingMeal, setEditingMeal] = useState(null)
  const [editingFoods, setEditingFoods] = useState([])

  // Cargar datos almacenados
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("nutricion-data")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.userProfile) setUserProfile(parsed.userProfile)
        if (parsed.meals) setMeals(parsed.meals)
        if (parsed.lastResetDate) setLastResetDate(parsed.lastResetDate)
      }
    } catch (err) {
      console.error("Error loading nutricion-data", err)
    }
  }, [])

  // Guardar datos
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "nutricion-data",
        JSON.stringify({ userProfile, meals, lastResetDate })
      )
    } catch (err) {
      console.error("Error saving nutricion-data", err)
    }
  }, [userProfile, meals, lastResetDate])

  // Verificar si necesita reset a medianoche
  useEffect(() => {
    const checkMidnightReset = () => {
      if (typeof window === "undefined") return
      const currentDate = new Date().toDateString()
      if (currentDate !== lastResetDate) {
        // Reset de comidas a medianoche
        setMeals(
          meals.map((meal) => ({
            ...meal,
            completed: false,
            foods: [],
          })),
        )
        setLastResetDate(currentDate)
        console.log("Reset de comidas a medianoche ejecutado")
      }
    }

    // Verificar cada minuto
    const interval = setInterval(checkMidnightReset, 60000)

    // Verificar inmediatamente
    checkMidnightReset()

    return () => clearInterval(interval)
  }, [lastResetDate, meals])

  // Calcular totales dinámicamente
  const calculateMealTotals = (foods) => {
    return foods.reduce(
      (totals, food) => {
        const factor = food.quantity / 100 // Factor de conversión por 100g
        return {
          calories: totals.calories + food.calories * factor,
          protein: totals.protein + food.protein * factor,
          carbs: totals.carbs + food.carbs * factor,
          fat: totals.fat + food.fat * factor,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  // Calcular totales del día
  const dailyTotals = useMemo(() => {
    return meals.reduce(
      (totals, meal) => {
        if (meal.completed) {
          const mealTotals = calculateMealTotals(meal.foods)
          return {
            calories: totals.calories + mealTotals.calories,
            protein: totals.protein + mealTotals.protein,
            carbs: totals.carbs + mealTotals.carbs,
            fat: totals.fat + mealTotals.fat,
          }
        }
        return totals
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }, [meals])

  // Objetivos de macronutrientes
  const macroTargets = {
    protein: 150, // gramos
    carbs: 200, // gramos
    fat: 70, // gramos
  }

  // Datos de macronutrientes dinámicos
  const macroData = [
    {
      name: "Proteínas",
      value: Math.round(dailyTotals.protein),
      color: MACRO_COLORS.proteinas,
      target: macroTargets.protein,
    },
    {
      name: "Carbohidratos",
      value: Math.round(dailyTotals.carbs),
      color: MACRO_COLORS.carbohidratos,
      target: macroTargets.carbs,
    },
    { name: "Grasas", value: Math.round(dailyTotals.fat), color: MACRO_COLORS.grasas, target: macroTargets.fat },
  ]

  // Función para toggle de comidas
  const toggleMealCompletion = (mealId: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) => (meal.id === mealId ? { ...meal, completed: !meal.completed } : meal)),
    )
  }

  // Función para agregar alimento a comida
  const addFoodToMeal = (mealId: string, food: any) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              foods: [
                ...meal.foods,
                {
                  id: Date.now().toString(),
                  name: food.name,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                  quantity: 100, // Cantidad por defecto
                },
              ],
            }
          : meal,
      ),
    )
  }

  // Función para editar comida
  const startEditMeal = (meal) => {
    setEditingMeal(meal)
    setEditingFoods([...meal.foods])
    setShowEditMeal(true)
  }

  // Función para actualizar cantidad de alimento
  const updateFoodQuantity = (foodId: string, newQuantity: number) => {
    setEditingFoods(editingFoods.map((food) => (food.id === foodId ? { ...food, quantity: newQuantity } : food)))
  }

  // Función para eliminar alimento
  const removeFoodFromMeal = (foodId: string) => {
    setEditingFoods(editingFoods.filter((food) => food.id !== foodId))
  }

  // Función para guardar cambios en comida
  const saveMealChanges = () => {
    setMeals(meals.map((meal) => (meal.id === editingMeal.id ? { ...meal, foods: editingFoods } : meal)))
    setShowEditMeal(false)
    setEditingMeal(null)
    setEditingFoods([])
  }

  // Búsqueda en FatSecret API
  const searchFoods = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    setSearchError("")
    setFoodResults([])

    try {
      const response = await fetch("/api/fatsecret/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Error en la búsqueda")
      }

      setFoodResults(data.foods || [])

      if (data.foods && data.foods.length === 0) {
        setSearchError(`No se encontraron resultados para "${query}". Intenta con términos más específicos.`)
      }
    } catch (error) {
      console.error("Error searching foods:", error)
      setSearchError(error instanceof Error ? error.message : "Error al buscar alimentos")
      setFoodResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const targetCalories = 2000
  const completedMeals = meals.filter((meal) => meal.completed).length

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Nutrición
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Alimenta tu cuerpo, nutre tu mente</p>
        </div>
      </div>

      {/* Perfil Físico y Objetivos */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
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
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-green-600 text-white text-xs px-3 py-1 h-8 shadow-lg"
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg p-4 space-y-2 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">Peso Actual</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{userProfile.pesoActual} kg</div>
              <div className="text-xs text-slate-400">
                {userProfile.pesoActual > userProfile.pesoObjetivo
                  ? `${userProfile.pesoActual - userProfile.pesoObjetivo}kg por perder`
                  : `${userProfile.pesoObjetivo - userProfile.pesoActual}kg por ganar`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg p-4 space-y-2 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-400">Altura</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{userProfile.altura} cm</div>
              <div className="text-xs text-slate-400">
                IMC: {(userProfile.pesoActual / Math.pow(userProfile.altura / 100, 2)).toFixed(1)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg p-4 space-y-2 border border-purple-500/20 relative">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-400">Objetivo</span>
              </div>
              <div className="text-2xl md:text-xl font-bold text-purple-400">{userProfile.pesoObjetivo} kg</div>
              <div className="space-y-1">
                <Progress
                  value={Math.abs((userProfile.pesoActual - userProfile.pesoObjetivo) / userProfile.pesoActual) * 100}
                  className="h-2"
                />
                <div className="absolute top-16 right-2 text-xs font-semibold text-purple-400">
                  {Math.round(
                    Math.abs((userProfile.pesoActual - userProfile.pesoObjetivo) / userProfile.pesoActual) * 100,
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Calorías</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{Math.round(dailyTotals.calories)} kcal</div>
            <div className="text-xs text-slate-400">de {targetCalories} kcal</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Comidas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{completedMeals}</div>
            <div className="text-xs text-slate-400">de 4 completadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Nutricional */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribución de Macronutrientes */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-lg">Macronutrientes Hoy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <defs>
                    <linearGradient id="proteinGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="carbGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="fatGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#334155"
                    strokeWidth={2}
                  >
                    {macroData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "url(#proteinGradient)"
                            : index === 1
                              ? "url(#carbGradient)"
                              : "url(#fatGradient)"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}g`, "Consumido"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {macroData.map((macro, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{
                        backgroundColor: macro.color,
                        borderColor: macro.color,
                      }}
                    />
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
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Progreso Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgressData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6b7280" />
                      <stop offset="100%" stopColor="#4b5563" />
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
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                    formatter={(value, name, props) => [
                      `${value} kcal`,
                      name === "calorias" ? "Consumidas" : "Objetivo",
                    ]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload
                      return data ? data.fullDay : label
                    }}
                  />
                  <Bar
                    dataKey="calorias"
                    fill="url(#caloriesGradient)"
                    name="calorias"
                    radius={[4, 4, 0, 0]}
                    stroke="#10b981"
                    strokeWidth={1}
                  />
                  <Bar
                    dataKey="objetivo"
                    fill="url(#targetGradient)"
                    name="objetivo"
                    radius={[4, 4, 0, 0]}
                    stroke="#6b7280"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zócalos de Macronutrientes */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Proteínas */}
        <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <h3 className="font-semibold text-green-400">Proteínas</h3>
              </div>
              <span className="text-2xl font-bold text-green-400">{Math.round(dailyTotals.protein)}g</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Objetivo diario</span>
                <span className="text-slate-300">{macroTargets.protein}g</span>
              </div>
              <Progress value={(dailyTotals.protein / macroTargets.protein) * 100} className="h-3" />
              <div className="text-xs text-slate-400 text-center">
                {Math.round((dailyTotals.protein / macroTargets.protein) * 100)}% completado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbohidratos */}
        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <h3 className="font-semibold text-blue-400">Carbohidratos</h3>
              </div>
              <span className="text-2xl font-bold text-blue-400">{Math.round(dailyTotals.carbs)}g</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Objetivo diario</span>
                <span className="text-slate-300">{macroTargets.carbs}g</span>
              </div>
              <Progress value={(dailyTotals.carbs / macroTargets.carbs) * 100} className="h-3" />
              <div className="text-xs text-slate-400 text-center">
                {Math.round((dailyTotals.carbs / macroTargets.carbs) * 100)}% completado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grasas Saludables */}
        <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <h3 className="font-semibold text-orange-400">Grasas Saludables</h3>
              </div>
              <span className="text-2xl font-bold text-orange-400">{Math.round(dailyTotals.fat)}g</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Objetivo diario</span>
                <span className="text-slate-300">{macroTargets.fat}g</span>
              </div>
              <Progress value={(dailyTotals.fat / macroTargets.fat) * 100} className="h-3" />
              <div className="text-xs text-slate-400 text-center">
                {Math.round((dailyTotals.fat / macroTargets.fat) * 100)}% completado
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan de Comidas */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
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
            <Button
              size="sm"
              onClick={() => setShowFoodSearch(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Comida
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {meals.map((meal) => {
            const mealTotals = calculateMealTotals(meal.foods)
            return (
              <div
                key={meal.id}
                className={`rounded-lg p-4 space-y-3 transition-all duration-300 ${
                  meal.completed
                    ? "bg-gradient-to-r from-green-600/10 to-green-800/10 border border-green-500/30 shadow-lg"
                    : "bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMealCompletion(meal.id)}
                        className="hover:scale-110 transition-all duration-200 cursor-pointer"
                      >
                        {meal.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-400 drop-shadow-lg" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-400 hover:text-green-400 transition-colors" />
                        )}
                      </button>
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
                    {meal.completed && (
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
                        Completado
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-slate-700/50"
                      onClick={() => startEditMeal(meal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Calorías</span>
                    <div className="font-semibold">{Math.round(mealTotals.calories)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Proteína</span>
                    <div className="font-semibold">{Math.round(mealTotals.protein)}g</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Carbos</span>
                    <div className="font-semibold">{Math.round(mealTotals.carbs)}g</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Grasas</span>
                    <div className="font-semibold">{Math.round(mealTotals.fat)}g</div>
                  </div>
                </div>

                {meal.foods.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {meal.foods.map((food, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-slate-700/50 text-slate-300 border border-slate-600/50"
                      >
                        {food.name} ({food.quantity}g)
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
                    className="border-slate-700 bg-transparent hover:bg-slate-700/50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar alimentos
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Dialog para editar comida */}
      <Dialog open={showEditMeal} onOpenChange={setShowEditMeal}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-w-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Editar {editingMeal?.name}
            </DialogTitle>
            <DialogDescription>Modifica las cantidades o elimina alimentos de esta comida</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {editingFoods.map((food) => (
              <div key={food.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{food.name}</h4>
                  <p className="text-sm text-slate-400">
                    {food.calories} kcal • {food.protein}g prot • {food.carbs}g carbs • {food.fat}g grasas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={food.quantity}
                    onChange={(e) => updateFoodQuantity(food.id, Number(e.target.value))}
                    className="w-20 bg-slate-700/50 border-slate-600"
                    min="1"
                  />
                  <span className="text-sm text-slate-400">g</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFoodFromMeal(food.id)}
                    className="border-red-600 hover:bg-red-700/20 text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={saveMealChanges}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={() => setShowEditMeal(false)} className="border-slate-700">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para búsqueda de alimentos */}
      <Dialog open={showFoodSearch} onOpenChange={setShowFoodSearch}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-w-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Buscar Alimentos
            </DialogTitle>
            <DialogDescription>
              Busca y agrega alimentos a tu plan nutricional usando la base de datos de FatSecret
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ej: pollo, banana, avena..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchFoods(searchQuery)}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm"
              />
              <Button
                onClick={() => searchFoods(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                <p className="text-sm text-slate-400 mt-2">Buscando en la base de datos...</p>
              </div>
            )}

            {searchError && (
              <Alert className="border-red-500/20 bg-red-500/10 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{searchError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {foodResults.map((food: any) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-200 border border-slate-700/50 backdrop-blur-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{food.name}</h4>
                      {food.brand && (
                        <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-400 border-slate-600/50">
                          {food.brand}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {food.calories} kcal • {food.protein}g prot • {food.carbs}g carbs • {food.fat}g grasas
                    </p>
                    {(food.fiber > 0 || food.sugar > 0) && (
                      <p className="text-xs text-slate-500">
                        {food.fiber > 0 && `Fibra: ${food.fiber}g`}
                        {food.fiber > 0 && food.sugar > 0 && " • "}
                        {food.sugar > 0 && `Azúcar: ${food.sugar}g`}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">Por {food.per}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    onClick={() => {
                      if (selectedMeal) {
                        addFoodToMeal(selectedMeal, food)
                      }
                      setShowFoodSearch(false)
                      setSelectedMeal("")
                    }}
                  >
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
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Editar Perfil Físico
            </DialogTitle>
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
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">{/* Additional fields for editing profile can be added here */}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
