"use client"

import { useState } from "react"

type Props = {
  pdfUrl: string | null
}

export default function PdfInlineEditor({ pdfUrl }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Genera una previsualización para ver el PDF</p>
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
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white w-full max-w-2xl">
          <iframe
            src={pdfUrl}
            className="w-full h-96"
            onLoad={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
            style={{ border: 'none' }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Cargando previsualización...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          El PDF se generará con la configuración actual: plantilla seleccionada, 
          colores y contenido del editor
        </p>
      </div>
    </div>
  )
}


