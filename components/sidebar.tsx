"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "./theme-provider"
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Brain,
  Dumbbell,
  Apple,
  DollarSign,
  BookOpen,
  FileText,
  Download,
  Moon,
  Sun,
  Zap,
  Award,
  X,
  Heart,
} from "lucide-react"

const navigationItems = [
  {
    section: "Esenciales",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Coach IA", href: "/coach-ia", icon: Brain, badge: "NUEVO", badgeColor: "bg-purple-600" },
      { name: "Tareas", href: "/tareas", icon: CheckSquare, count: 3 },
      { name: "Hábitos", href: "/habitos", icon: Activity },
    ],
  },
  {
    section: "Desarrollo",
    items: [
      { name: "Mentalidad", href: "/mentalidad", icon: Heart },
      { name: "Entrenamiento", href: "/entrenamiento", icon: Dumbbell },
      { name: "Nutrición", href: "/nutricion", icon: Apple },
      { name: "Finanzas", href: "/finanzas", icon: DollarSign },
    ],
  },
  {
    section: "Extras",
    items: [
      { name: "Aprendizaje", href: "/aprendizaje", icon: BookOpen },
      { name: "Diario", href: "/diario", icon: FileText },
    ],
  },
]

const exportSections = [
  { id: "perfil", label: "Perfil", icon: "👤", checked: true },
  { id: "dashboard", label: "Dashboard", icon: "📊", checked: true },
  { id: "tareas", label: "Tareas", icon: "✅", checked: true },
  { id: "habitos", label: "Hábitos", icon: "🎯", checked: true },
  { id: "finanzas", label: "Finanzas", icon: "💰", checked: true },
  { id: "entrenamiento", label: "Entrenamiento", icon: "🏋️", checked: true },
  { id: "nutricion", label: "Nutrición", icon: "🍎", checked: true },
  { id: "aprendizaje", label: "Aprendizaje", icon: "📚", checked: true },
  { id: "diario", label: "Diario", icon: "📝", checked: true },
  { id: "logros", label: "Logros", icon: "🏆", checked: true },
]

interface SidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile = false, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [selectedSections, setSelectedSections] = useState(exportSections)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const userLevel = 1
  const userXP = 0
  const maxXP = 100
  const achievements = 0

  // Handle section selection for PDF export
  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, checked: !section.checked } : section)),
    )
  }

  // Generate PDF report
  const generatePDFReport = async () => {
    setIsGeneratingPDF(true)

    try {
      const selectedIds = selectedSections.filter((s) => s.checked).map((s) => s.id)

      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections: selectedIds,
          userData: {
            level: userLevel,
            xp: userXP,
            achievements: achievements,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error generating PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `CEO-de-Mi-Vida-Reporte-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setIsExportOpen(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el reporte PDF. Intenta de nuevo.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Handle mobile navigation
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  if (isMobile && !isOpen) {
    return null
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div
        className={`
        ${isMobile ? "fixed" : "sticky"} top-0 left-0 z-50
        w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 
        border-r border-slate-800 flex flex-col
        ${isMobile ? "transform transition-transform duration-300" : ""}
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        dark:from-slate-900 dark:to-slate-950 dark:border-slate-800
        light:from-gray-50 light:to-gray-100 light:border-gray-200
      `}
      >
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 z-10"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="p-4 border-b border-slate-800 dark:border-slate-800 light:border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CEO</span>
            </div>
            <div>
              <h2 className="font-semibold text-white dark:text-white light:text-gray-900">CEO de Mi Vida</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-600">Tu Coach Personal IA</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-gray-200/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white dark:text-white light:text-gray-900">
                Nivel {userLevel}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-semibold">{userXP}</span>
              </div>
            </div>
            <Progress value={(userXP / maxXP) * 100} className="h-1.5" />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-400 light:text-gray-600">
              <span>
                {userXP} / {maxXP} XP
              </span>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>{achievements} logros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((section) => (
            <div key={section.section} className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {section.section}
              </h3>
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link key={item.name} href={item.href} onClick={handleNavClick}>
                      <div
                        className={`
                          group flex items-center gap-3 px-3 py-2 rounded-lg text-sm 
                          transition-all duration-300 relative overflow-hidden
                          ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
                              : "text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900"
                          }
                        `}
                      >
                        {/* Hover gradient effect */}
                        <div
                          className={`
                          absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          ${isActive ? "opacity-100" : ""}
                        `}
                        />

                        <Icon className="h-4 w-4 flex-shrink-0 relative z-10" />
                        <span className="flex-1 relative z-10">{item.name}</span>

                        {item.badge && (
                          <Badge className={`${item.badgeColor} text-white text-xs px-1.5 py-0.5 h-5 relative z-10`}>
                            {item.badge}
                          </Badge>
                        )}

                        {item.count && (
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-300 dark:bg-slate-700 dark:text-slate-300 light:bg-gray-300 light:text-gray-700 text-xs px-1.5 py-0.5 h-5 relative z-10"
                          >
                            {item.count}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 dark:border-slate-800 light:border-gray-200 space-y-3 flex-shrink-0">
          {/* Export Dialog */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 dark:bg-slate-900 light:bg-white border-slate-800 dark:border-slate-800 light:border-gray-200 text-white dark:text-white light:text-gray-900">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5 text-red-400" />
                  Exportar Reporte PDF
                </DialogTitle>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">
                  Genera un reporte completo con el estilo de la app en formato PDF profesional.
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Secciones a incluir:</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedSections.map((section) => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={section.checked}
                          onCheckedChange={() => toggleSection(section.id)}
                          className="border-slate-600 dark:border-slate-600 light:border-gray-400"
                        />
                        <label
                          htmlFor={section.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                        >
                          <span>{section.icon}</span>
                          {section.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 dark:from-blue-900/30 dark:to-purple-900/30 light:from-blue-100/50 light:to-purple-100/50 rounded-lg p-3 border border-blue-800/30 dark:border-blue-800/30 light:border-blue-200/50">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    Reporte PDF Profesional
                  </h4>
                  <ul className="text-xs text-slate-300 dark:text-slate-300 light:text-gray-600 space-y-1">
                    <li>• Diseño idéntico al estilo de la app</li>
                    <li>• Gráficos y estadísticas completas</li>
                    <li>• Análisis detallado de progreso</li>
                    <li>• Recomendaciones personalizadas</li>
                    <li>• Optimizado para impresión</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportOpen(false)}
                    className="flex-1 border-slate-700 dark:border-slate-700 light:border-gray-300 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={generatePDFReport}
                    disabled={isGeneratingPDF || selectedSections.filter((s) => s.checked).length === 0}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generar Reporte PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-200/50"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Modo Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Modo Oscuro
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
