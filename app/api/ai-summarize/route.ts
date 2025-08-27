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

    const system = "Devuelve SOLO JSON válido con: intro (string), bullets (array de 4 strings cronológicas, una frase cada una). Español neutro. Nada fuera del JSON."

    const user = `Resume el siguiente texto en 120–160 palabras en total. Mantén exactamente 4 bullets.\n\n${text}`

    // Llamada al endpoint de Chat Completions (OpenAI)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        top_p: 1,
        max_tokens: 600,
        response_format: { "type": "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ]
      }),
    })

    if (!res.ok) {
      const errTxt = await res.text()
      return NextResponse.json({ error: `Fallo proveedor IA: ${errTxt}` }, { status: 502 })
    }

    const data = await res.json()
    const jsonContent = data?.choices?.[0]?.message?.content?.trim()
    
    if (!jsonContent) {
      return NextResponse.json({ error: "No se pudo generar contenido" }, { status: 500 })
    }

    // Parse JSON response
    let parsedData
    try {
      parsedData = JSON.parse(jsonContent)
    } catch (e) {
      return NextResponse.json({ error: "Respuesta JSON inválida de la IA" }, { status: 500 })
    }

    // Validate structure
    if (!parsedData.intro || !Array.isArray(parsedData.bullets) || parsedData.bullets.length !== 4) {
      return NextResponse.json({ error: "Estructura JSON inválida" }, { status: 500 })
    }

    // Render markdown summary
    const summary = renderMarkdownSummary(parsedData)

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

function renderMarkdownSummary(d: { intro: string; bullets: string[] }) {
  return `## Resumen
${d.intro}

1. ${d.bullets[0]}
2. ${d.bullets[1]}
3. ${d.bullets[2]}
4. ${d.bullets[3]}`;
}
