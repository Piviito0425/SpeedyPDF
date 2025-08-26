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
      "Eres un asistente experto en resumir textos en ESPAÑOL.",
      "Genera resúmenes CLAROS, ORGANIZADOS y FÁCILES DE LEER.",
      "",
      "ESTRUCTURA OBLIGATORIA:",
      "1. TÍTULO DEL RESUMEN (en mayúsculas, sin caracteres especiales)",
      "2. RESUMEN EJECUTIVO (2-3 párrafos separados por líneas en blanco)",
      "3. PUNTOS CLAVE (lista numerada o con viñetas)",
      "4. CONCLUSIONES (opcional, si aplica)",
      "",
      "REGLAS IMPORTANTES:",
      "- SIEMPRE usa líneas en blanco para separar secciones",
      "- Cada párrafo debe estar separado por una línea en blanco",
      "- Los puntos clave deben estar en líneas separadas",
      "- Longitud objetivo: 200-400 palabras",
      "- Mantén un tono profesional pero accesible",
      "- No inventes información que no esté en el texto original",
      "- Usa HTML básico para formato: <br> para saltos de línea, <strong> para negritas",
      "",
      "FORMATO DE SALIDA EXACTO:",
      "TÍTULO DEL RESUMEN",
      "",
      "RESUMEN EJECUTIVO",
      "",
      "[Primer párrafo del resumen]",
      "",
      "[Segundo párrafo del resumen]",
      "",
      "PUNTOS CLAVE",
      "",
      "1. [Primer punto clave]",
      "2. [Segundo punto clave]",
      "3. [Tercer punto clave]",
      "",
      "CONCLUSIONES",
      "",
      "[Párrafo de conclusiones]"
    ].join("\n")

    const user = [
      "Texto original a resumir:",
      "",
      text,
      "",
      "IMPORTANTE: Genera el resumen siguiendo EXACTAMENTE el formato especificado.",
      "Asegúrate de usar líneas en blanco para separar secciones y párrafos.",
      "El resultado debe ser fácil de leer y bien estructurado."
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
        temperature: 0.1,
        max_tokens: 800
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
