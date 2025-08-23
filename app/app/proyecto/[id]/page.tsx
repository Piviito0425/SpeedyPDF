"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownEditor } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { PdfExportDialog } from "@/components/pdf-export-dialog"
import { FileText, Save, GitBranch, Download, Upload, X, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock data
const initialContent = `# Manual de Usuario

## Introducción

Bienvenido a **DocLite**, la herramienta más sencilla para convertir Markdown en PDFs profesionales.

## Características principales

- Plantillas simples y elegantes
- Control de versiones integrado
- Exportación PDF de alta calidad
- Interfaz intuitiva

## Cómo empezar

1. Escribe tu contenido en Markdown
2. Elige una plantilla
3. Personaliza tu marca
4. Exporta a PDF

¡Es así de fácil!`

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState(initialContent)
  const [template, setTemplate] = useState<"classic" | "compact">("classic")
  const [brandColor, setBrandColor] = useState("#000000")
  const [projectName, setProjectName] = useState("Manual de usuario")
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number }>>([])
  const [showExportDialog, setShowExportDialog] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    // TODO backend: Save project
    toast({
      title: "Proyecto guardado",
      description: "Los cambios se han guardado correctamente.",
    })
  }

  const handleCreateVersion = () => {
    // TODO backend: Create new version
    toast({
      title: "Nueva versión creada",
      description: "Versión 1.4 creada exitosamente.",
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
    toast({
      title: "Archivos subidos",
      description: `${files.length} archivo(s) subido(s) correctamente.`,
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/app">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={handleCreateVersion}>
                <GitBranch className="h-4 w-4 mr-2" />
                Crear versión
              </Button>
              <Button onClick={() => setShowExportDialog(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Markdown Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Editor Markdown</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Escribe tu contenido en Markdown aquí..."
                />
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Arrastra y suelta imágenes aquí, o</p>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Seleccionar archivos</span>
                      </Button>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </Label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Archivos subidos:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {formatFileSize(file.size)}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            aria-label={`Eliminar ${file.name}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Template & Brand Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-select">Plantilla</Label>
                  <Select value={template} onValueChange={(value: "classic" | "compact") => setTemplate(value)}>
                    <SelectTrigger id="template-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Clásica</SelectItem>
                      <SelectItem value="compact">Compacta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand-color">Color de marca</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="brand-color"
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <MarkdownPreview content={content} template={template} brandColor={brandColor} />
          </div>
        </div>

        {/* Success Alert */}
        <Alert className="mt-6">
          <AlertDescription>
            Los cambios se guardan automáticamente. Última actualización: hace 2 minutos.
          </AlertDescription>
        </Alert>
      </div>

      {/* Export Dialog */}
      <PdfExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} projectName={projectName} />
    </div>
  )
}
