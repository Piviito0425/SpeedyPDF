// app/api/ai-summarize/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

 export async function POST(req: NextRequest) {
  try {
    const { markdown } = await req.json()
     if (!markdown || typeof markdown !== "string") {
      return NextResponse.json({ markdown: "Resumen de prueba\n\nOk." });
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY no configurada" }, { status: 500 })
    }

    const system = [
      "Eres un asistente experto en resumir textos en ESPAÑOL.",
      "Genera resúmenes CLAROS, ORGANIZADOS y FÁCILES DE LEER.",
      "",
      "ESTRUCTURA OBLIGATORIA:",
      "1. TÍTULO DEL RESUMEN (sin caracteres especiales)",
      "2. RESUMEN EJECUTIVO (2-3 párrafos)",
      "3. PUNTOS CLAVE (lista con viñetas)",
      "4. CONCLUSIONES (opcional, si aplica)",
      "",
      "REGLAS IMPORTANTES:",
      "- NO uses caracteres como #, *, -, etc. en el texto visible",
      "- Usa párrafos bien estructurados y separados por líneas en blanco",
      "- Las listas deben usar viñetas simples (•) o números",
      "- Longitud objetivo: 200-400 palabras",
      "- Mantén un tono profesional pero accesible",
      "- No inventes información que no esté en el texto original",
      "",
      "FORMATO DE SALIDA:",
      "TÍTULO DEL RESUMEN",
      "",
      "RESUMEN EJECUTIVO",
      "[2-3 párrafos bien estructurados]",
      "",
      "PUNTOS CLAVE",
      "• [Punto 1]",
      "• [Punto 2]",
      "• [Punto 3]",
      "",
      "CONCLUSIONES",
      "[Si aplica, un párrafo final]"
    ].join("\n")

    const user = [
      "Texto original a resumir:",
      "",
      markdown,
      "",
      "Genera un resumen siguiendo exactamente la estructura y formato especificado."
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
        temperature: 0.3,
        max_tokens: 500
      }),
    })

    if (!res.ok) {
      const errTxt = await res.text()
      return NextResponse.json({ error: `Fallo proveedor IA: ${errTxt}` }, { status: 502 })
    }

    const data = await res.json()
    const markdownOut =
      data?.choices?.[0]?.message?.content?.trim() || "Resumen\n\nNo se pudo generar contenido."

      // Uso y coste estimado (gpt-4o-mini): in $0.15/M, out $0.60/M
    const usage = data?.usage // { prompt_tokens, completion_tokens, total_tokens }
    const cost_usd_est = usage
    ? (usage.prompt_tokens / 1e6) * 0.15 + (usage.completion_tokens / 1e6) * 0.60
    : null
    return NextResponse.json({ markdown: markdownOut, usage, cost_usd_est })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error inesperado" }, { status: 500 })
  }
}