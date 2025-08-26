"use client"

import { useEffect, useRef, useState } from "react"

// Lazy imports only when needed on client
let pdfjsLib: any

type Props = {
  pdfUrl: string | null
}

export default function PdfInlineEditor({ pdfUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadAndRender() {
      if (!pdfUrl || !canvasRef.current) return

      setIsLoading(true)
      setError(null)

      try {
        if (!pdfjsLib) {
          // dynamic import to avoid SSR issues
          const mod = await import("pdfjs-dist")
          pdfjsLib = mod
        }

        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl, disableWorker: true })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.2 }) // Escala más pequeña para mejor vista
        if (cancelled) return
        
        const canvas = canvasRef.current
        const ctx = canvas!.getContext("2d")!
        canvas!.width = Math.floor(viewport.width)
        canvas!.height = Math.floor(viewport.height)
        
        await page.render({ canvasContext: ctx, viewport }).promise
      } catch (error) {
        console.error("Error loading PDF:", error)
        setError("Error al cargar la previsualización del PDF")
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    loadAndRender()
    return () => {
      cancelled = true
    }
  }, [pdfUrl])

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Genera una previsualización para ver el PDF</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando previsualización...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-red-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Previsualización del PDF</h3>
        <p className="text-xs text-gray-500">Vista previa de cómo se verá tu documento</p>
      </div>
      
      <div className="flex justify-center">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <canvas 
            ref={canvasRef} 
            className="max-w-full h-auto"
            style={{ maxHeight: '500px' }}
          />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          El PDF se generará con la configuración actual: plantilla {pdfUrl ? 'seleccionada' : ''}, 
          colores y contenido del editor
        </p>
      </div>
    </div>
  )
}


