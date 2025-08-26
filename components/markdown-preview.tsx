"use client"

import type React from "react"

interface MarkdownPreviewProps {
  content: string
  template: "classic" | "compact"
  brandColor?: string
}

export function MarkdownPreview({ content, template, brandColor = "#000000" }: MarkdownPreviewProps) {
  // Conversión markdown muy simple manteniendo estructura de bloques
  const parseMarkdown = (text: string) => {
    const applyInline = (line: string) => {
      return line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    }

    const lines = text.split(/\r?\n/)
    const htmlParts: string[] = []
    let listBuffer: string[] = []

    const flushList = () => {
      if (listBuffer.length > 0) {
        htmlParts.push(`<ul>${listBuffer.join("")}</ul>`) 
        listBuffer = []
      }
    }

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (line.length === 0) {
        flushList()
        continue
      }

      // Listas
      const listMatch = /^-\s+(.*)$/.exec(line)
      if (listMatch) {
        const item = applyInline(listMatch[1])
        listBuffer.push(`<li>${item}</li>`)
        continue
      }

      // Encabezados
      const h2Match = /^##\s+(.*)$/.exec(line)
      if (h2Match) {
        flushList()
        htmlParts.push(`<h2>${applyInline(h2Match[1])}</h2>`) 
        continue
      }
      const h1Match = /^#\s+(.*)$/.exec(line)
      if (h1Match) {
        flushList()
        htmlParts.push(`<h1>${applyInline(h1Match[1])}</h1>`) 
        continue
      }

      // Párrafo normal
      flushList()
      htmlParts.push(`<p>${applyInline(line)}</p>`) 
    }

    flushList()
    return htmlParts.join("\n")
  }

  const templateStyles = {
    classic: {
      fontFamily: "Georgia, serif",
      lineHeight: "1.6",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "2rem",
    },
    compact: {
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.4",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "1rem",
      fontSize: "0.9rem",
    },
  }

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold">Vista previa</h3>
        <p className="text-sm text-muted-foreground">Plantilla: {template === "classic" ? "Clásica" : "Compacta"}</p>
      </div>
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <style>{`
          [data-brand-preview] {
            color: var(--brand-color);
          }
          [data-brand-preview] h1,
          [data-brand-preview] h2,
          [data-brand-preview] a,
          [data-brand-preview] strong {
            color: var(--brand-color);
          }
          [data-brand-preview] ul li::marker {
            color: var(--brand-color);
          }
          [data-brand-preview] a {
            text-decoration-color: var(--brand-color);
          }
        `}</style>
        <div
          data-brand-preview
          style={
            {
              ...templateStyles[template],
              "--brand-color": brandColor,
            } as React.CSSProperties
          }
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: content
              ? parseMarkdown(content)
              : '<p class="text-muted-foreground">El contenido aparecerá aquí...</p>',
          }}
        />
      </div>
    </div>
  )
}
