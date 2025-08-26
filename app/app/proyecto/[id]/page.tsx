"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MarkdownEditor } from "@/components/markdown-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { PdfExportDialog } from "@/components/pdf-export-dialog"
import { FileText, Save, GitBranch, Download, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Sparkles } from "lucide-react" // icono bonito para IA

// Contenido inicial
const initialContent = `# Título de ejemplo\n\nEscribe aquí tu contenido en Markdown.\n\n- Punto con guion\n* Punto con asterisco\n1. Punto numerado\n\n[Enlace](https://example.com)`

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState(initialContent)
  const [template, setTemplate] = useState<"classic" | "compact">("classic")
  const [brandColor, setBrandColor] = useState("#000000")
  const [projectName, setProjectName] = useState("Manual de usuario")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)              // ⬅️ nuevo
  const [aiPreview, setAiPreview] = useState<string | null>(null) // ⬅️ nuevo
  const { toast } = useToast()

  // ⬅️ función nueva: llama a tu API para resumir el Markdown actual
  const handleAISummarize = async () => {
    if (!content.trim()) {
      toast({ title: "Sin contenido", description: "Escribe o pega texto antes de resumir." })
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: content }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Fallo al generar el resumen")
      }
      const data = await res.json()
      setAiPreview(data.markdown) // mostramos el resumen en la preview sin pisar tu contenido aún
      toast({ title: "Resumen listo", description: "Revisa la previsualización a la derecha." })
    } catch (e: any) {
      toast({ title: "Error", description: e.message ?? "No se pudo generar el resumen" })
    } finally {
      setAiLoading(false)
    }
  }

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

  

  const applyAiSummary = () => {
    if (aiPreview) setContent(aiPreview)
    setAiPreview(null)
    toast({ title: "Resumen aplicado", description: "El editor se actualizó con el resumen." })
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
              <Button variant="secondary" onClick={handleAISummarize} disabled={aiLoading}>
                <Sparkles className="h-4 w-4 mr-2" />
                {aiLoading ? "Resumiendo..." : "Resumir con IA"}
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
                <CardTitle>Editor de texto Markdown</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Escribe tu contenido en Markdown aquí..."
                />
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
                  <Label htmlFor="brand-color">Color de texto</Label>
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
<Card>
  <CardHeader>
    <CardTitle>Previsualización</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {aiPreview ? (
      <>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Vista previa del resumen IA (no aplicado)</span>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={() => setAiPreview(null)}>Descartar</Button>
            <Button size="sm" onClick={applyAiSummary}>Aplicar al editor</Button>
          </div>
        </div>
        <MarkdownPreview content={aiPreview} template={template} brandColor={brandColor} />
      </>
    ) : (
      <MarkdownPreview content={content} template={template} brandColor={brandColor} />
    )}
  </CardContent>
</Card>

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
