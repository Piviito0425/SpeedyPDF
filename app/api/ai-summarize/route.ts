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
      "Genera resúmenes CLAROS, ORGANIZADOS y FÁCILES DE LEER usando HTML.",
      "",
      "ESTRUCTURA OBLIGATORIA:",
      "1. TÍTULO DEL RESUMEN (en mayúsculas, sin caracteres especiales)",
      "2. RESUMEN EJECUTIVO (2-3 párrafos)",
      "3. PUNTOS CLAVE (lista numerada)",
      "4. CONCLUSIONES (opcional, si aplica)",
      "",
      "REGLAS IMPORTANTES:",
      "- USA SOLO HTML para el formato",
      "- Cada sección debe estar en un <h2> o <h3>",
      "- Cada párrafo debe estar en un <p>",
      "- Las listas deben usar <ol> y <li>",
      "- Longitud objetivo: 200-400 palabras",
      "- Mantén un tono profesional pero accesible",
      "- No inventes información que no esté en el texto original",
      "",
      "FORMATO DE SALIDA EXACTO (HTML):",
      "<h2>TÍTULO DEL RESUMEN</h2>",
      "",
      "<h3>RESUMEN EJECUTIVO</h3>",
      "<p>[Primer párrafo del resumen]</p>",
      "<p>[Segundo párrafo del resumen]</p>",
      "",
      "<h3>PUNTOS CLAVE</h3>",
      "<ol>",
      "<li>[Primer punto clave]</li>",
      "<li>[Segundo punto clave]</li>",
      "<li>[Tercer punto clave]</li>",
      "</ol>",
      "",
      "<h3>CONCLUSIONES</h3>",
      "<p>[Párrafo de conclusiones]</p>"
    ].join("\n")

    const user = [
      "Texto original a resumir:",
      "",
      text,
      "",
      "IMPORTANTE: Genera el resumen usando EXACTAMENTE el formato HTML especificado.",
      "Usa las etiquetas HTML correctas: <h2>, <h3>, <p>, <ol>, <li>.",
      "El resultado debe ser HTML válido y bien estructurado."
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
