"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Plus,
  Save,
  Calendar,
  Search,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  FileText,
  Clock,
  Star,
  Heart,
  Smile,
  Frown,
  Meh,
} from "lucide-react"

interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  mood: "happy" | "neutral" | "sad" | "excited" | "anxious" | "grateful"
  tags: string[]
  favorite: boolean
  wordCount: number
}

const MOODS = {
  happy: { icon: Smile, color: "#10b981", label: "Feliz" },
  excited: { icon: Star, color: "#f59e0b", label: "Emocionado" },
  grateful: { icon: Heart, color: "#ec4899", label: "Agradecido" },
  neutral: { icon: Meh, color: "#6b7280", label: "Neutral" },
  anxious: { icon: Clock, color: "#f97316", label: "Ansioso" },
  sad: { icon: Frown, color: "#ef4444", label: "Triste" },
}

const FONT_SIZES = [
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "24", label: "24px" },
  { value: "32", label: "32px" },
]

export default function DiarioPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: "1",
      title: "Mi primer día en el nuevo trabajo",
      content: `<h1>Un nuevo comienzo</h1>
      <p>Hoy fue mi primer día en la nueva empresa y debo decir que me siento muy <strong>emocionado</strong> por esta nueva etapa. El equipo me recibió muy bien y ya tengo ganas de empezar a contribuir.</p>
      
      <h2>Reflexiones del día</h2>
      <ul>
        <li>El ambiente de trabajo es muy colaborativo</li>
        <li>Mis compañeros son muy amigables</li>
        <li>Los proyectos se ven muy interesantes</li>
      </ul>
      
      <p><em>Estoy seguro de que esta será una experiencia increíble.</em></p>`,
      date: "2024-01-15",
      mood: "excited",
      tags: ["trabajo", "nuevo comienzo", "reflexiones"],
      favorite: true,
      wordCount: 87,
    },
    {
      id: "2",
      title: "Reflexiones sobre el crecimiento personal",
      content: `<h1>Crecimiento Personal</h1>
      <p>Últimamente he estado reflexionando mucho sobre mi crecimiento personal. Creo que es importante tomarse el tiempo para <strong>autoevaluarse</strong> y pensar en qué áreas podemos mejorar.</p>
      
      <blockquote>
        "El crecimiento personal no es un destino, es un viaje continuo de autodescubrimiento."
      </blockquote>
      
      <p>Algunas áreas en las que quiero enfocarme:</p>
      <ol>
        <li>Mejorar mi comunicación</li>
        <li>Desarrollar más paciencia</li>
        <li>Ser más organizado</li>
      </ol>`,
      date: "2024-01-10",
      mood: "grateful",
      tags: ["crecimiento", "reflexiones", "metas"],
      favorite: false,
      wordCount: 95,
    },
  ])

  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMood, setFilterMood] = useState<string>("neutral")
  const [filterTag, setFilterTag] = useState<string>("")

  // Editor state
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentContent, setCurrentContent] = useState("")
  const [currentMood, setCurrentMood] = useState<keyof typeof MOODS>("neutral")
  const [currentTags, setCurrentTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [fontSize, setFontSize] = useState("16")

  // Cargar entradas almacenadas
  useEffect(() => {
    const stored = localStorage.getItem("diario-data")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.entries) setEntries(parsed.entries)
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  // Guardar entradas
  useEffect(() => {
    localStorage.setItem("diario-data", JSON.stringify({ entries }))
  }, [entries])

  const editorRef = useRef<HTMLDivElement>(null)

  // Obtener todas las etiquetas únicas
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)))

  // Filtrar entradas
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = !filterMood || entry.mood === filterMood
    const matchesTag = !filterTag || entry.tags.includes(filterTag)

    return matchesSearch && matchesMood && matchesTag
  })

  // Funciones del editor
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      setCurrentContent(editorRef.current.innerHTML)
    }
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}px`
    }
  }

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setCurrentTags([...currentTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove))
  }

  const saveEntry = () => {
    if (!currentTitle.trim() || !currentContent.trim()) return

    const wordCount = currentContent
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 0).length

    const newEntry: DiaryEntry = {
      id: selectedEntry?.id || Date.now().toString(),
      title: currentTitle,
      content: currentContent,
      date: new Date().toISOString().split("T")[0],
      mood: currentMood,
      tags: currentTags,
      favorite: selectedEntry?.favorite || false,
      wordCount,
    }

    if (selectedEntry) {
      setEntries(entries.map((entry) => (entry.id === selectedEntry.id ? newEntry : entry)))
    } else {
      setEntries([newEntry, ...entries])
    }

    resetEditor()
    setShowNewEntry(false)
    setSelectedEntry(null)
  }

  const resetEditor = () => {
    setCurrentTitle("")
    setCurrentContent("")
    setCurrentMood("neutral")
    setCurrentTags([])
    setFontSize("16")
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
      editorRef.current.style.fontSize = "16px"
    }
  }

  const editEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setCurrentTitle(entry.title)
    setCurrentContent(entry.content)
    setCurrentMood(entry.mood)
    setCurrentTags(entry.tags)
    setShowNewEntry(true)

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = entry.content
      }
    }, 100)
  }

  const toggleFavorite = (entryId: string) => {
    setEntries(entries.map((entry) => (entry.id === entryId ? { ...entry, favorite: !entry.favorite } : entry)))
  }

  const deleteEntry = (entryId: string) => {
    setEntries(entries.filter((entry) => entry.id !== entryId))
  }

  // Calcular estadísticas
  const totalEntries = entries.length
  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0)
  const favoriteEntries = entries.filter((entry) => entry.favorite).length
  const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mi Diario Personal
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Captura tus pensamientos, reflexiones y momentos especiales
          </p>
        </div>
        <Button
          onClick={() => {
            resetEditor()
            setShowNewEntry(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Entradas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{totalEntries}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Palabras</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{totalWords.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Favoritas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">{favoriteEntries}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-400">Promedio</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-orange-400">{averageWordsPerEntry}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar en tus entradas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
            <Select value={filterMood} onValueChange={setFilterMood}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(MOODS).map(([key, mood]) => {
                  const Icon = mood.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: mood.color }} />
                        {mood.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Filtrar por etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las etiquetas</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Entradas */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const MoodIcon = MOODS[entry.mood].icon
          return (
            <Card
              key={entry.id}
              className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{entry.title}</h3>
                      {entry.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      <div className="flex items-center gap-1">
                        <MoodIcon className="h-4 w-4" style={{ color: MOODS[entry.mood].color }} />
                        <span className="text-sm text-slate-400">{MOODS[entry.mood].label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Type className="h-3 w-3" />
                        <span>{entry.wordCount} palabras</span>
                      </div>
                    </div>
                    <div
                      className="prose prose-invert prose-sm max-w-none mb-3"
                      dangerouslySetInnerHTML={{ __html: entry.content.substring(0, 200) + "..." }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFavorite(entry.id)}
                      className="border-slate-600 hover:bg-slate-700/50"
                    >
                      <Star className={`h-4 w-4 ${entry.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editEntry(entry)}
                      className="border-slate-600 hover:bg-slate-700/50"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialog para nueva entrada/editar */}
      <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {selectedEntry ? "Editar Entrada" : "Nueva Entrada del Diario"}
            </DialogTitle>
            <DialogDescription>Escribe tus pensamientos, reflexiones y experiencias del día</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Dale un título a tu entrada..."
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            {/* Barra de herramientas del editor */}
            <div className="border border-slate-700 rounded-lg p-3 bg-slate-800/30">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Formato de texto */}
                <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("bold")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("italic")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("underline")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                {/* Encabezados */}
                <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("formatBlock", "h1")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("formatBlock", "h2")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("formatBlock", "h3")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Alineación */}
                <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("justifyLeft")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("justifyCenter")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("justifyRight")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Listas */}
                <div className="flex items-center gap-1 border-r border-slate-600 pr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("insertUnorderedList")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("insertOrderedList")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("formatBlock", "blockquote")}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700/50"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tamaño de fuente */}
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger className="w-20 h-8 bg-slate-800/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Editor de contenido */}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[300px] p-4 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-invert max-w-none"
                style={{ fontSize: `${fontSize}px` }}
                onInput={(e) => setCurrentContent(e.currentTarget.innerHTML)}
                placeholder="Escribe tu entrada aquí..."
              />
            </div>

            {/* Estado de ánimo y etiquetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado de ánimo</label>
                <Select value={currentMood} onValueChange={(value: keyof typeof MOODS) => setCurrentMood(value)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MOODS).map(([key, mood]) => {
                      const Icon = mood.icon
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: mood.color }} />
                            {mood.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Etiquetas</label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Agregar etiqueta..."
                    className="bg-slate-800/50 border-slate-700"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button size="sm" onClick={addTag} className="bg-slate-700 hover:bg-slate-600">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-slate-700/50 text-slate-300 cursor-pointer hover:bg-red-600/20"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={saveEntry}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedEntry ? "Actualizar Entrada" : "Guardar Entrada"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewEntry(false)
                setSelectedEntry(null)
                resetEditor()
              }}
              className="border-slate-700"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
