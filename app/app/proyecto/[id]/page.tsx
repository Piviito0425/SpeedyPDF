"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Save, GitBranch, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import PdfInlineEditor from "@/components/PdfInlineEditor"

// Contenido inicial
const initialText = `Título de ejemplo\n\nEscribe aquí tu contenido en texto plano.\n\n- Puedes pegar texto\n- O escribir libremente\n\nFin.`

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const [text, setText] = useState(initialText)
  const [template, setTemplate] = useState<"classic" | "compact">("classic")
  const [textColor, setTextColor] = useState("#000000")
  const [bgColor, setBgColor] = useState<string>("#ffffff")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("Manual de usuario")
  const { toast } = useToast()

  const onFileChange = (f: File | null) => {
    setImageFile(f)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(f ? URL.createObjectURL(f) : null)
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

  

  async function previewEditable() {
    const fd = new FormData()
    fd.append("text", text)
    fd.append("template", template)
    fd.append("textColor", textColor)
    fd.append("bgColor", bgColor)
    if (imageFile) fd.append("image", imageFile)

    const res = await fetch("/api/pdf/compose", { method: "POST", body: fd })
    if (!res.ok) {
      toast({ title: "Error", description: "PDF compose falló" })
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
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
              {/* Botones de IA / exportación removidos en este MVP */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor (texto plano)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe tu texto aquí..."
                  className="w-full h-60 border rounded p-2 text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagen</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed rounded p-4 text-center cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const f = e.dataTransfer.files?.[0]
                    if (f && f.type.startsWith("image/")) onFileChange(f)
                  }}
                >
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                  />
                  {imagePreview && (
                    <div className="mt-3 flex justify-center">
                      <img src={imagePreview} alt="preview" className="max-h-40 object-contain" />
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
                  <Label htmlFor="brand-color">Color de texto</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="brand-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bg-color">Color del fondo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={previewEditable}>Previsualizar</Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview editable */}
            <Card>
              <CardHeader>
                <CardTitle>Previsualización editable</CardTitle>
              </CardHeader>
              <CardContent>
                {pdfUrl ? (
                  <PdfInlineEditor pdfUrl={pdfUrl} />
                ) : (
                  <div className="text-sm text-muted-foreground">Genera una previsualización para editar.</div>
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

      {/* Export Dialog removido */}
    </div>
  )
}
