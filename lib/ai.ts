// lib/ai.ts
import OpenAI from "openai";
import { 
  DocumentType, 
  RouteResult, 
  MeetingJSON, 
  NarrativeJSON, 
  ArticleJSON, 
  SummaryResult 
} from "./types";

export const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const MODEL = "gpt-4o-mini";

// 1. Router: clasifica el texto
export async function routeDocType(text: string): Promise<RouteResult> {
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    top_p: 1,
    max_tokens: 200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Clasifica el texto en uno de estos tipos:\n" +
          "- 'meeting': Transcripciones de reuniones, conversaciones entre personas, minutas\n" +
          "- 'narrative': Cuentos, historias, relatos, narrativas, descripciones de personajes/eventos\n" +
          "- 'news/article': Noticias, artículos informativos, reportes de actualidad, análisis técnico\n" +
          "- 'technical_report': Documentos técnicos, manuales, especificaciones, documentación\n" +
          "- 'legal/policy': Documentos legales, políticas, términos y condiciones\n" +
          "- 'email_thread': Conversaciones por email, hilos de correo\n" +
          "- 'generic': Otros tipos de texto\n\n" +
          "Devuelve SOLO JSON con {type, confidence, reason}. Usa 'narrative' para cuentos e historias.",
      },
      {
        role: "user",
        content: `Clasifica este texto:\n${text.slice(0, 6000)}`,
      },
    ],
  });
  return JSON.parse(r.choices[0].message.content!);
}

// 2. Resumidores por tipo (JSON estricto) + renderers

export async function summarizeMeeting(text: string): Promise<MeetingJSON> {
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    top_p: 1,
    max_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Devuelve SOLO JSON válido con las claves: " +
          "sections(3-6 con {title, bullets[2-6]}), decisions[1-8], action_items[1-10]{owner,action,due_date?}, " +
          "title?, date?, attendees?. Español neutro. Nada fuera del JSON.",
      },
      {
        role: "user",
        content:
          "Resume esta transcripción de reunión en formato minutas, con secciones temáticas, decisiones y tareas con responsables:\n" +
          text.slice(0, 16000),
      },
    ],
  });
  return JSON.parse(r.choices[0].message.content!);
}

export function renderMeetingMD(d: MeetingJSON) {
  const head = d.title ? `${d.title}\n\n` : "";
  const secs = d.sections
    .map(
      (s, i) =>
        `${i + 1}. ${s.title}\n` + s.bullets.map((b) => `   - ${b}`).join("\n")
    )
    .join("\n\n");
  const decisions = d.decisions?.length
    ? `\n\nAcuerdos finales:\n` + d.decisions.map((x) => `- ${x}`).join("\n")
    : "";
  const tasks = d.action_items?.length
    ? `\n\nTareas asignadas:\n` +
      d.action_items
        .map(
          (t) =>
            `- ${t.owner}: ${t.action}${
              t.due_date ? ` (vence: ${t.due_date})` : ""
            }`
        )
        .join("\n")
    : "";
  return `${head}Resumen de la reunión\n\n${secs}${decisions}${tasks}`.trim();
}

// Narrativa/cuento
export async function summarizeNarrative(text: string): Promise<NarrativeJSON> {
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    top_p: 1,
    max_tokens: 500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Devuelve SOLO JSON con {synopsis: string (2-3 frases descriptivas), bullets: string[4] (puntos clave cronológicos)}. " +
          "Para cuentos e historias, enfócate en la narrativa y los eventos principales.",
      },
      {
        role: "user",
        content: `Resume esta historia/narrativa en sinopsis + 4 puntos clave:\n${text.slice(0, 16000)}`,
      },
    ],
  });
  return JSON.parse(r.choices[0].message.content!);
}

export const renderNarrativeMD = (d: NarrativeJSON) =>
  `Resumen\n${d.synopsis}\n\n1. ${d.bullets[0]}\n2. ${d.bullets[1]}\n3. ${d.bullets[2]}\n4. ${d.bullets[3]}`;

// Artículo/noticia genérica
export async function summarizeArticle(text: string): Promise<ArticleJSON> {
  const r = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    top_p: 1,
    max_tokens: 600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Devuelve SOLO JSON con {tldr: string (1-2 frases), claves: string[3-6], cifras?: string[0-5]}.",
      },
      {
        role: "user",
        content: `Resume como noticia: TL;DR + claves + (opcional) cifras/fechas:\n${text.slice(0, 16000)}`,
      },
    ],
  });
  return JSON.parse(r.choices[0].message.content!);
}

export const renderArticleMD = (d: ArticleJSON) =>
  `Resumen: ${d.tldr}\n\nPuntos clave:\n${d.claves
    .map((x) => `- ${x}`)
    .join("\n")}${d.cifras?.length ? `\n\nDatos importantes:\n${d.cifras.map((x) => `- ${x}`).join("\n")}` : ""}`;

// 3. Orquestador adaptativo
export async function summarizeAdaptive(text: string): Promise<SummaryResult> {
  const { type, confidence } = await routeDocType(text);
  const t = confidence < 0.6 ? "generic" : type;

  if (t === "meeting") {
    const data = await summarizeMeeting(text);
    return { type: t, markdown: renderMeetingMD(data) };
  }
  if (t === "narrative") {
    const data = await summarizeNarrative(text);
    return { type: t, markdown: renderNarrativeMD(data) };
  }
  if (t === "news/article" || t === "technical_report") {
    const data = await summarizeArticle(text);
    return { type: t, markdown: renderArticleMD(data) };
  }
  // Fallback genérico
  const data = await summarizeArticle(text);
  return { type: "generic", markdown: renderArticleMD(data) };
}
