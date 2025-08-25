import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
          <h1>Política de Privacidad</h1>
          <p>
            La presente Política de Privacidad describe cómo se recogen, utilizan y protegen los datos personales de los
            usuarios de este sitio web y aplicación (“el Servicio”).
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos es:
          </p>
          <p>
            <strong>[Tu nombre completo]</strong><br />
            Correo electrónico de contacto: <strong>[tu correo]</strong>
          </p>
          <p>
            Este proyecto es un desarrollo personal en fase experimental, sin finalidad comercial profesional, pero sujeto a la normativa aplicable
            en materia de protección de datos.
          </p>

          <h2>2. Datos que se recogen</h2>
          <p>Dependiendo del uso que hagas del Servicio, podremos tratar las siguientes categorías de datos:</p>
          <ul>
            <li><strong>Datos de registro:</strong> correo electrónico y contraseña.</li>
            <li><strong>Contenido aportado por el usuario:</strong> texto, imágenes y documentos.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, navegador, sistema operativo, logs de uso.</li>
            <li><strong>Datos de facturación</strong> (solo si eliges un plan de pago): gestionados directamente por Stripe.</li>
          </ul>

          <h2>3. Finalidad del tratamiento</h2>
          <p>Los datos personales se utilizan para:</p>
          <ul>
            <li>Crear y gestionar tu cuenta de usuario.</li>
            <li>Permitir el funcionamiento del Servicio (subida de contenidos, generación de PDFs, control de tokens).</li>
            <li>Facturación y gestión de pagos en caso de planes de pago.</li>
            <li>Enviar comunicaciones estrictamente necesarias sobre el uso del Servicio.</li>
            <li>Mejorar la seguridad y estabilidad de la plataforma.</li>
          </ul>

          <h2>4. Base legal</h2>
          <p>Las bases legales que legitiman el tratamiento son:</p>
          <ul>
            <li>Ejecución de un contrato (prestación del Servicio al registrarte y usar la aplicación).</li>
            <li>Consentimiento expreso (en caso de aceptar cookies opcionales o marketing).</li>
            <li>Interés legítimo (garantizar la seguridad de la plataforma, prevenir fraudes).</li>
          </ul>

          <h2>5. Destinatarios y terceros proveedores</h2>
          <p>Para prestar el Servicio se utilizan proveedores que pueden tratar datos en nuestro nombre:</p>
          <ul>
            <li>Vercel Inc. (hosting de la aplicación).</li>
            <li>Supabase Inc. (gestión de base de datos y autenticación).</li>
            <li>Stripe Payments Europe Ltd. (gestión de pagos).</li>
          </ul>
          <p>
            Estos proveedores pueden realizar transferencias internacionales de datos, en cuyo caso se acogen a cláusulas
            contractuales tipo aprobadas por la Comisión Europea.
          </p>

          <h2>6. Conservación de los datos</h2>
          <ul>
            <li>Los datos de tu cuenta se conservan mientras mantengas el registro.</li>
            <li>Los logs técnicos se almacenan durante un máximo de 12 meses.</li>
            <li>Los datos de facturación se conservarán el tiempo exigido por la normativa fiscal aplicable.</li>
          </ul>

          <h2>7. Derechos de los usuarios</h2>
          <p>
            Puedes ejercitar en cualquier momento tus derechos de acceso, rectificación, supresión, portabilidad, limitación u oposición
            enviando un correo a <strong>[tu correo de contacto]</strong>.
          </p>
          <p>
            Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos
            (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
          </p>

          <h2>8. Seguridad</h2>
          <p>
            Se aplican medidas técnicas y organizativas razonables para proteger los datos personales, incluyendo cifrado TLS en las comunicaciones,
            almacenamiento seguro de contraseñas y copias de seguridad periódicas.
          </p>

          <h2>9. Cambios en esta política</h2>
          <p>
            Podremos actualizar esta Política de Privacidad para adaptarla a cambios normativos o del Servicio. Te avisaremos en caso de modificaciones relevantes.
          </p>
        </div>
      </main>
    </div>
  )
}
