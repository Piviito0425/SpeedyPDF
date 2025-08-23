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
          <p className="text-muted-foreground">Última actualización: 15 de enero de 2024</p>

          <h2 id="informacion-recopilada">Información que recopilamos</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>

          <h2 id="uso-informacion">Cómo usamos tu información</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>

          <h2 id="compartir-informacion">Compartir información</h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <h2 id="seguridad">Seguridad de los datos</h2>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet.
          </p>

          <h2 id="cookies">Cookies y tecnologías similares</h2>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
          </p>

          <h2 id="derechos">Tus derechos</h2>
          <p>
            Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
            rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.
          </p>

          <h2 id="contacto">Contacto</h2>
          <p>Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:</p>
          <ul>
            <li>Email: privacidad@doclite.com</li>
            <li>Dirección: Calle Ejemplo 123, Madrid, España</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
