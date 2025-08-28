"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContentFullscreen,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  Newspaper, 
  FileText, 
  Settings, 
  MessageSquare, 
  File,
  Sparkles 
} from "lucide-react"

export type SummaryType = 
  | "auto" 
  | "meeting" 
  | "narrative" 
  | "article" 
  | "technical" 
  | "legal" 
  | "email" 
  | "generic"

interface SummaryTypeOption {
  id: SummaryType
  title: string
  description: string
  icon: React.ReactNode
  examples: string[]
  badge?: string
}

const summaryTypes: SummaryTypeOption[] = [
  {
    id: "auto",
    title: "Detección automática",
    description: "Deja que la IA detecte automáticamente el tipo de documento y aplique el mejor formato",
    icon: <Sparkles className="h-5 w-5" />,
    examples: ["Cualquier tipo de documento"],
    badge: "Recomendado"
  },
  {
    id: "meeting",
    title: "Reunión / Minutos",
    description: "Para transcripciones de reuniones, conversaciones y minutas",
    icon: <Users className="h-5 w-5" />,
    examples: ["Transcripciones de reuniones", "Minutas de juntas", "Conversaciones entre personas"]
  },
  {
    id: "narrative",
    title: "Narrativa / Historia",
    description: "Para cuentos, historias, relatos y narrativas",
    icon: <BookOpen className="h-5 w-5" />,
    examples: ["Cuentos e historias", "Relatos", "Descripciones de personajes", "Eventos narrativos"]
  },
  {
    id: "article",
    title: "Artículo / Noticia",
    description: "Para noticias, artículos informativos y reportes de actualidad",
    icon: <Newspaper className="h-5 w-5" />,
    examples: ["Noticias", "Artículos informativos", "Reportes de actualidad", "Análisis técnico"]
  },
  {
    id: "technical",
    title: "Documento técnico",
    description: "Para manuales, especificaciones y documentación técnica",
    icon: <Settings className="h-5 w-5" />,
    examples: ["Manuales", "Especificaciones", "Documentación técnica", "Guías de usuario"]
  },
  {
    id: "legal",
    title: "Legal / Política",
    description: "Para documentos legales, políticas y términos",
    icon: <FileText className="h-5 w-5" />,
    examples: ["Documentos legales", "Políticas", "Términos y condiciones", "Contratos"]
  },
  {
    id: "email",
    title: "Hilo de emails",
    description: "Para conversaciones por email y hilos de correo",
    icon: <MessageSquare className="h-5 w-5" />,
    examples: ["Conversaciones por email", "Hilos de correo", "Discusiones por email"]
  },
  {
    id: "generic",
    title: "Genérico",
    description: "Para cualquier otro tipo de texto que no se ajuste a las categorías anteriores",
    icon: <File className="h-5 w-5" />,
    examples: ["Documentos generales", "Textos diversos", "Contenido mixto"]
  }
]

interface SummaryTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectType: (type: SummaryType) => void
  selectedType?: SummaryType
}

export function SummaryTypeDialog({ 
  open, 
  onOpenChange, 
  onSelectType, 
  selectedType = "auto" 
}: SummaryTypeDialogProps) {
  const [localSelectedType, setLocalSelectedType] = useState<SummaryType>(selectedType)

  // Bloquear scroll del documento mientras el modal esté abierto
  useEffect(() => {
    const el = document.documentElement;
    if (open) el.classList.add("overflow-hidden");
    else el.classList.remove("overflow-hidden");
    return () => el.classList.remove("overflow-hidden");
  }, [open]);

  const handleConfirm = () => {
    onSelectType(localSelectedType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentFullscreen>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur px-6 py-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold">
            <Sparkles className="h-6 w-6" />
            Selecciona el tipo de resumen
          </DialogTitle>
          <DialogClose className="rounded-lg p-2 hover:bg-white/10 text-white" aria-label="Cerrar">✕</DialogClose>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-lg leading-relaxed text-gray-300">
              Elige el formato que mejor se adapte a tu documento para obtener un resumen más preciso y estructurado
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {summaryTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md min-h-[320px] bg-[#1a1a1a] border-[#333] ${
                  localSelectedType === type.id 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-[#2a2a2a]"
                }`}
                onClick={() => setLocalSelectedType(type.id)}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-5 rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                        {type.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-2xl flex items-center gap-4 text-white">
                          <span className="break-words leading-tight">{type.title}</span>
                          {type.badge && (
                            <Badge variant="secondary" className="text-base flex-shrink-0">
                              {type.badge}
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-lg leading-relaxed mt-5 text-gray-300">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-base text-gray-400">
                    <strong className="text-white">Ejemplos:</strong>
                    <ul className="mt-5 space-y-4">
                      {type.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <span className="w-2.5 h-2.5 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="leading-relaxed break-words">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#2a2a2a]">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Resumir con {summaryTypes.find(t => t.id === localSelectedType)?.title}
            </Button>
          </div>
        </main>
      </DialogContentFullscreen>
    </Dialog>
  )
}
