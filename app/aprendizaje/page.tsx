"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Plus, Target, TrendingUp, Edit, Trash2, Clock, BarChart3, Star } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  currentPage: number
  category: string
  startDate: string
  targetDate: string
  status: "reading" | "completed" | "paused"
  notes: string
  rating?: number
}

interface ReadingGoal {
  id: string
  type: "daily" | "weekly" | "monthly"
  target: number
  current: number
  period: string
}

const BOOK_CATEGORIES = [
  "Desarrollo Personal",
  "Negocios",
  "Finanzas",
  "Tecnología",
  "Historia",
  "Ciencia",
  "Ficción",
  "Biografía",
  "Salud",
  "Filosofía",
]

const CATEGORY_COLORS = {
  "Desarrollo Personal": "#10b981",
  Negocios: "#3b82f6",
  Finanzas: "#f59e0b",
  Tecnología: "#8b5cf6",
  Historia: "#ef4444",
  Ciencia: "#06b6d4",
  Ficción: "#ec4899",
  Biografía: "#84cc16",
  Salud: "#f97316",
  Filosofía: "#6366f1",
}

export default function AprendizajePage() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Padre Rico Padre Pobre",
      author: "Robert Kiyosaki",
      totalPages: 450,
      currentPage: 120,
      category: "Finanzas",
      startDate: "2024-01-15",
      targetDate: "2024-02-15",
      status: "reading",
      notes: "Excelente libro sobre educación financiera. Los conceptos de activos vs pasivos son fundamentales.",
      rating: 5,
    },
    {
      id: "2",
      title: "Hábitos Atómicos",
      author: "James Clear",
      totalPages: 320,
      currentPage: 320,
      category: "Desarrollo Personal",
      startDate: "2023-12-01",
      targetDate: "2023-12-31",
      status: "completed",
      notes: "Increíble metodología para formar hábitos. El sistema de 1% mejor cada día es poderoso.",
      rating: 5,
    },
    {
      id: "3",
      title: "El Arte de la Guerra",
      author: "Sun Tzu",
      totalPages: 180,
      currentPage: 45,
      category: "Filosofía",
      startDate: "2024-01-20",
      targetDate: "2024-02-10",
      status: "reading",
      notes: "Estrategias aplicables tanto en negocios como en la vida personal.",
    },
  ])

  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([
    {
      id: "1",
      type: "daily",
      target: 30,
      current: 25,
      period: "Hoy",
    },
    {
      id: "2",
      type: "weekly",
      target: 200,
      current: 150,
      period: "Esta semana",
    },
    {
      id: "3",
      type: "monthly",
      target: 800,
      current: 650,
      period: "Este mes",
    },
  ])

  const [showAddBook, setShowAddBook] = useState(false)
  const [showEditBook, setShowEditBook] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showUpdateProgress, setShowUpdateProgress] = useState(false)
  const [newPages, setNewPages] = useState("")

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    totalPages: "",
    category: "",
    targetDate: "",
    notes: "",
  })

  // Cargar datos almacenados
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("aprendizaje-data")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.books) setBooks(parsed.books)
        if (parsed.readingGoals) setReadingGoals(parsed.readingGoals)
      }
    } catch (err) {
      console.error("Error loading aprendizaje-data", err)
    }
  }, [])

  // Guardar datos
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(
        "aprendizaje-data",
        JSON.stringify({ books, readingGoals })
      )
    } catch (err) {
      console.error("Error saving aprendizaje-data", err)
    }
  }, [books, readingGoals])

  // Calcular estadísticas
  const totalBooksRead = books.filter((book) => book.status === "completed").length
  const currentlyReading = books.filter((book) => book.status === "reading").length
  const totalPagesRead = books.reduce((total, book) => total + book.currentPage, 0)
  const averageRating =
    books.filter((book) => book.rating).reduce((sum, book) => sum + (book.rating || 0), 0) /
    books.filter((book) => book.rating).length

  // Datos para gráficos
  const categoryData = BOOK_CATEGORIES.map((category) => ({
    name: category,
    value: books.filter((book) => book.category === category).length,
    color: CATEGORY_COLORS[category],
  })).filter((item) => item.value > 0)

  const weeklyProgressData = [
    { day: "Lun", pages: 45 },
    { day: "Mar", pages: 32 },
    { day: "Mié", pages: 28 },
    { day: "Jue", pages: 55 },
    { day: "Vie", pages: 40 },
    { day: "Sáb", pages: 60 },
    { day: "Dom", pages: 35 },
  ]

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.totalPages) return

    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      totalPages: Number.parseInt(newBook.totalPages),
      currentPage: 0,
      category: newBook.category || "Desarrollo Personal",
      startDate: new Date().toISOString().split("T")[0],
      targetDate: newBook.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "reading",
      notes: newBook.notes,
    }

    setBooks([...books, book])
    setNewBook({ title: "", author: "", totalPages: "", category: "", targetDate: "", notes: "" })
    setShowAddBook(false)
  }

  const updateProgress = () => {
    if (!selectedBook || !newPages) return

    const updatedPages = Math.min(Number.parseInt(newPages), selectedBook.totalPages)
    const updatedBooks = books.map((book) =>
      book.id === selectedBook.id
        ? {
            ...book,
            currentPage: updatedPages,
            status: updatedPages >= book.totalPages ? ("completed" as const) : book.status,
          }
        : book,
    )

    setBooks(updatedBooks)
    setNewPages("")
    setShowUpdateProgress(false)
    setSelectedBook(null)

    // Actualizar objetivos de lectura
    const pagesRead = updatedPages - selectedBook.currentPage
    if (pagesRead > 0) {
      setReadingGoals((goals) =>
        goals.map((goal) => ({
          ...goal,
          current: Math.min(goal.current + pagesRead, goal.target),
        })),
      )
    }
  }

  const deleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Aprendizaje
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Cultiva tu mente, expande tus horizontes</p>
        </div>
        <Button
          onClick={() => setShowAddBook(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Libro
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Libros Leídos</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-purple-400">{totalBooksRead}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Leyendo</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-blue-400">{currentlyReading}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-400">Páginas</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-green-400">{totalPagesRead.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Rating Prom.</span>
            </div>
            <div className="text-lg md:text-xl font-bold text-yellow-400">
              {averageRating ? averageRating.toFixed(1) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objetivos de Lectura */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-lg">Objetivos de Lectura</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {readingGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {goal.period} - {goal.target} páginas
                </span>
                <span className="text-sm text-slate-400">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribución por Categorías */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Libros por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-semibold">{category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progreso Semanal */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Páginas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="pages" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Libros */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mi Biblioteca</CardTitle>
            <Badge variant="outline" className="bg-slate-700/50">
              {books.length} libros
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <Badge
                      className={`text-xs ${
                        book.status === "completed"
                          ? "bg-green-600/20 text-green-400 border-green-500/30"
                          : book.status === "reading"
                            ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                            : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {book.status === "completed" ? "Completado" : book.status === "reading" ? "Leyendo" : "Pausado"}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">por {book.author}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span>{book.category}</span>
                    <span>
                      {book.currentPage} / {book.totalPages} páginas
                    </span>
                    {book.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    )}
                  </div>
                  <Progress value={(book.currentPage / book.totalPages) * 100} className="h-2 mb-2" />
                  {book.notes && <p className="text-sm text-slate-300 italic">{book.notes}</p>}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBook(book)
                      setShowUpdateProgress(true)
                    }}
                    className="border-slate-600 hover:bg-slate-700/50"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBook(book)
                      setShowEditBook(true)
                    }}
                    className="border-slate-600 hover:bg-slate-700/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBook(book.id)}
                    className="border-red-600 hover:bg-red-700/20 text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dialog para agregar libro */}
      <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Agregar Nuevo Libro
            </DialogTitle>
            <DialogDescription>Registra un nuevo libro en tu biblioteca personal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pages">Total de Páginas *</Label>
                <Input
                  id="pages"
                  type="number"
                  value={newBook.totalPages}
                  onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={newBook.category} onValueChange={(value) => setNewBook({ ...newBook, category: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Fecha Objetivo</Label>
              <Input
                id="target"
                type="date"
                value={newBook.targetDate}
                onChange={(e) => setNewBook({ ...newBook, targetDate: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={newBook.notes}
                onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={addBook}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex-1"
            >
              Agregar Libro
            </Button>
            <Button variant="outline" onClick={() => setShowAddBook(false)} className="border-slate-700">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para actualizar progreso */}
      <Dialog open={showUpdateProgress} onOpenChange={setShowUpdateProgress}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Actualizar Progreso
            </DialogTitle>
            <DialogDescription>
              {selectedBook && `${selectedBook.title} - Página actual: ${selectedBook.currentPage}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPages">Nueva página actual</Label>
              <Input
                id="newPages"
                type="number"
                value={newPages}
                onChange={(e) => setNewPages(e.target.value)}
                max={selectedBook?.totalPages}
                className="bg-slate-800/50 border-slate-700"
                placeholder={`Máximo ${selectedBook?.totalPages} páginas`}
              />
            </div>
            {selectedBook && (
              <div className="text-sm text-slate-400">
                Progreso:{" "}
                {Math.round(((Number.parseInt(newPages) || selectedBook.currentPage) / selectedBook.totalPages) * 100)}%
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={updateProgress}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1"
            >
              Actualizar
            </Button>
            <Button variant="outline" onClick={() => setShowUpdateProgress(false)} className="border-slate-700">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
