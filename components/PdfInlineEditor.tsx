"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Lazy imports only when needed on client
// PDF.js rendering
// pdfjs-dist v4 recommends using the legacyBuild for worker
let pdfjsLib: any
let pdfjsViewer: any

type TextBox = {
  id: string
  x: number
  y: number
  text: string
}

type Props = {
  pdfUrl: string | null
}

export default function PdfInlineEditor({ pdfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pageViewport, setPageViewport] = useState<{ width: number; height: number; scale: number } | null>(null)
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadAndRender() {
      if (!pdfUrl || !canvasRef.current) return

      try {
        if (!pdfjsLib) {
          // dynamic import to avoid SSR issues
          const mod = await import("pdfjs-dist")
          pdfjsLib = mod
          // En Next.js/webpack, evitamos bundle del worker usando modo sin worker
        }

        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl, disableWorker: true })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.5 })
        if (cancelled) return
        const canvas = canvasRef.current
        const ctx = canvas!.getContext("2d")!
        canvas!.width = Math.floor(viewport.width)
        canvas!.height = Math.floor(viewport.height)
        setPageViewport({ width: viewport.width, height: viewport.height, scale: viewport.scale })
        await page.render({ canvasContext: ctx, viewport }).promise
      } catch (error) {
        console.error("Error loading PDF:", error)
      }
    }
    loadAndRender()
    return () => {
      cancelled = true
    }
  }, [pdfUrl])

  function addTextBox() {
    setTextBoxes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x: 40, y: 40, text: "Texto" },
    ])
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData("text/plain", id)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!id || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setTextBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, x, y } : b)))
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  async function handleDownload() {
    if (!pdfUrl || !pageViewport) return
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib")

      const origBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer())
      const pdfDoc = await PDFDocument.load(origBytes)
      const page = pdfDoc.getPage(0)
      const { width, height } = page.getSize()

      // map from canvas coords (origin top-left) to PDF coords (origin bottom-left)
      const scaleX = width / pageViewport.width
      const scaleY = height / pageViewport.height

      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

      for (const b of textBoxes) {
        const x = b.x * scaleX
        const y = height - b.y * scaleY
        page.drawText(b.text, {
          x,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        })
      }

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "editado.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error saving PDF:", error)
      alert("Error al guardar el PDF. Revisa la consola para más detalles.")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" onClick={addTextBox} disabled={!pdfUrl}>Añadir caja de texto</Button>
        <Button type="button" onClick={handleDownload} disabled={!pdfUrl}>Guardar PDF</Button>
      </div>
      <div
        ref={containerRef}
        className="relative border rounded overflow-hidden"
        style={{ width: pageViewport?.width ?? 0, height: pageViewport?.height ?? 0 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <canvas ref={canvasRef} />

        {/* overlay editable boxes */}
        {textBoxes.map((b) => (
          <div
            key={b.id}
            draggable
            onDragStart={(e) => onDragStart(e, b.id)}
            onClick={() => setSelectedId(b.id)}
            className={`absolute border rounded bg-white/70 px-1 py-0.5 cursor-move ${selectedId === b.id ? "ring-2 ring-blue-500" : ""}`}
            style={{ left: b.x, top: b.y }}
          >
            <input
              className="bg-transparent outline-none text-sm"
              value={b.text}
              onChange={(e) => setTextBoxes((prev) => prev.map((tb) => (tb.id === b.id ? { ...tb, text: e.target.value } : tb)))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}


