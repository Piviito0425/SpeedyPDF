import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Edit, Download, Check } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-semibold">SpeedyPDF</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground">
              Cómo funciona
            </Link>
            <Link href="#planes" className="text-muted-foreground hover:text-foreground">
              Planes
            </Link>
            <Button variant="outline" asChild>
              <Link href="/app">Iniciar sesión</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Crea PDFs claros desde Markdown + imágenes</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Convierte tu contenido Markdown en documentos PDF profesionales con plantillas simples, control de versiones
            y un generoso plan gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/app">Probar gratis</Link>
            </Button>
            <Button size="lg" variant="outline">
              Ver demo
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Plantillas simples</h3>
              <p className="text-muted-foreground">Sin complicaciones de IA. Plantillas claras y profesionales.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Control de versiones</h3>
              <p className="text-muted-foreground">Guarda, compara y restaura versiones de tus documentos.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Más tokens gratis</h3>
              <p className="text-muted-foreground">2.000 tokens mensuales gratuitos para empezar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Subir</h3>
              <p className="text-muted-foreground">Sube tu contenido Markdown e imágenes de forma sencilla.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Editar</h3>
              <p className="text-muted-foreground">Edita con vista previa en tiempo real y elige tu plantilla.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Exportar</h3>
              <p className="text-muted-foreground">Genera tu PDF profesional listo para compartir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Planes simples y transparentes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gratis</CardTitle>
                <CardDescription>Perfecto para empezar</CardDescription>
                <div className="text-3xl font-bold">
                  €0<span className="text-sm font-normal">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />3 tokens/diarios
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Plantillas básicas
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Control de versiones
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Exportación PDF
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Más popular</Badge>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Para uso profesional</CardDescription>
                <div className="text-3xl font-bold">
                  €9<span className="text-sm font-normal">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    50 tokens/mensuales
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Todas las plantillas
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Marca personalizada
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Control de versiones
                  </li>
                </ul>
                <Button className="w-full">Elegir Pro</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>Para equipos grandes</CardDescription>
                <div className="text-3xl font-bold">
                  €29<span className="text-sm font-normal">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Tokens ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Todas las plantillas
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Marca personalizada
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Soporte prioritario
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Contactar ventas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">SpeedyPDF</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Convierte Markdown en PDFs profesionales de forma sencilla.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Plantillas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Estado
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/legal/privacidad" className="hover:text-foreground">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terminos" className="hover:text-foreground">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 SpeedyPDF. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
