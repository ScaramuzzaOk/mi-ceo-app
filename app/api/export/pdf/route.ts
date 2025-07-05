import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sections, userData } = await request.json()

    // Simulate PDF generation
    const pdfContent = generatePDFContent(sections, userData)

    // In a real implementation, you would use a library like puppeteer, jsPDF, or PDFKit
    // For now, we'll return a simple text file as demonstration
    const blob = new Blob([pdfContent], { type: "application/pdf" })

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CEO-de-Mi-Vida-Reporte-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Error generating PDF" }, { status: 500 })
  }
}

function generatePDFContent(sections: string[], userData: any): string {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let content = `
REPORTE CEO DE MI VIDA
Tu análisis completo de productividad y crecimiento personal
${currentDate}

═══════════════════════════════════════════════════════════════

`

  if (sections.includes("perfil")) {
    content += `
📊 PERFIL DEL USUARIO
═══════════════════════════════════════════════════════════════

Nivel Actual: ${userData.level}
Puntos de Experiencia: ${userData.xp}
Días de Racha: 0
Logros Desbloqueados: ${userData.achievements}

`
  }

  if (sections.includes("tareas")) {
    content += `
✅ GESTIÓN DE TAREAS
═══════════════════════════════════════════════════════════════

Resumen de Productividad:
• Tareas Completadas: 45/60
• Tasa de Finalización: 75%
• Alta Prioridad: 8 tareas
• Media Prioridad: 15 tareas
• Baja Prioridad: 22 tareas

`
  }

  if (sections.includes("habitos")) {
    content += `
🎯 SEGUIMIENTO DE HÁBITOS
═══════════════════════════════════════════════════════════════

Análisis de Consistencia:
Tu consistencia promedio es del 85%, lo que indica un excelente 
compromiso con tus rutinas diarias. La racha promedio de 12 días 
demuestra tu dedicación al crecimiento personal.

• Hábitos Activos: 8
• Completados Hoy: 6
• Mejor Racha: 28 días
• Consistencia: 85%

`
  }

  if (sections.includes("finanzas")) {
    content += `
💰 FINANZAS PERSONALES
═══════════════════════════════════════════════════════════════

Salud Financiera:
• Balance Mensual: $13,000
• Cumplimiento de Presupuesto: 92%
• Ingresos Mensuales: $45,000 (+12%)
• Gastos Mensuales: $32,000 (-5%)
• Ahorros: $13,000 (+18%)
• Tasa de Ahorro: 29%

`
  }

  if (sections.includes("entrenamiento")) {
    content += `
🏋️ ENTRENAMIENTO
═══════════════════════════════════════════════════════════════

• Entrenamientos Semanales: 3/4
• Minutos Totales: 180
• Calorías Quemadas: 1250
• Consistencia: 78%

`
  }

  if (sections.includes("nutricion")) {
    content += `
🍎 NUTRICIÓN
═══════════════════════════════════════════════════════════════

• Calorías Promedio: 1950
• Proteína Promedio: 135g
• Vasos de Agua: 7

`
  }

  if (sections.includes("aprendizaje")) {
    content += `
📚 APRENDIZAJE
═══════════════════════════════════════════════════════════════

• Cursos Activos: 3
• Cursos Completados: 2
• Libros Leídos: 5
• Horas Semanales: 12h

`
  }

  if (sections.includes("diario")) {
    content += `
📝 DIARIO PERSONAL
═══════════════════════════════════════════════════════════════

• Entradas este Mes: 18
• Estado de Ánimo Promedio: Bien
• Racha de Reflexión: 5 días
• Palabras Escritas: 15,420

`
  }

  if (sections.includes("logros")) {
    content += `
🏆 LOGROS DESBLOQUEADOS
═══════════════════════════════════════════════════════════════

🎯 Primera Tarea - Completa tu primera tarea
🔥 Racha Semanal - Mantén una racha de 7 días
⭐ Subida de Nivel - Alcanza el nivel 2

`
  }

  content += `
📈 RESUMEN DE PROGRESO GENERAL
═══════════════════════════════════════════════════════════════

En este período has demostrado un excelente compromiso con tu 
desarrollo personal. Tu consistencia en los hábitos (85%) y tu 
tasa de finalización de tareas (75%) reflejan una mentalidad de 
crecimiento sólida.

Áreas destacadas:
✓ Excelente disciplina en el entrenamiento
✓ Gestión financiera responsable con 29% de ahorro
✓ Compromiso constante con el aprendizaje
✓ Alta productividad en la gestión de tareas

Recomendaciones para seguir creciendo:
• Mantén tu racha actual
• Considera aumentar gradualmente tus metas semanales
• Explora nuevas áreas de desarrollo personal
• Comparte tu progreso con otros para mayor motivación

═══════════════════════════════════════════════════════════════
Reporte generado automáticamente por
CEO de Mi Vida - Tu Coach Personal IA
Sigue construyendo la mejor versión de ti mismo 💪
`

  return content
}
