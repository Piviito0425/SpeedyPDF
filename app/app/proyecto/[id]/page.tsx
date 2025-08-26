"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, Eye, Sparkles } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"
import PdfInlineEditor from "@/components/PdfInlineEditor"

export default function ProyectoPage({ params }: { params: { id: string } }) {
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [template, setTemplate] = useState<"classic" | "compact">("classic")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (file: File) => {
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const previewEditable = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Por favor, añade algún contenido al editor",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("text", text)
      formData.append("template", template)
      formData.append("textColor", textColor)
      formData.append("bgColor", bgColor)
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch("/api/pdf/compose", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al generar el PDF")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      
      toast({
        title: "Éxito",
        description: "PDF generado correctamente",
      })
    } catch (error: any) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Error al generar el PDF",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAISummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Por favor, añade algún contenido para resumir",
        variant: "destructive",
      })
      return
    }

    setIsSummarizing(true)
    try {
      const response = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Error al resumir el texto")
      }

      const data = await response.json()
      setText(data.summary)
      
      toast({
        title: "Resumen generado",
        description: "El contenido ha sido resumido por IA",
      })
    } catch (error) {
      console.error("Error summarizing:", error)
      toast({
        title: "Error",
        description: "Error al resumir el texto",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editor de Documentos</h1>
        <div className="text-sm text-gray-500">Proyecto: {params.id}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Editor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor 
                content={text}
                onChange={setText}
                onImageUpload={handleImageUpload}
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen del Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageUrl ? (
                  <div className="space-y-4">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-w-full h-32 object-contain mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImageFile(null)
                        setImageUrl(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Eliminar imagen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG hasta 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Plantilla</Label>
                <Select value={template} onValueChange={(value: "classic" | "compact") => setTemplate(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Clásica</SelectItem>
                    <SelectItem value="compact">Compacta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="textColor">Color del texto de previsualización</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bgColor">Color de fondo de previsualización</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={previewEditable} disabled={isLoading} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  {isLoading ? "Generando..." : "Previsualizar"}
                </Button>
                {pdfUrl && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = pdfUrl
                      a.download = 'documento.pdf'
                      a.click()
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Button 
                onClick={handleAISummarize} 
                disabled={isSummarizing} 
                variant="outline" 
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isSummarizing ? "Resumiendo..." : "Resumir con IA"}
              </Button>
            </CardContent>
          </Card>

          {/* PDF Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Previsualización</CardTitle>
            </CardHeader>
            <CardContent>
              <PdfInlineEditor pdfUrl={pdfUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
