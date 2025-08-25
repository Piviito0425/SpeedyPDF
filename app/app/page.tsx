import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TokenUsage } from "@/components/token-usage"
import { FileText, Plus, Eye, History, Download, User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data
const projects = [
  {
    id: "1",
    name: "Manual de usuario",
    lastVersion: "1.3",
    updatedAt: "2024-01-15",
    status: "published",
  },
  {
    id: "2",
    name: "Propuesta comercial Q1",
    lastVersion: "2.1",
    updatedAt: "2024-01-14",
    status: "draft",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-semibold">SpeedyPDF</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Token Usage */}
            <div className="hidden md:block w-64">
              <TokenUsage used={1250} total={2000} plan="free" />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">usuario@ejemplo.com</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/cuenta">
                    <Settings className="h-4 w-4 mr-2" />
                    Mi cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Mobile Token Usage */}
        <div className="md:hidden mb-6">
          <TokenUsage used={1250} total={2000} plan="free" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Proyectos</h1>
            <p className="text-muted-foreground">Gestiona tus proyectos y exportaciones PDF</p>
          </div>
          <Button asChild>
            <Link href="/app/proyecto/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo proyecto
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        Versión {project.lastVersion} • {project.updatedAt}
                      </CardDescription>
                    </div>
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>
                      {project.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button size="sm" asChild>
                      <Link href={`/app/proyecto/${project.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Abrir
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/app/proyecto/${project.id}/versiones`}>
                        <History className="h-4 w-4 mr-1" />
                        Versiones
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes proyectos aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer proyecto para empezar a generar PDFs desde Markdown
            </p>
            <Button asChild>
              <Link href="/app/proyecto/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer proyecto
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
