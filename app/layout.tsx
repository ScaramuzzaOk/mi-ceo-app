import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebarTrigger } from "@/components/mobile-sidebar-trigger"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Miceo App",
  description: "Tu coach personal de vida",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white dark`}>
        <ThemeProvider defaultTheme="dark">
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Trigger */}
            <MobileSidebarTrigger />

            {/* Main Content */}
            <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
