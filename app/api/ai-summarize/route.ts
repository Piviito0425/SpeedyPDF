// app/api/ai-summarize/route.ts
import { NextRequest, NextResponse } from "next/server"
import { summarizeAdaptive } from "@/lib/ai"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== "string") {
      return NextResponse.json({ summary: "Resumen de prueba\n\nOk." });
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY no configurada" }, { status: 500 })
    }

    // Usar el sistema adaptativo
    const result = await summarizeAdaptive(text)
    
    // Uso y coste estimado (gpt-4o-mini): in $0.15/M, out $0.60/M
    // Nota: El coste real dependerá de las llamadas múltiples del sistema adaptativo
    const cost_usd_est = null // No calculamos coste exacto por simplicidad
    
    return NextResponse.json({ 
      summary: result.markdown, 
      type: result.type,
      cost_usd_est 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error inesperado" }, { status: 500 })
  }
}
