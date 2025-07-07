"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Send, Sparkles, MessageCircle, Lightbulb, Zap, Clock, BarChart3 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "analysis" | "recommendation" | "motivation"
}

interface CoachingSession {
  id: string
  title: string
  date: Date
  duration: number
  topics: string[]
  insights: string[]
  actionItems: string[]
}

export default function CoachIAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy tu Coach IA personal. Estoy aquí para ayudarte a alcanzar tus objetivos y maximizar tu potencial. He analizado tu progreso en las diferentes áreas de Miceo y tengo algunas observaciones interesantes para compartir contigo.\n\n**Análisis de tu progreso actual:**\n\n🎯 **Finanzas**: Excelente control de gastos (67% de cumplimiento)\n💪 **Entrenamiento**: Muy consistente (4/6 entrenamientos esta semana)\n🥗 **Nutrición**: Buen balance nutricional, podrías mejorar hidratación\n✅ **Hábitos**: 75% de completación diaria\n🧠 **Mentalidad**: Progreso sólido en confianza (75%)\n\n¿En qué área te gustaría enfocarte hoy? ¿O hay algún desafío específico que estés enfrentando?",
      timestamp: new Date(),
      type: "analysis",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [coachingSessions] = useState<CoachingSession[]>([
    {
      id: "1",
      title: "Optimización de Rutina Matutina",
      date: new Date(Date.now() - 86400000),
      duration: 25,
      topics: ["Productividad", "Hábitos", "Bienestar"],
      insights: [
        "Tu rutina matutina actual es sólida pero puede optimizarse",
        "Agregar 10 minutos de meditación podría mejorar tu enfoque",
        "Considerar preparar el desayuno la noche anterior",
      ],
      actionItems: [
        "Implementar meditación de 10 min después del ejercicio",
        "Preparar smoothie ingredients la noche anterior",
        "Revisar progreso en 1 semana",
      ],
    },
    {
      id: "2",
      title: "Estrategia de Ahorro e Inversión",
      date: new Date(Date.now() - 172800000),
      duration: 30,
      topics: ["Finanzas", "Objetivos", "Planificación"],
      insights: [
        "Excelente disciplina en el control de gastos",
        "Oportunidad de aumentar tasa de ahorro en 5%",
        "Considerar diversificar inversiones",
      ],
      actionItems: [
        "Automatizar transferencia adicional de $3000/mes",
        "Investigar ETFs de mercados emergentes",
        "Revisar portafolio mensualmente",
      ],
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cargar mensajes almacenados
  useEffect(() => {
    const stored = localStorage.getItem("coach-ia-messages")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setMessages(parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  // Guardar mensajes
  useEffect(() => {
    localStorage.setItem(
      "coach-ia-messages",
      JSON.stringify(messages.map((m) => ({ ...m, timestamp: m.timestamp })))
    )
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/coach-ia/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            previousMessages: messages.slice(-5), // Últimos 5 mensajes para contexto
            userProgress: {
              finanzas: { gastos: 32000, ingresos: 45000, ahorros: 8000 },
              entrenamiento: { entrenamientos_semana: 4, objetivo: 6 },
              nutricion: { calorias_promedio: 1950, objetivo: 2000 },
              habitos: { completados: 3, total: 4 },
              mentalidad: { progreso_confianza: 75 },
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        type: data.type || "text",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "analysis":
        return <BarChart3 className="h-4 w-4 text-blue-400" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-yellow-400" />
      case "motivation":
        return <Zap className="h-4 w-4 text-green-400" />
      default:
        return <MessageCircle className="h-4 w-4 text-purple-400" />
    }
  }

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case "analysis":
        return <Badge className="bg-blue-600 text-white text-xs">Análisis</Badge>
      case "recommendation":
        return <Badge className="bg-yellow-600 text-white text-xs">Recomendación</Badge>
      case "motivation":
        return <Badge className="bg-green-600 text-white text-xs">Motivación</Badge>
      default:
        return null
    }
  }

  // Sugerencias rápidas
  const quickSuggestions = [
    "¿Cómo puedo mejorar mi rutina matutina?",
    "Analiza mi progreso financiero",
    "Dame consejos para mantener la motivación",
    "¿Qué ejercicios me recomiendas?",
    "Ayúdame a planificar mis objetivos del mes",
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex h-screen">
        {/* Sidebar - Sesiones Anteriores */}
        <div className="w-80 bg-slate-900/50 border-r border-slate-800 p-4 hidden lg:block">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Bot className="h-6 w-6 text-purple-400" />
              <h2 className="text-lg font-semibold">Coach IA</h2>
            </div>

            {/* Stats Rápidas */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Progreso General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Finanzas</span>
                  <Badge className="bg-green-600 text-white">67%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Entrenamiento</span>
                  <Badge className="bg-blue-600 text-white">80%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Nutrición</span>
                  <Badge className="bg-yellow-600 text-white">85%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Hábitos</span>
                  <Badge className="bg-purple-600 text-white">75%</Badge>
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-slate-700" />

            {/* Sesiones Anteriores */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Sesiones Anteriores</h3>
              {coachingSessions.map((session) => (
                <Card
                  key={session.id}
                  className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{session.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {session.duration}min
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {session.topics.slice(0, 2).map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-slate-700 text-slate-300 border-slate-600"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {session.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                            +{session.topics.length - 2}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{session.date.toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Coach IA
                </h1>
                <p className="text-slate-400 text-sm md:text-base">Tu mentor personal inteligente</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-400">En línea</span>
              </div>
            </div>
          </div>

          {/* Área de Chat */}
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto"
                          : "bg-slate-800/50 border border-slate-700"
                      }`}
                    >
                      {message.role === "assistant" && message.type && (
                        <div className="flex items-center gap-2 mb-3">
                          {getMessageIcon(message.type)}
                          {getMessageBadge(message.type)}
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none">
                        {message.content.split("\n").map((line, index) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <h4 key={index} className="font-semibold text-white mb-2 mt-3">
                                {line.replace(/\*\*/g, "")}
                              </h4>
                            )
                          }
                          if (
                            line.startsWith("🎯") ||
                            line.startsWith("💪") ||
                            line.startsWith("🥗") ||
                            line.startsWith("✅") ||
                            line.startsWith("🧠")
                          ) {
                            return (
                              <div key={index} className="flex items-start gap-2 mb-2 p-2 bg-slate-700/30 rounded-lg">
                                <span className="text-lg">{line.charAt(0)}</span>
                                <span className="text-sm text-slate-300">{line.substring(2)}</span>
                              </div>
                            )
                          }
                          return line ? (
                            <p key={index} className="mb-2 text-sm leading-relaxed">
                              {line}
                            </p>
                          ) : (
                            <br key={index} />
                          )
                        })}
                      </div>
                    </div>

                    <div
                      className={`text-xs text-slate-400 mt-2 ${message.role === "user" ? "text-right" : "text-left"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-sm text-slate-400 ml-2">Analizando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Sugerencias Rápidas */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-slate-800">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Sugerencias para empezar:</h3>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(suggestion)}
                      className="text-xs bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
                    className="bg-slate-800/50 border-slate-700 pr-12 py-3 text-sm placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center mt-3 text-xs text-slate-500">
                <span>Powered by IA • Respuestas personalizadas basadas en tu progreso</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
