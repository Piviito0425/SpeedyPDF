"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

  const handleConfirm = () => {
    onSelectType(localSelectedType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none overflow-y-auto p-8">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-3xl">
            <Sparkles className="h-8 w-8" />
            Selecciona el tipo de resumen
          </DialogTitle>
          <DialogDescription className="text-lg leading-relaxed">
            Elige el formato que mejor se adapte a tu documento para obtener un resumen más preciso y estructurado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 py-8">
          {summaryTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md min-h-[320px] ${
                localSelectedType === type.id 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-muted/50"
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
                      <CardTitle className="text-2xl flex items-center gap-4">
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
                <CardDescription className="text-lg leading-relaxed mt-5">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-base text-muted-foreground">
                  <strong>Ejemplos:</strong>
                  <ul className="mt-5 space-y-4">
                    {type.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        <span className="leading-relaxed break-words">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <Sparkles className="h-4 w-4 mr-2" />
            Resumir con {summaryTypes.find(t => t.id === localSelectedType)?.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
