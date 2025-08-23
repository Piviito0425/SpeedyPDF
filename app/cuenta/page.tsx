import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TokenUsage } from "@/components/token-usage"
import { ArrowLeft, CreditCard, User, Zap } from "lucide-react"
import Link from "next/link"

// Mock data
const usageHistory = [
  { date: "2024-01-15", tokens: 150, action: "Exportación PDF - Manual de usuario" },
  { date: "2024-01-14", tokens: 89, action: "Exportación PDF - Propuesta comercial" },
  { date: "2024-01-13", tokens: 45, action: "Vista previa - Documento técnico" },
  { date: "2024-01-12", tokens: 120, action: "Exportación PDF - Informe mensual" },
  { date: "2024-01-11", tokens: 67, action: "Exportación PDF - Guía de instalación" },
]

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Mi cuenta</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Plan actual</span>
              </CardTitle>
              <CardDescription>Gestiona tu suscripción y uso de tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Plan Gratuito</h3>
                  <p className="text-muted-foreground">2.000 tokens mensuales</p>
                </div>
                <Badge variant="secondary">Activo</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uso mensual</span>
                  <span>1.250 / 2.000 tokens</span>
                </div>
                <Progress value={62.5} className="h-2" />
                <p className="text-xs text-muted-foreground">Has usado el 62.5% de tus tokens este mes</p>
              </div>

              <div className="flex space-x-3">
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Mejorar a Pro
                </Button>
                <Button variant="outline">Ver todos los planes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Token Usage Details */}
          <Card>
            <CardHeader>
              <CardTitle>Uso detallado de tokens</CardTitle>
              <CardDescription>Historial de consumo de los últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <TokenUsage used={1250} total={2000} plan="free" />
            </CardContent>
          </Card>

          {/* Usage History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de actividad</CardTitle>
              <CardDescription>Registro de tus últimas acciones que consumieron tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{new Date(entry.date).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{entry.tokens}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
              <CardDescription>Detalles de tu cuenta y configuración</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">usuario@ejemplo.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Miembro desde</label>
                  <p className="text-muted-foreground">Enero 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Proyectos creados</label>
                  <p className="text-muted-foreground">2 proyectos</p>
                </div>
                <div>
                  <label className="text-sm font-medium">PDFs generados</label>
                  <p className="text-muted-foreground">8 documentos</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline">Editar perfil</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
