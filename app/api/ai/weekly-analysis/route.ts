import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { reportType, data } = await req.json()

    const systemPrompt = `Eres un analista experto en desarrollo personal y productividad. Tu tarea es generar un análisis detallado y crítico del progreso del usuario en diferentes áreas de su vida.

ÁREAS A ANALIZAR:
1. **Finanzas**: Control de gastos, ahorro, inversión
2. **Entrenamiento**: Consistencia, progreso físico, objetivos
3. **Nutrición**: Balance nutricional, hábitos alimentarios
4. **Hábitos**: Formación y mantenimiento de rutinas
5. **Mentalidad**: Desarrollo personal, confianza, bienestar

FORMATO DEL ANÁLISIS:
- Usa markdown para estructurar la respuesta
- Incluye secciones claras para cada área
- Proporciona insights específicos y accionables
- Identifica patrones y tendencias
- Sugiere mejoras concretas
- Celebra logros y progreso
- Señala áreas de oportunidad

ESTILO:
- Profesional pero motivador
- Basado en datos y evidencia
- Constructivo y orientado a soluciones
- Personalizado según los datos del usuario`

    const userDataSummary = `
DATOS DEL USUARIO (${reportType.toUpperCase()}):

**FINANZAS:**
- Disponible: $${data.finanzas.actual.toLocaleString()}
- Objetivo: $${data.finanzas.objetivo.toLocaleString()}
- Progreso: ${data.finanzas.porcentaje}%

**ENTRENAMIENTO:**
- Entrenamientos completados: ${data.entrenamiento.completados}/${data.entrenamiento.objetivo}
- Porcentaje de cumplimiento: ${data.entrenamiento.porcentaje}%

**NUTRICIÓN:**
- Calorías promedio: ${data.nutricion.calorias}
- Objetivo calórico: ${data.nutricion.objetivo}
- Cumplimiento: ${data.nutricion.porcentaje}%

**HÁBITOS:**
- Hábitos completados: ${data.habitos.completados}/${data.habitos.total}
- Tasa de éxito: ${data.habitos.porcentaje}%

**MENTALIDAD:**
- Progreso en confianza: ${data.mentalidad.progreso}%
- Objetivo: ${data.mentalidad.objetivo}%
- Avance: ${data.mentalidad.porcentaje}%

**PROGRESO SEMANAL:**
${data.weeklyProgress
  .map(
    (day) =>
      `${day.day}: Finanzas ${day.finanzas}%, Entrenamiento ${day.entrenamiento}%, Nutrición ${day.nutricion}%, Hábitos ${day.habitos}%, Mentalidad ${day.mentalidad}%`,
  )
  .join("\n")}
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Genera un análisis crítico y detallado del progreso del usuario basándote en los siguientes datos:\n\n${userDataSummary}`,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({
      analysis: text,
      timestamp: new Date().toISOString(),
      reportType,
    })
  } catch (error) {
    console.error("Error generating weekly analysis:", error)
    return Response.json(
      {
        error: "Error interno del servidor",
        analysis: "No se pudo generar el análisis en este momento. Por favor, intenta de nuevo más tarde.",
      },
      { status: 500 },
    )
  }
}
