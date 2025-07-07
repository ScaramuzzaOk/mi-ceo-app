"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Plus,
  CalendarIcon,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
  Heart,
  Edit,
  Search,
  ChevronDown,
  ChevronUp,
  Wifi,
  TrendingUpIcon,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

const COLORS = [
  { color: "#3B82F6", gradient: "url(#blueGradient)" },
  { color: "#10B981", gradient: "url(#greenGradient)" },
  { color: "#F59E0B", gradient: "url(#yellowGradient)" },
  { color: "#EF4444", gradient: "url(#redGradient)" },
  { color: "#8B5CF6", gradient: "url(#purpleGradient)" },
  { color: "#06B6D4", gradient: "url(#cyanGradient)" },
  { color: "#F97316", gradient: "url(#orangeGradient)" },
  { color: "#EC4899", gradient: "url(#pinkGradient)" },
]

const categoryIcons = {
  alimentacion: ShoppingCart,
  transporte: Car,
  vivienda: Home,
  entretenimiento: Gamepad2,
  salud: Heart,
  cafe: Coffee,
  suscripciones: Wifi,
  tarjetas: CreditCard,
  otros: Wallet,
}

const FinanzasPage = () => {
  const [expenseData, setExpenseData] = useState([
    { name: "Alimentación", value: 12000, color: "#3B82F6", category: "alimentacion" },
    { name: "Transporte", value: 8000, color: "#10B981", category: "transporte" },
    { name: "Entretenimiento", value: 5000, color: "#F59E0B", category: "entretenimiento" },
    { name: "Salud", value: 3000, color: "#EF4444", category: "salud" },
    { name: "Suscripciones", value: 2500, color: "#8B5CF6", category: "suscripciones" },
    { name: "Vivienda", value: 15000, color: "#06B6D4", category: "vivienda" },
    { name: "Otros", value: 4000, color: "#F97316", category: "otros" },
  ])

  const monthlyData = [
    { month: "Ene", ingresos: 45000, gastos: 32000, balance: 13000 },
    { month: "Feb", ingresos: 47000, gastos: 35000, balance: 25000 },
    { month: "Mar", ingresos: 45000, gastos: 30000, balance: 40000 },
    { month: "Abr", ingresos: 48000, gastos: 33000, balance: 55000 },
    { month: "May", ingresos: 45000, gastos: 32000, balance: 68000 },
  ]

  const weeklyData = [
    { week: "Sem 1", ingresos: 11250, gastos: 8000, balance: 3250 },
    { week: "Sem 2", ingresos: 11250, gastos: 8500, balance: 6000 },
    { week: "Sem 3", ingresos: 11250, gastos: 7500, balance: 9750 },
    { week: "Sem 4", ingresos: 11250, gastos: 8000, balance: 13000 },
  ]

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "gasto",
      amount: 1200,
      category: "alimentacion",
      description: "Supermercado",
      date: new Date(),
      name: "Compra semanal",
    },
    {
      id: 2,
      type: "ingreso",
      amount: 45000,
      category: "salario",
      description: "Salario mensual",
      date: new Date(Date.now() - 86400000),
      name: "Sueldo",
    },
    {
      id: 3,
      type: "gasto",
      amount: 800,
      category: "salud",
      description: "Gimnasio",
      date: new Date(Date.now() - 172800000),
      name: "Membresía gym",
    },
    {
      id: 4,
      type: "inversion",
      amount: 5000,
      category: "inversiones",
      description: "ETF diversificado",
      date: new Date(Date.now() - 259200000),
      name: "Inversión ETF",
    },
    {
      id: 5,
      type: "ahorro",
      amount: 3000,
      category: "ahorros",
      description: "Fondo de emergencia",
      date: new Date(Date.now() - 345600000),
      name: "Ahorro mensual",
    },
  ])

  const [financialGoals, setFinancialGoals] = useState([
    {
      id: 1,
      name: "Fondo de Emergencia",
      description: "6 meses de gastos de emergencia",
      type: "ahorros",
      current: 15000,
      target: 25000,
      deadline: "30/12/2024",
      icon: PiggyBank,
      color: "green",
    },
    {
      id: 2,
      name: "Inversiones",
      description: "Portafolio diversificado de inversiones",
      type: "inversiones",
      current: 8500,
      target: 15000,
      deadline: "29/6/2024",
      icon: BarChart3,
      color: "blue",
    },
    {
      id: 3,
      name: "Pagar Deuda Tarjeta",
      description: "Eliminar deuda de tarjeta de crédito",
      type: "deudas",
      current: 3000,
      target: 8000,
      deadline: "30/3/2024",
      icon: CreditCard,
      color: "red",
    },
  ])

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showEditGoalForm, setShowEditGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [dateFilter, setDateFilter] = useState("mes")
  const [chartType, setChartType] = useState("bar") // bar, line, area
  const [timeFilter, setTimeFilter] = useState("mensual") // mensual, semanal

  // Filtros de transacciones
  const [transactionFilters, setTransactionFilters] = useState({
    type: "todos",
    category: "todas",
    dateRange: "todos",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Formulario de transacción
  const [transactionForm, setTransactionForm] = useState({
    type: "",
    amount: "",
    category: "",
    description: "",
    name: "",
    date: new Date(),
  })

  // Formulario de meta
  const [goalForm, setGoalForm] = useState({
    name: "",
    description: "",
    type: "",
    current: "",
    target: "",
    deadline: "",
  })

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionFilters.type !== "todos" && transaction.type !== transactionFilters.type) return false
    if (transactionFilters.category !== "todas" && transaction.category !== transactionFilters.category) return false
    if (
      transactionFilters.search &&
      !transaction.description.toLowerCase().includes(transactionFilters.search.toLowerCase()) &&
      !transaction.name.toLowerCase().includes(transactionFilters.search.toLowerCase())
    )
      return false
    return true
  })

  // Manejar nueva transacción
  const handleNewTransaction = () => {
    if (!transactionForm.type || !transactionForm.amount || !transactionForm.category) return

    const newTransaction = {
      id: Date.now(),
      type: transactionForm.type,
      amount: Number.parseFloat(transactionForm.amount),
      category: transactionForm.category,
      description: transactionForm.description || transactionForm.name,
      date: transactionForm.date,
      name: transactionForm.name || transactionForm.description,
    }

    setTransactions([newTransaction, ...transactions])
    setTransactionForm({
      type: "",
      amount: "",
      category: "",
      description: "",
      name: "",
      date: new Date(),
    })
    setShowTransactionForm(false)
  }

  // Manejar edición de meta
  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setGoalForm({
      name: goal.name,
      description: goal.description,
      type: goal.type,
      current: goal.current.toString(),
      target: goal.target.toString(),
      deadline: goal.deadline,
    })
    setShowEditGoalForm(true)
  }

  const handleUpdateGoal = () => {
    if (!editingGoal) return

    const updatedGoals = financialGoals.map((goal) =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            name: goalForm.name,
            description: goalForm.description,
            type: goalForm.type,
            current: Number.parseFloat(goalForm.current),
            target: Number.parseFloat(goalForm.target),
            deadline: goalForm.deadline,
          }
        : goal,
    )

    setFinancialGoals(updatedGoals)
    setShowEditGoalForm(false)
    setEditingGoal(null)
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "ingreso":
        return ArrowUpRight
      case "gasto":
        return ArrowDownRight
      case "inversion":
        return TrendingUpIcon
      case "ahorro":
        return PiggyBank
      default:
        return Wallet
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case "ingreso":
        return "text-green-400"
      case "gasto":
        return "text-red-400"
      case "inversion":
        return "text-purple-400"
      case "ahorro":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const currentData = timeFilter === "mensual" ? monthlyData : weeklyData

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Finanzas
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Controla tu dinero y construye riqueza</p>
        </div>
        <div className="flex items-center gap-2 text-lg md:text-xl font-semibold">
          <span className="text-green-400">$</span>
          <span>13.000 disponible</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Ingresos</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">$45.000</div>
            <div className="text-xs text-green-400">+12%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-xs text-slate-400">Gastos</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-red-400">$32.000</div>
            <div className="text-xs text-red-400">-5%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Ahorros</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">$8000</div>
            <div className="text-xs text-blue-400">+18%</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Inversiones</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">$5000</div>
            <div className="text-xs text-purple-400">+25%</div>
          </CardContent>
        </Card>
      </div>

      {/* Metas Financieras */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-400" />
              <div>
                <CardTitle className="text-lg">Metas Financieras</CardTitle>
                <CardDescription className="text-sm">Tu progreso hacia la libertad financiera</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white text-xs px-3 py-1 h-8"
              onClick={() => setShowNewGoalForm(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Nueva Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialGoals.map((goal) => {
            const IconComponent = goal.icon
            const progress = (goal.current / goal.target) * 100

            return (
              <div key={goal.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
  className="w-10 h-10 rounded-lg flex items-center justify-center"
  style={{ backgroundColor: goal.color }}
>{IconComponent ? <IconComponent className="h-5 w-5" /> : null}

                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-sm text-slate-400">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 capitalize">
                      {goal.type}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditGoal(goal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span className="font-semibold">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{Math.round(progress)}% completado</span>
                    <span>Fecha límite: {goal.deadline}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Análisis y Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gastos por Categoría */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-lg">Gastos por Categoría</CardTitle>
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Hoy</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]?.gradient || entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Gasto"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                  <span className="ml-auto font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendencia */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                <CardTitle className="text-lg">Tendencia {timeFilter === "mensual" ? "Mensual" : "Semanal"}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-24 h-8 bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-20 h-8 bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Barras</SelectItem>
                    <SelectItem value="line">Línea</SelectItem>
                    <SelectItem value="area">Área</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" && (
                  <BarChart data={currentData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={timeFilter === "mensual" ? "month" : "week"} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(value)]}
                    />
                    <Legend />
                    <Bar dataKey="ingresos" fill="url(#incomeGradient)" name="Ingresos" />
                    <Bar dataKey="gastos" fill="url(#expenseGradient)" name="Gastos" />
                  </BarChart>
                )}
                {chartType === "line" && (
                  <RechartsLineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={timeFilter === "mensual" ? "month" : "week"} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(value)]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={3} name="Balance Acumulado" />
                  </RechartsLineChart>
                )}
                {chartType === "area" && (
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={timeFilter === "mensual" ? "month" : "week"} stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(value)]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#8b5cf6"
                      fill="url(#balanceGradient)"
                      name="Balance Acumulado"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrar Nueva Transacción */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Registrar Transacción</CardTitle>
            </div>
            <Button
              size="sm"
              onClick={() => setShowTransactionForm(!showTransactionForm)}
              className="bg-green-600 hover:bg-green-700 transition-all duration-300"
            >
              {showTransactionForm ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Nueva Transacción
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showTransactionForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={transactionForm.type}
                  onValueChange={(value) => setTransactionForm({ ...transactionForm, type: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                        Ingreso
                      </div>
                    </SelectItem>
                    <SelectItem value="gasto">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                        Gasto
                      </div>
                    </SelectItem>
                    <SelectItem value="inversion">
                      <div className="flex items-center gap-2">
                        <TrendingUpIcon className="h-4 w-4 text-purple-400" />
                        Inversión
                      </div>
                    </SelectItem>
                    <SelectItem value="ahorro">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="h-4 w-4 text-blue-400" />
                        Ahorro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Compra supermercado"
                  className="bg-slate-800 border-slate-700"
                  value={transactionForm.name}
                  onChange={(e) => setTransactionForm({ ...transactionForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="0.00"
                  className="bg-slate-800 border-slate-700"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={transactionForm.category}
                  onValueChange={(value) => setTransactionForm({ ...transactionForm, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alimentacion">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Alimentación
                      </div>
                    </SelectItem>
                    <SelectItem value="transporte">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Transporte
                      </div>
                    </SelectItem>
                    <SelectItem value="vivienda">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Vivienda
                      </div>
                    </SelectItem>
                    <SelectItem value="entretenimiento">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        Entretenimiento
                      </div>
                    </SelectItem>
                    <SelectItem value="salud">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Salud
                      </div>
                    </SelectItem>
                    <SelectItem value="suscripciones">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Suscripciones
                      </div>
                    </SelectItem>
                    <SelectItem value="tarjetas">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Tarjetas de Crédito
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transactionForm.date ? format(transactionForm.date, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={transactionForm.date}
                      onSelect={(date) => setTransactionForm({ ...transactionForm, date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Detalles adicionales"
                  className="bg-slate-800 border-slate-700"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex gap-2 pt-4">
                <Button className="bg-green-600 hover:bg-green-700 flex-1" onClick={handleNewTransaction}>
                  Guardar Transacción
                </Button>
                <Button variant="outline" onClick={() => setShowTransactionForm(false)} className="border-slate-700">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Transacciones Recientes */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              <div>
                <CardTitle className="text-lg">Transacciones Recientes</CardTitle>
                <CardDescription className="text-sm">Tus movimientos financieros más recientes</CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardHeader>

        {/* Filtros */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilters ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-800/30 rounded-lg">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar transacciones..."
                    className="pl-10 bg-slate-800 border-slate-700"
                    value={transactionFilters.search}
                    onChange={(e) => setTransactionFilters({ ...transactionFilters, search: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={transactionFilters.type}
                  onValueChange={(value) => setTransactionFilters({ ...transactionFilters, type: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="gasto">Gastos</SelectItem>
                    <SelectItem value="inversion">Inversiones</SelectItem>
                    <SelectItem value="ahorro">Ahorros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={transactionFilters.category}
                  onValueChange={(value) => setTransactionFilters({ ...transactionFilters, category: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="alimentacion">Alimentación</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="vivienda">Vivienda</SelectItem>
                    <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
                    <SelectItem value="salud">Salud</SelectItem>
                    <SelectItem value="suscripciones">Suscripciones</SelectItem>
                    <SelectItem value="tarjetas">Tarjetas de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Período</Label>
                <Select
                  value={transactionFilters.dateRange}
                  onValueChange={(value) => setTransactionFilters({ ...transactionFilters, dateRange: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="hoy">Hoy</SelectItem>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mes</SelectItem>
                    <SelectItem value="año">Este año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const IconComponent = getTransactionIcon(transaction.type)
            const colorClass = getTransactionColor(transaction.type)
            const CategoryIcon = categoryIcons[transaction.category] || Wallet;

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
              >
                <div
                  className={`w-10 h-10 ${transaction.type === "ingreso" ? "bg-green-600/20" : transaction.type === "gasto" ? "bg-red-600/20" : transaction.type === "inversion" ? "bg-purple-600/20" : "bg-blue-600/20"} rounded-lg flex items-center justify-center`}
                >
                  <{CategoryIcon ? <CategoryIcon className={`h-5 w-5 ${colorClass}`} /> : null}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{transaction.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{transaction.category.replace("_", " ")}</p>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${colorClass}`}>
                    {transaction.type === "ingreso" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-slate-400">{format(transaction.date, "dd/MM/yyyy")}</div>
                </div>
              </div>
            )
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron transacciones con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar meta */}
      <Dialog open={showEditGoalForm} onOpenChange={setShowEditGoalForm}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-400" />
              Editar Meta Financiera
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de la meta</Label>
              <Input
                placeholder="Ej: Fondo de emergencia"
                className="bg-slate-800 border-slate-700"
                value={goalForm.name}
                onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                placeholder="Describe tu meta financiera..."
                className="bg-slate-800 border-slate-700"
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de meta</Label>
              <Select value={goalForm.type} onValueChange={(value) => setGoalForm({ ...goalForm, type: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ahorros">Ahorros</SelectItem>
                  <SelectItem value="inversiones">Inversiones</SelectItem>
                  <SelectItem value="deudas">Pagar Deudas</SelectItem>
                  <SelectItem value="gastos">Control de Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto actual</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-slate-800 border-slate-700"
                  value={goalForm.current}
                  onChange={(e) => setGoalForm({ ...goalForm, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Monto objetivo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="bg-slate-800 border-slate-700"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fecha límite</Label>
              <Input
                type="date"
                className="bg-slate-800 border-slate-700"
                value={goalForm.deadline}
                onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditGoalForm(false)} className="flex-1 border-slate-700">
                Cancelar
              </Button>
              <Button onClick={handleUpdateGoal} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FinanzasPage
