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
    let listType: 'ul' | 'ol' | null = null
    let ulMarker: 'dash' | 'asterisk' | null = null

    const flushList = () => {
      if (listBuffer.length > 0 && listType) {
        if (listType === 'ul') {
          const markAttr = ulMarker ? ` data-ulmark="${ulMarker}"` : ''
          htmlParts.push(`<ul${markAttr}>${listBuffer.join("")}</ul>`)
        } else {
          htmlParts.push(`<ol>${listBuffer.join("")}</ol>`)
        }
        listBuffer = []
        listType = null
        ulMarker = null
      }
    }

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (line.length === 0) {
        flushList()
        continue
      }

      // Listas no ordenadas: - o *
      const ulMatch = /^(-|\*)\s+(.*)$/.exec(line)
      if (ulMatch) {
        const symbol = ulMatch[1]
        const itemText = ulMatch[2]
        const item = applyInline(itemText)
        const currentMarker: 'dash' | 'asterisk' = symbol === '-' ? 'dash' : 'asterisk'
        if (listType !== 'ul' || ulMarker !== currentMarker) {
          flushList()
          listType = 'ul'
          ulMarker = currentMarker
        }
        listBuffer.push(`<li>${item}</li>`)
        continue
      }

      // Listas ordenadas: 1. Texto
      const olMatch = /^(\d+)\.\s+(.*)$/.exec(line)
      if (olMatch) {
        const item = applyInline(olMatch[2])
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
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
      const h3Match = /^###\s+(.*)$/.exec(line)
      if (h3Match) {
        flushList()
        htmlParts.push(`<h3>${applyInline(h3Match[1])}</h3>`) 
        continue
      }
      const h4Match = /^####\s+(.*)$/.exec(line)
      if (h4Match) {
        flushList()
        htmlParts.push(`<h4>${applyInline(h4Match[1])}</h4>`) 
        continue
      }
      const h5Match = /^#####\s+(.*)$/.exec(line)
      if (h5Match) {
        flushList()
        htmlParts.push(`<h5>${applyInline(h5Match[1])}</h5>`) 
        continue
      }
      const h6Match = /^######\s+(.*)$/.exec(line)
      if (h6Match) {
        flushList()
        htmlParts.push(`<h6>${applyInline(h6Match[1])}</h6>`) 
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
          [data-brand-preview] p {
            margin: 0 0 0.75rem 0;
            line-height: 1.6;
          }
          [data-brand-preview] h1,
          [data-brand-preview] h2,
          [data-brand-preview] h3,
          [data-brand-preview] h4,
          [data-brand-preview] a,
          [data-brand-preview] strong {
            color: var(--brand-color);
          }
          [data-brand-preview] h1 {
            font-size: 1.875rem; /* 30px */
            font-weight: 700;
            margin: 1.25rem 0 0.75rem 0;
          }
          [data-brand-preview] h2 {
            font-size: 1.5rem; /* 24px */
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
          }
          [data-brand-preview] h3 {
            font-size: 1.25rem; /* 20px */
            font-weight: 600;
            margin: 0.75rem 0 0.5rem 0;
          }
          [data-brand-preview] h4 {
            font-size: 1.125rem; /* 18px */
            font-weight: 600;
            margin: 0.75rem 0 0.5rem 0;
          }
          [data-brand-preview] ul li::marker {
            color: var(--brand-color);
          }
          [data-brand-preview] ol {
            list-style: decimal;
            padding-left: 1.25rem;
            margin: 0 0 0.75rem 0;
          }
          [data-brand-preview] ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin: 0 0 0.75rem 0;
          }
          [data-brand-preview] ul[data-ulmark="dash"] {
            list-style: square;
          }
          [data-brand-preview] ul[data-ulmark="asterisk"] {
            list-style: disc;
          }
          [data-brand-preview] li {
            margin: 0.25rem 0;
          }
          [data-brand-preview] a {
            text-decoration-color: var(--brand-color);
            text-decoration: underline;
          }
          [data-brand-preview] img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0.5rem 0;
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
