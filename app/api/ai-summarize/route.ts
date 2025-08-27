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

    const system = "Eres un redactor claro y conciso. Escribe en español neutro. Responde en viñetas y termina con una línea \"Moral: …\"."

    const user = `Resume el siguiente texto en 120-160 palabras:\n\n${text}`

    // Llamada al endpoint de Chat Completions (OpenAI)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        top_p: 1,
        max_tokens: 500
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
