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
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Plus,
  CalendarIcon,
  Filter,
  BarChart3,
  PieChartIcon as RechartsPieChart,
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
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ResponsiveContainer, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const categoryIcons = {
  alimentacion: ShoppingCart,
  transporte: Car,
  vivienda: Home,
  entretenimiento: Gamepad2,
  salud: Heart,
  cafe: Coffee,
  otros: Wallet,
}

const expenseData = [
  { name: "Alimentación", value: 12000, color: "#0088FE" },
  { name: "Transporte", value: 8000, color: "#00C49F" },
  { name: "Entretenimiento", value: 5000, color: "#FFBB28" },
  { name: "Salud", value: 3000, color: "#FF8042" },
  { name: "Otros", value: 4000, color: "#8884D8" },
]

const monthlyData = [
  { month: "Ene", ingresos: 45000, gastos: 32000 },
  { month: "Feb", ingresos: 47000, gastos: 35000 },
  { month: "Mar", ingresos: 45000, gastos: 30000 },
  { month: "Abr", ingresos: 48000, gastos: 33000 },
  { month: "May", ingresos: 45000, gastos: 32000 },
]

export default function FinanzasPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [dateFilter, setDateFilter] = useState("mes")

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Finanzas</h1>
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
            <div className="flex items-center gap-2">
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
          {/* Fondo de Emergencia */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Fondo de Emergencia</h3>
                  <p className="text-sm text-slate-400">6 meses de gastos de emergencia</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  Ahorros
                </Badge>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span className="font-semibold">$15.000 / $25.000</span>
              </div>
              <Progress value={60} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>60% completado</span>
                <span>Fecha límite: 30/12/2024</span>
              </div>
            </div>
          </div>

          {/* Inversiones */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Inversiones</h3>
                  <p className="text-sm text-slate-400">Portafolio diversificado de inversiones</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  Inversiones
                </Badge>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span className="font-semibold">$8500 / $15.000</span>
              </div>
              <Progress value={57} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>57% completado</span>
                <span>Fecha límite: 29/6/2024</span>
              </div>
            </div>
          </div>

          {/* Pagar Deuda */}
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Pagar Deuda Tarjeta</h3>
                  <p className="text-sm text-slate-400">Eliminar deuda de tarjeta de crédito</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  Deudas
                </Badge>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span className="font-semibold">$3000 / $8000</span>
              </div>
              <Progress value={38} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>38% completado</span>
                <span>Fecha límite: 30/3/2024</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis y Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gastos por Categoría */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RechartsPieChart className="h-5 w-5 text-orange-400" />
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Gasto"]}
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
                  <span className="ml-auto font-semibold">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendencia Mensual */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Tendencia Mensual</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                </BarChart>
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
              className="bg-green-600 hover:bg-green-700"
            >
              {showTransactionForm ? "Cancelar" : "Nueva Transacción"}
            </Button>
          </div>
        </CardHeader>
        {showTransactionForm && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input id="monto" type="number" placeholder="0.00" className="bg-slate-800 border-slate-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
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
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2 lg:col-span-4 space-y-2">
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Compra en supermercado"
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 flex-1">Guardar Transacción</Button>
                <Button variant="outline" onClick={() => setShowTransactionForm(false)} className="border-slate-700">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        )}
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
            <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Transacción 1 */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Supermercado</h3>
              <p className="text-sm text-slate-400">Alimentación</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-400">-$1200</div>
              <div className="text-xs text-slate-400">Hoy</div>
            </div>
          </div>

          {/* Transacción 2 */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Salario</h3>
              <p className="text-sm text-slate-400">Ingresos</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-400">+$45.000</div>
              <div className="text-xs text-slate-400">Ayer</div>
            </div>
          </div>

          {/* Transacción 3 */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Gym</h3>
              <p className="text-sm text-slate-400">Salud</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-400">-$800</div>
              <div className="text-xs text-slate-400">2 días</div>
            </div>
          </div>

          {/* Transacción 4 */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Inversión ETF</h3>
              <p className="text-sm text-slate-400">Inversiones</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-purple-400">-$5000</div>
              <div className="text-xs text-slate-400">3 días</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
