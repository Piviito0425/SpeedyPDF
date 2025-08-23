import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Términos de Servicio</h1>
          <p className="text-muted-foreground">Última actualización: 15 de enero de 2024</p>

          <h2 id="aceptacion">Aceptación de términos</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Al acceder y utilizar DocLite, aceptas estar sujeto
            a estos términos de servicio y todas las leyes y regulaciones aplicables.
          </p>

          <h2 id="descripcion-servicio">Descripción del servicio</h2>
          <p>
            DocLite es una plataforma que permite convertir documentos Markdown en archivos PDF profesionales. El
            servicio incluye plantillas, control de versiones y un sistema de tokens para el uso.
          </p>

          <h2 id="cuentas-usuario">Cuentas de usuario</h2>
          <p>
            Para utilizar ciertas funciones del servicio, debes crear una cuenta. Eres responsable de mantener la
            confidencialidad de tu cuenta y contraseña, y de todas las actividades que ocurran bajo tu cuenta.
          </p>

          <h2 id="uso-aceptable">Uso aceptable</h2>
          <p>
            Te comprometes a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos. No
            puedes usar el servicio para:
          </p>
          <ul>
            <li>Actividades ilegales o no autorizadas</li>
            <li>Violar derechos de propiedad intelectual</li>
            <li>Distribuir malware o contenido dañino</li>
            <li>Interferir con el funcionamiento del servicio</li>
          </ul>

          <h2 id="tokens-facturacion">Tokens y facturación</h2>
          <p>
            El servicio utiliza un sistema de tokens para medir el uso. Los planes gratuitos incluyen una cantidad
            limitada de tokens mensuales. Los planes de pago ofrecen tokens adicionales según el plan seleccionado.
          </p>

          <h2 id="propiedad-intelectual">Propiedad intelectual</h2>
          <p>
            Mantienes todos los derechos sobre el contenido que creas y subes a DocLite. Nos otorgas una licencia
            limitada para procesar tu contenido y generar los PDFs solicitados.
          </p>

          <h2 id="limitacion-responsabilidad">Limitación de responsabilidad</h2>
          <p>
            En ningún caso DocLite será responsable de daños indirectos, incidentales, especiales o consecuentes que
            resulten del uso o la imposibilidad de usar el servicio.
          </p>

          <h2 id="modificaciones">Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en
            vigor inmediatamente después de su publicación en el sitio web.
          </p>

          <h2 id="contacto">Contacto</h2>
          <p>Si tienes preguntas sobre estos términos de servicio, puedes contactarnos en:</p>
          <ul>
            <li>Email: legal@doclite.com</li>
            <li>Dirección: Calle Ejemplo 123, Madrid, España</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
