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
      "Eres un asistente experto en crear resúmenes ejecutivos profesionales en ESPAÑOL.",
      "Genera resúmenes con estructura de NARRATIVA PROFESIONAL, similar a un caso de estudio empresarial.",
      "",
      "ESTRUCTURA OBLIGATORIA (formato narrativo):",
      "1. TÍTULO: 'Resumen Ejecutivo – [Nombre del tema]'",
      "2. CONTEXTO: Situación inicial y antecedentes",
      "3. RETO: Problema o desafío principal",
      "4. ACCIÓN: Estrategias y acciones implementadas",
      "5. RESULTADOS: Consecuencias y logros obtenidos",
      "6. CONCLUSIÓN: Reflexión final y aprendizajes",
      "",
      "REGLAS IMPORTANTES:",
      "- USA SOLO HTML para el formato",
      "- Cada sección debe estar en un <h2> para el título y <h3> para las secciones",
      "- Cada párrafo debe estar en un <p>",
      "- SIEMPRE incluye los dos puntos (:) después de cada sección",
      "- SIEMPRE deja una línea en blanco entre secciones",
      "- Longitud objetivo: 300-500 palabras",
      "- Tono PROFESIONAL y EJECUTIVO",
      "- Estructura narrativa: Contexto → Reto → Acción → Resultados → Conclusión",
      "- No inventes información que no esté en el texto original",
      "- Adapta el contenido al formato de caso de estudio",
      "",
      "FORMATO DE SALIDA EXACTO (HTML):",
      "<h2>Resumen Ejecutivo – [Título del tema]</h2>",
      "",
      "<h3>Contexto:</h3>",
      "<p>[Descripción de la situación inicial y antecedentes]</p>",
      "",
      "<h3>Reto:</h3>",
      "<p>[Descripción del problema o desafío principal]</p>",
      "",
      "<h3>Acción:</h3>",
      "<p>[Descripción de las estrategias y acciones implementadas]</p>",
      "",
      "<h3>Resultados:</h3>",
      "<p>[Descripción de las consecuencias y logros obtenidos]</p>",
      "",
      "<h3>Conclusión:</h3>",
      "<p>[Reflexión final y aprendizajes clave]</p>"
    ].join("\n")

    const user = [
      "Texto original a resumir:",
      "",
      text,
      "",
      "IMPORTANTE: Genera un resumen ejecutivo profesional usando EXACTAMENTE el formato narrativo especificado.",
      "Adapta el contenido al formato: Contexto → Reto → Acción → Resultados → Conclusión.",
      "Usa las etiquetas HTML correctas: <h2> para el título, <h3> para las secciones, <p> para párrafos.",
      "SIEMPRE incluye los dos puntos (:) después de cada sección y deja líneas en blanco entre secciones.",
      "El resultado debe ser un documento ejecutivo profesional y bien estructurado."
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
