import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Configuración del transportador de email
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface NotificationData {
  type: "task" | "goal" | "habit" | "workout"
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  userEmail: string
}

export async function POST(request: NextRequest) {
  try {
    const data: NotificationData = await request.json()

    const { type, title, description, dueDate, priority, userEmail } = data

    // Determinar el asunto y contenido del email según el tipo
    let subject = ""
    let htmlContent = ""

    switch (type) {
      case "task":
        subject = `⚠️ Tarea próxima a vencer: ${title}`
        htmlContent = generateTaskEmailHTML(title, description, dueDate, priority)
        break
      case "goal":
        subject = `🎯 Objetivo próximo a vencer: ${title}`
        htmlContent = generateGoalEmailHTML(title, description, dueDate, priority)
        break
      case "habit":
        subject = `🔄 Recordatorio de hábito: ${title}`
        htmlContent = generateHabitEmailHTML(title, description)
        break
      case "workout":
        subject = `💪 Entrenamiento programado: ${title}`
        htmlContent = generateWorkoutEmailHTML(title, description, dueDate)
        break
      default:
        throw new Error("Tipo de notificación no válido")
    }

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: htmlContent,
    }

    // Enviar el email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Notificación enviada correctamente" })
  } catch (error) {
    console.error("Error enviando notificación:", error)
    return NextResponse.json({ success: false, error: "Error al enviar la notificación" }, { status: 500 })
  }
}

function generateTaskEmailHTML(title: string, description: string, dueDate: string, priority: string) {
  const priorityColor = priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#10b981"
  const priorityText = priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Tarea próxima a vencer</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; margin: 10px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚠️ Tarea Próxima a Vencer</h1>
                <p>Tu tarea necesita atención</p>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p><strong>Descripción:</strong> ${description}</p>
                <p><strong>Fecha límite:</strong> ${new Date(dueDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <div class="priority-badge" style="background-color: ${priorityColor};">
                    Prioridad: ${priorityText}
                </div>
                <p>No olvides completar esta tarea antes de la fecha límite para mantener tu productividad al día.</p>
                <a href="https://tu-app.com/tareas" class="cta-button">Ver Mis Tareas</a>
            </div>
            <div class="footer">
                <p>Este es un recordatorio automático de Miceo App</p>
                <p>Si no deseas recibir estas notificaciones, puedes desactivarlas en tu configuración.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function generateGoalEmailHTML(title: string, description: string, dueDate: string, priority: string) {
  const priorityColor = priority === "high" ? "#ef4444" : priority === "medium" ? "#f59e0b" : "#10b981"
  const priorityText = priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Objetivo próximo a vencer</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; margin: 10px 0; }
            .cta-button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Objetivo Próximo a Vencer</h1>
                <p>Es momento de enfocar tus esfuerzos</p>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p><strong>Descripción:</strong> ${description}</p>
                <p><strong>Fecha límite:</strong> ${new Date(dueDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <div class="priority-badge" style="background-color: ${priorityColor};">
                    Prioridad: ${priorityText}
                </div>
                <p>¡Estás cerca de alcanzar tu objetivo! Mantén el enfoque y la disciplina para lograrlo.</p>
                <a href="https://tu-app.com/finanzas" class="cta-button">Ver Mis Objetivos</a>
            </div>
            <div class="footer">
                <p>Este es un recordatorio automático de Miceo App</p>
                <p>¡Sigue adelante, estás haciendo un gran trabajo!</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function generateHabitEmailHTML(title: string, description: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Recordatorio de hábito</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔄 Recordatorio de Hábito</h1>
                <p>Es hora de mantener tu rutina</p>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p><strong>Descripción:</strong> ${description}</p>
                <p>Los pequeños pasos consistentes llevan a grandes resultados. ¡No rompas tu racha!</p>
                <a href="https://tu-app.com/habitos" class="cta-button">Marcar como Completado</a>
            </div>
            <div class="footer">
                <p>Este es un recordatorio automático de Miceo App</p>
                <p>La consistencia es la clave del éxito.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function generateWorkoutEmailHTML(title: string, description: string, dueDate: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Entrenamiento programado</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .cta-button { display: inline-block; background: #fa709a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💪 Entrenamiento Programado</h1>
                <p>Es hora de entrenar</p>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p><strong>Descripción:</strong> ${description}</p>
                <p><strong>Programado para:</strong> ${new Date(dueDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
                <p>¡Es momento de entrenar! Tu cuerpo y mente te lo agradecerán.</p>
                <a href="https://tu-app.com/entrenamiento" class="cta-button">Iniciar Entrenamiento</a>
            </div>
            <div class="footer">
                <p>Este es un recordatorio automático de Miceo App</p>
                <p>¡Dale todo en tu entrenamiento!</p>
            </div>
        </div>
    </body>
    </html>
  `
}
