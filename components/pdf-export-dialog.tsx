"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PdfExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
}

export function PdfExportDialog({ open, onOpenChange, projectName }: PdfExportDialogProps) {
  const [pageSize, setPageSize] = useState("A4")
  const [margins, setMargins] = useState("normal")
  const [includePageNumbers, setIncludePageNumbers] = useState(true)
  const [includeCover, setIncludeCover] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export process
    const steps = [
      { message: "Procesando Markdown...", progress: 25 },
      { message: "Aplicando plantilla...", progress: 50 },
      { message: "Generando PDF...", progress: 75 },
      { message: "Finalizando...", progress: 100 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setExportProgress(step.progress)
    }

    // TODO backend: Generate actual PDF
    setDownloadUrl(`/api/download/pdf/${projectName.toLowerCase().replace(/\s+/g, "-")}.pdf`)
    setIsExporting(false)

    toast({
      title: "PDF generado",
      description: "Tu documento está listo para descargar.",
    })
  }

  const handleDownload = () => {
    // TODO backend: Trigger actual download
    toast({
      title: "Descarga iniciada",
      description: "El archivo se está descargando...",
    })
    onOpenChange(false)
    setDownloadUrl(null)
    setExportProgress(0)
  }

  const resetDialog = () => {
    setIsExporting(false)
    setExportProgress(0)
    setDownloadUrl(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetDialog()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Exportar PDF</span>
          </DialogTitle>
          <DialogDescription>Configura las opciones de exportación para "{projectName}"</DialogDescription>
        </DialogHeader>

        {!isExporting && !downloadUrl && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="page-size">Tamaño de página</Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger id="page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Carta</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="margins">Márgenes</Label>
              <Select value={margins} onValueChange={setMargins}>
                <SelectTrigger id="margins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Estrechos</SelectItem>
                  <SelectItem value="normal">Normales</SelectItem>
                  <SelectItem value="wide">Amplios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="page-numbers" checked={includePageNumbers} onCheckedChange={setIncludePageNumbers} />
                <Label htmlFor="page-numbers">Incluir numeración de páginas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="cover-page" checked={includeCover} onCheckedChange={setIncludeCover} />
                <Label htmlFor="cover-page">Incluir página de portada</Label>
              </div>
            </div>
          </div>
        )}

        {isExporting && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Generando PDF...</p>
              <Progress value={exportProgress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">{exportProgress}% completado</p>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">¡PDF listo!</h3>
              <p className="text-sm text-muted-foreground">Tu documento ha sido generado exitosamente.</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isExporting && !downloadUrl && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Generar PDF
              </Button>
            </>
          )}

          {downloadUrl && (
            <Button onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
