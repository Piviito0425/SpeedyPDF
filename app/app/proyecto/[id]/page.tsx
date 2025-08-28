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
import { SummaryTypeDialog, SummaryType } from "@/components/summary-type-dialog"

export default function ProyectoPage({ params }: { params: { id: string } }) {
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [summaryPdfUrl, setSummaryPdfUrl] = useState<string | null>(null)
  const [summaryType, setSummaryType] = useState<string | null>(null)
  const [selectedSummaryType, setSelectedSummaryType] = useState<SummaryType>("auto")
  const [showSummaryDialog, setShowSummaryDialog] = useState(false)
  const [template, setTemplate] = useState<"compact">("compact")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
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

  const handleAISummarize = async (summaryType: SummaryType = selectedSummaryType) => {
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
      // Obtener el resumen
      const response = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, summaryType }),
      })

      if (!response.ok) {
        throw new Error("Error al resumir el texto")
      }

      const data = await response.json()
      const summary = data.summary
      const type = data.type
      
      // Guardar el tipo de documento detectado
      setSummaryType(type)
      
      // Luego generar PDF del resumen
      const formData = new FormData()
      formData.append("text", summary)
      formData.append("template", template)
      formData.append("textColor", textColor)
      formData.append("bgColor", bgColor)
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const pdfResponse = await fetch("/api/pdf/compose", {
        method: "POST",
        body: formData,
      })

      if (!pdfResponse.ok) {
        const errorData = await pdfResponse.json()
        throw new Error(errorData.error || "Error al generar el PDF del resumen")
      }

      const blob = await pdfResponse.blob()
      const url = URL.createObjectURL(blob)
      setSummaryPdfUrl(url)
      
      toast({
        title: "Resumen generado",
        description: "El resumen se ha generado y mostrado en la previsualización",
      })
    } catch (error) {
      console.error("Error summarizing:", error)
      toast({
        title: "Error",
        description: "Error al generar el resumen",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleSummaryTypeSelect = (type: SummaryType) => {
    setSelectedSummaryType(type)
    handleAISummarize(type)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editor</h1>
        <div className="text-sm text-gray-500">Proyecto: {params.id}</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* PDF Preview - Mucho más grande */}
        <div className="xl:col-span-3">
                     <Card className="h-[85vh]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Previsualización del PDF</span>
                {summaryType && (
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {summaryType === 'meeting' && '📋 Reunión'}
                    {summaryType === 'narrative' && '📖 Narrativa'}
                    {summaryType === 'news/article' && '📰 Artículo'}
                    {summaryType === 'technical_report' && '📊 Técnico'}
                    {summaryType === 'technical' && '📊 Técnico'}
                    {summaryType === 'legal' && '⚖️ Legal'}
                    {summaryType === 'email' && '📧 Email'}
                    {summaryType === 'generic' && '📄 Genérico'}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
                         <CardContent className="h-full p-2">
               <PdfInlineEditor pdfUrl={summaryPdfUrl || pdfUrl} />
             </CardContent>
          </Card>

          {/* Editor Section - Debajo del PDF */}
          <Card className="mt-6">
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
        </div>

        {/* Configuration Section */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Plantilla</Label>
                                 <Select value={template} onValueChange={(value: "compact") => setTemplate(value)}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
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
                {(pdfUrl || summaryPdfUrl) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = summaryPdfUrl || pdfUrl
                      a.download = summaryPdfUrl ? 'resumen.pdf' : 'documento.pdf'
                      a.click()
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Button 
                onClick={() => setShowSummaryDialog(true)} 
                disabled={isSummarizing} 
                variant="outline" 
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isSummarizing ? "Resumiendo..." : (
                  <>
                    Resumir con IA
                    {selectedSummaryType !== "auto" && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {selectedSummaryType === "meeting" && "📋"}
                        {selectedSummaryType === "narrative" && "📖"}
                        {selectedSummaryType === "article" && "📰"}
                        {selectedSummaryType === "technical" && "📊"}
                        {selectedSummaryType === "legal" && "⚖️"}
                        {selectedSummaryType === "email" && "📧"}
                        {selectedSummaryType === "generic" && "📄"}
                      </span>
                    )}
                  </>
                )}
              </Button>
              {selectedSummaryType !== "auto" && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                                     Tipo seleccionado: {
                     selectedSummaryType === "meeting" && "Reunión / Minutos"
                     || selectedSummaryType === "narrative" && "Narrativa / Historia"
                     || selectedSummaryType === "article" && "Artículo / Noticia"
                     || selectedSummaryType === "technical" && "Documento técnico"
                     || selectedSummaryType === "legal" && "Legal / Política"
                     || selectedSummaryType === "email" && "Hilo de emails"
                     || selectedSummaryType === "generic" && "Genérico"
                   }
                </p>
              )}
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
      </div>

      {/* Summary Type Dialog */}
      <SummaryTypeDialog
        open={showSummaryDialog}
        onOpenChange={setShowSummaryDialog}
        onSelectType={handleSummaryTypeSelect}
        selectedType={selectedSummaryType}
      />
    </div>
  )
}