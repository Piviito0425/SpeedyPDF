"use client"

import type React from "react"

interface MarkdownPreviewProps {
  content: string
  template: "classic" | "compact"
  brandColor?: string
}

export function MarkdownPreview({ content, template, brandColor = "#000000" }: MarkdownPreviewProps) {
  // Simple markdown to HTML conversion (in a real app, use a proper markdown parser)
  const parseMarkdown = (text: string) => {
    return text
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" />')
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(.*)$/gm, "<p>$1</p>")
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
        <div
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
