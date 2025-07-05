import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    // Construir el contexto del usuario basado en su progreso
    const userContext = `
CONTEXTO DEL USUARIO:
- Progreso Financiero: Gastos $${context.userProgress.finanzas.gastos}, Ingresos $${context.userProgress.finanzas.ingresos}, Ahorros $${context.userProgress.finanzas.ahorros}
- Entrenamiento: ${context.userProgress.entrenamiento.entrenamientos_semana}/${context.userProgress.entrenamiento.objetivo} entrenamientos esta semana
- Nutrición: ${context.userProgress.nutricion.calorias_promedio}/${context.userProgress.nutricion.objetivo} calorías promedio
- Hábitos: ${context.userProgress.habitos.completados}/${context.userProgress.habitos.total} hábitos completados hoy
- Desarrollo Mental: ${context.userProgress.mentalidad.progreso_confianza}% progreso en confianza

HISTORIAL RECIENTE:
${context.previousMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}
`

    const systemPrompt = `Eres un Coach IA personal experto y empático llamado "Coach Miceo". Tu misión es ayudar a las personas a alcanzar sus objetivos en finanzas, salud, nutrición, hábitos y desarrollo personal.

PERSONALIDAD:
- Motivador pero realista
- Empático y comprensivo
- Basado en datos y evidencia
- Personalizado según el progreso del usuario
- Usa emojis ocasionalmente para hacer la conversación más amigable
- Proporciona consejos específicos y accionables

CAPACIDADES:
- Analizar el progreso del usuario en todas las áreas
- Dar recomendaciones personalizadas
- Motivar y celebrar logros
- Identificar patrones y áreas de mejora
- Sugerir estrategias específicas
- Crear planes de acción

FORMATO DE RESPUESTA:
- Usa markdown para estructurar tus respuestas
- Incluye secciones claras cuando sea apropiado
- Proporciona ejemplos concretos
- Termina con una pregunta o llamada a la acción

ÁREAS DE EXPERTISE:
1. **Finanzas**: Presupuesto, ahorro, inversión, control de gastos
2. **Entrenamiento**: Rutinas, motivación, progreso físico
3. **Nutrición**: Planes alimentarios, balance nutricional, hábitos saludables
4. **Hábitos**: Formación de hábitos, consistencia, sistemas
5. **Mentalidad**: Confianza, resiliencia, crecimiento personal

Responde de manera conversacional y personalizada basándote en el contexto del usuario.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `${userContext}\n\nUsuario: ${message}`,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Determinar el tipo de respuesta basado en el contenido
    let responseType = "text"
    if (text.toLowerCase().includes("análisis") || text.toLowerCase().includes("progreso")) {
      responseType = "analysis"
    } else if (text.toLowerCase().includes("recomiendo") || text.toLowerCase().includes("sugiero")) {
      responseType = "recommendation"
    } else if (
      text.toLowerCase().includes("¡") ||
      text.toLowerCase().includes("excelente") ||
      text.toLowerCase().includes("felicidades")
    ) {
      responseType = "motivation"
    }

    return Response.json({
      message: text,
      type: responseType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in coach chat:", error)
    return Response.json(
      {
        error: "Error interno del servidor",
        message: "Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo en unos momentos.",
      },
      { status: 500 },
    )
  }
}
