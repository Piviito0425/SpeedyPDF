import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Eye, RotateCcw, Copy, GitBranch } from "lucide-react"
import Link from "next/link"

// Mock data
const versions = [
  {
    version: "1.3",
    date: "2024-01-15",
    notes: "Actualización de la sección de características",
    estimatedSize: "2.1 MB",
    isCurrent: true,
  },
  {
    version: "1.2",
    date: "2024-01-14",
    notes: "Corrección de errores tipográficos",
    estimatedSize: "2.0 MB",
    isCurrent: false,
  },
  {
    version: "1.1",
    date: "2024-01-13",
    notes: "Añadida nueva sección de instalación",
    estimatedSize: "1.9 MB",
    isCurrent: false,
  },
  {
    version: "1.0",
    date: "2024-01-12",
    notes: "Versión inicial del manual",
    estimatedSize: "1.8 MB",
    isCurrent: false,
  },
]

const mockDiff = {
  from: "1.2",
  to: "1.3",
  changes: [
    { type: "added", line: 15, content: "+ Nueva característica de exportación avanzada" },
    { type: "removed", line: 23, content: "- Funcionalidad obsoleta eliminada" },
    { type: "modified", line: 45, content: "~ Actualización de la descripción del producto" },
  ],
}

function DiffModal({ fromVersion, toVersion }: { fromVersion: string; toVersion: string }) {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Comparar versiones</DialogTitle>
        <DialogDescription>
          Diferencias entre versión {fromVersion} y {toVersion}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Badge variant="outline">Versión {fromVersion}</Badge>
          </div>
          <div>
            <Badge variant="default">Versión {toVersion}</Badge>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="bg-muted p-3 border-b">
            <h4 className="font-medium">Cambios detectados</h4>
          </div>
          <div className="p-4 space-y-2 font-mono text-sm">
            {mockDiff.changes.map((change, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  change.type === "added"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                    : change.type === "removed"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                      : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                }`}
              >
                <span className="text-muted-foreground mr-2">Línea {change.line}:</span>
                {change.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default function VersionsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/app/proyecto/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al editor
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Control de versiones</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Historial de versiones</CardTitle>
            <p className="text-muted-foreground">Gestiona y compara las diferentes versiones de tu proyecto</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Versión</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Tamaño estimado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version, index) => (
                  <TableRow key={version.version}>
                    <TableCell className="font-medium">v{version.version}</TableCell>
                    <TableCell>{new Date(version.date).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="max-w-xs truncate">{version.notes}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{version.estimatedSize}</Badge>
                    </TableCell>
                    <TableCell>
                      {version.isCurrent ? <Badge>Actual</Badge> : <Badge variant="secondary">Histórica</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {index < versions.length - 1 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Diff
                              </Button>
                            </DialogTrigger>
                            <DiffModal fromVersion={versions[index + 1].version} toVersion={version.version} />
                          </Dialog>
                        )}

                        {!version.isCurrent && (
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restaurar
                          </Button>
                        )}

                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
