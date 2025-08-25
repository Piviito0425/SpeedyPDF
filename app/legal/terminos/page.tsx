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
          <p>
            El presente documento regula las condiciones de uso de este sitio web y aplicación (“el Servicio”). Al acceder o utilizar el Servicio aceptas estos Términos.
          </p>

          <h2>1. Titular del servicio</h2>
          <p>
            El Servicio es ofrecido por <strong>[Tu nombre completo]</strong>, con correo de contacto <strong>[tu correo]</strong>.
          </p>

          <h2>2. Objeto del servicio</h2>
          <p>
            El Servicio permite a los usuarios registrarse y generar documentos PDF a partir de contenidos (texto e imágenes) con un sistema de control de versiones y tokens de uso.
          </p>
          <p>Este proyecto se ofrece de forma experimental y en constante evolución.</p>

          <h2>3. Registro y cuentas de usuario</h2>
          <ul>
            <li>Para acceder a ciertas funciones es necesario registrarse con un correo electrónico y contraseña.</li>
            <li>El usuario es responsable de mantener la confidencialidad de sus credenciales.</li>
            <li>El usuario se compromete a facilitar información veraz y a no crear cuentas con fines fraudulentos.</li>
          </ul>

          <h2>4. Planes y tokens</h2>
          <ul>
            <li>El Servicio puede ofrecer un plan gratuito limitado por número de tokens al mes, y planes de pago con mayores recursos.</li>
            <li>Los tokens no usados en un periodo no se acumulan.</li>
            <li>Los pagos se gestionan a través de Stripe.</li>
          </ul>

          <h2>5. Contenido de los usuarios</h2>
          <ul>
            <li>El usuario conserva todos los derechos sobre el contenido que suba o genere.</li>
            <li>Al subir contenido, el usuario concede una licencia limitada para procesarlo técnicamente con el fin de prestar el Servicio.</li>
            <li>El usuario se compromete a no subir contenidos ilegales, ofensivos o que vulneren derechos de terceros.</li>
          </ul>

          <h2>6. Limitaciones de uso</h2>
          <p>Está prohibido:</p>
          <ul>
            <li>Utilizar el Servicio para actividades ilícitas.</li>
            <li>Intentar acceder a partes del sistema sin autorización.</li>
            <li>Usar el plan gratuito de manera abusiva (por ejemplo, mediante creación masiva de cuentas).</li>
          </ul>

          <h2>7. Propiedad intelectual</h2>
          <p>
            El software, marca, interfaz y demás elementos del Servicio son propiedad de <strong>[Tu nombre o marca]</strong>, salvo el contenido aportado por los usuarios.
          </p>

          <h2>8. Responsabilidad</h2>
          <ul>
            <li>El Servicio se ofrece “tal cual” y no se garantiza su disponibilidad continua.</li>
            <li>El titular no se hace responsable de pérdidas de datos, interrupciones o daños indirectos derivados del uso del Servicio.</li>
            <li>El uso del Servicio es bajo responsabilidad exclusiva del usuario.</li>
          </ul>

          <h2>9. Cancelación y suspensión</h2>
          <ul>
            <li>El usuario puede cancelar su cuenta en cualquier momento.</li>
            <li>El titular podrá suspender o cancelar cuentas que incumplan estos Términos o se usen de forma fraudulenta.</li>
          </ul>

          <h2>10. Ley aplicable y jurisdicción</h2>
          <p>
            Estos Términos se rigen por la legislación española. Para cualquier controversia derivada del uso del Servicio, las partes se someten a los Juzgados y Tribunales de <strong>[tu ciudad o provincia]</strong>.
          </p>

          <h2>11. Modificaciones</h2>
          <p>
            Podemos actualizar estos Términos para adaptarlos a mejoras del Servicio o cambios legales. Se notificará a los usuarios en caso de cambios significativos.
          </p>
        </div>
      </main>
    </div>
  )
}
