"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Target, Activity, Brain, Apple, PiggyBank, FileText, Download, BarChart3, Clock, Star } from "lucide-react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// Datos de ejemplo para los gráficos
const weeklyProgressData = [
  { day: "Lun", finanzas: 85, entrenamiento: 90, nutricion: 75, habitos: 80, mentalidad: 70 },
  { day: "Mar", finanzas: 88, entrenamiento: 85, nutricion: 80, habitos: 85, mentalidad: 75 },
  { day: "Mié", finanzas: 82, entrenamiento: 95, nutricion: 85, habitos: 75, mentalidad: 80 },
  { day: "Jue", finanzas: 90, entrenamiento: 80, nutricion: 90, habitos: 90, mentalidad: 85 },
  { day: "Vie", finanzas: 87, entrenamiento: 88, nutricion: 85, habitos: 85, mentalidad: 82 },
  { day: "Sáb", finanzas: 85, entrenamiento: 92, nutricion: 80, habitos: 80, mentalidad: 78 },
  { day: "Dom", finanzas: 89, entrenamiento: 85, nutricion: 88, habitos: 88, mentalidad: 85 },
]

const overallProgressData = [
  { name: "Finanzas", value: 87, color: "#10b981" },
  { name: "Entrenamiento", value: 88, color: "#f59e0b" },
  { name: "Nutrición", value: 83, color: "#3b82f6" },
  { name: "Hábitos", value: 83, color: "#8b5cf6" },
  { name: "Mentalidad", value: 79, color: "#ef4444" },
]

export default function DashboardPage() {
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportType, setReportType] = useState("semanal")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportAnalysis, setReportAnalysis] = useState("")

  // Estadísticas generales
  const stats = {
    finanzas: { actual: 13000, objetivo: 15000, porcentaje: 87 },
    entrenamiento: { completados: 4, objetivo: 6, porcentaje: 67 },
    nutricion: { calorias: 1850, objetivo: 2000, porcentaje: 93 },
    habitos: { completados: 3, total: 4, porcentaje: 75 },
    mentalidad: { progreso: 79, objetivo: 90, porcentaje: 88 },
  }

  // Actividades recientes
  const recentActivities = [
    {
      id: 1,
      type: "entrenamiento",
      title: "Completaste Pecho y Tríceps",
      time: "Hace 2 horas",
      icon: Activity,
      color: "text-orange-400",
    },
    {
      id: 2,
      type: "finanzas",
      title: "Nueva transacción registrada",
      time: "Hace 4 horas",
      icon: PiggyBank,
      color: "text-green-400",
    },
    {
      id: 3,
      type: "habitos",
      title: "Racha de 12 días en ejercicio",
      time: "Hace 6 horas",
      icon: Target,
      color: "text-purple-400",
    },
    {
      id: 4,
      type: "nutricion",
      title: "Objetivo calórico alcanzado",
      time: "Ayer",
      icon: Apple,
      color: "text-blue-400",
    },
  ]

  // Generar reporte con análisis IA
  const generateReport = async () => {
    setIsGeneratingReport(true)

    try {
      const response = await fetch("/api/ai/weekly-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          data: {
            finanzas: stats.finanzas,
            entrenamiento: stats.entrenamiento,
            nutricion: stats.nutricion,
            habitos: stats.habitos,
            mentalidad: stats.mentalidad,
            weeklyProgress: weeklyProgressData,
          },
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setReportAnalysis(result.analysis)

        // Generar y descargar el reporte
        if (reportFormat === "pdf") {
          const pdfResponse = await fetch("/api/export/pdf", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "weekly-report",
              data: {
                analysis: result.analysis,
                stats,
                weeklyProgress: weeklyProgressData,
              },
            }),
          })

          if (pdfResponse.ok) {
            const blob = await pdfResponse.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `reporte-${reportType}-${new Date().toISOString().split("T")[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
          }
        }
      } else {
        setReportAnalysis("Error al generar el análisis. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setReportAnalysis("Error al generar el reporte. Por favor, intenta de nuevo.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Tu progreso integral hacia una vida mejor</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowReportDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">84%</div>
            <div className="text-xs text-slate-400">Progreso</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">Finanzas</div>
                <div className="text-lg font-bold text-green-400">${stats.finanzas.actual.toLocaleString()}</div>
                <div className="text-xs text-green-400">{stats.finanzas.porcentaje}% del objetivo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">Entrenamiento</div>
                <div className="text-lg font-bold text-orange-400">
                  {stats.entrenamiento.completados}/{stats.entrenamiento.objetivo}
                </div>
                <div className="text-xs text-orange-400">{stats.entrenamiento.porcentaje}% esta semana</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Apple className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">Nutrición</div>
                <div className="text-lg font-bold text-blue-400">{stats.nutricion.calorias} kcal</div>
                <div className="text-xs text-blue-400">{stats.nutricion.porcentaje}% del objetivo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">Hábitos</div>
                <div className="text-lg font-bold text-purple-400">
                  {stats.habitos.completados}/{stats.habitos.total}
                </div>
                <div className="text-xs text-purple-400">{stats.habitos.porcentaje}% completado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/30 transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">Mentalidad</div>
                <div className="text-lg font-bold text-pink-400">{stats.mentalidad.progreso}%</div>
                <div className="text-xs text-pink-400">{stats.mentalidad.porcentaje}% del objetivo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progreso Semanal */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Progreso Semanal por Área</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgressData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="finanzasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="entrenamientoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="nutricionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                  />
                  <Area
                    type="monotone"
                    dataKey="finanzas"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#finanzasGradient)"
                    name="Finanzas"
                  />
                  <Area
                    type="monotone"
                    dataKey="entrenamiento"
                    stackId="2"
                    stroke="#f59e0b"
                    fill="url(#entrenamientoGradient)"
                    name="Entrenamiento"
                  />
                  <Area
                    type="monotone"
                    dataKey="nutricion"
                    stackId="3"
                    stroke="#3b82f6"
                    fill="url(#nutricionGradient)"
                    name="Nutrición"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progreso General */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Progreso General</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {overallProgressData.map((entry, index) => (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={overallProgressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {overallProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Progreso"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {overallProgressData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                  <span className="ml-auto font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividades Recientes y Objetivos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Actividades Recientes */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Actividades Recientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{activity.title}</h3>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600 capitalize">
                    {activity.type}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Objetivos del Mes */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-lg">Objetivos del Mes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Ahorrar $15,000</span>
                <Badge className="bg-green-600 text-white">87%</Badge>
              </div>
              <Progress value={87} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">24 entrenamientos</span>
                <Badge className="bg-orange-600 text-white">67%</Badge>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Mantener dieta balanceada</span>
                <Badge className="bg-blue-600 text-white">93%</Badge>
              </div>
              <Progress value={93} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Completar hábitos diarios</span>
                <Badge className="bg-purple-600 text-white">75%</Badge>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Desarrollar confianza</span>
                <Badge className="bg-pink-600 text-white">79%</Badge>
              </div>
              <Progress value={79} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Generar Reporte */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Generar Reporte de Progreso
            </DialogTitle>
            <DialogDescription>Crea un reporte detallado con análisis IA de tu progreso</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Reporte</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Reporte Semanal</SelectItem>
                    <SelectItem value="mensual">Reporte Mensual</SelectItem>
                    <SelectItem value="trimestral">Reporte Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Formato</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {reportAnalysis && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Análisis IA Generado</label>
                <Textarea
                  value={reportAnalysis}
                  readOnly
                  className="bg-slate-800 border-slate-700 min-h-[200px]"
                  placeholder="El análisis aparecerá aquí después de generar el reporte..."
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
                className="flex-1 border-slate-700"
                disabled={isGeneratingReport}
              >
                Cancelar
              </Button>
              <Button
                onClick={generateReport}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
