"use client"

import { useState } from "react"

type Props = {
  pdfUrl: string | null
}

export default function PdfInlineEditor({ pdfUrl }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Genera una previsualización para ver el PDF</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Previsualización del PDF</h3>
        <p className="text-xs text-gray-500">Vista previa de cómo se verá tu documento</p>
      </div>
      
             <div className="flex-1 relative min-h-0">
         <iframe
           src={pdfUrl}
           className="w-full h-full border rounded-lg shadow-sm"
           onLoad={() => setIsLoading(false)}
           onLoadStart={() => setIsLoading(true)}
                       style={{ 
              border: 'none',
              minHeight: '700px',
              display: 'block'
            }}
         />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando previsualización...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">
          El PDF se generará con la configuración actual: plantilla seleccionada, 
          colores y contenido del editor
        </p>
      </div>
    </div>
  )
}


