// app/api/ai-summarize/route.ts
import { NextRequest, NextResponse } from "next/server"

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

    const system = [
      "Eres un asistente que resume textos en ESPAÑOL.",
      "Devuelve SIEMPRE Markdown válido.",
      "Estructura: # Título, ## Resumen ejecutivo, ## Puntos clave (bullets), ## Riesgos/Limitaciones.",
      "Longitud objetivo: 200-400 palabras.",
      "No inventes datos que no estén en el texto original.",
    ].join("\n")

    const user = [
      "Texto original a resumir:",
      text,
    ].join("\n")

    // Llamada al endpoint de Chat Completions (OpenAI)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // rápido/barato; cambia si prefieres otro
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        max_tokens: 250
      }),
    })

    if (!res.ok) {
      const errTxt = await res.text()
      return NextResponse.json({ error: `Fallo proveedor IA: ${errTxt}` }, { status: 502 })
    }

    const data = await res.json()
    const summary =
      data?.choices?.[0]?.message?.content?.trim() || "Resumen\n(No se pudo generar contenido)"

      // Uso y coste estimado (gpt-4o-mini): in $0.15/M, out $0.60/M
    const usage = data?.usage // { prompt_tokens, completion_tokens, total_tokens }
    const cost_usd_est = usage
    ? (usage.prompt_tokens / 1e6) * 0.15 + (usage.completion_tokens / 1e6) * 0.60
    : null
    return NextResponse.json({ summary, usage, cost_usd_est })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error inesperado" }, { status: 500 })
  }
}
