export default function AvisoLegalPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Aviso Legal</h1>
      <p className="text-muted-foreground mb-4">
        Este sitio web es titularidad de <strong>[Nombre del responsable]</strong> con NIF/CIF
        <strong> [NIF/CIF]</strong> y domicilio en <strong>[Dirección completa]</strong>.
      </p>
      <p className="text-muted-foreground mb-4">
        Contacto: <strong>[correo@ejemplo.com]</strong> • Tel: <strong>[+34 000 000 000]</strong>
      </p>
      <p className="text-muted-foreground">
        Los contenidos del presente sitio web tienen carácter informativo. Si necesitas que
        personalice estos datos con la información real de tu proyecto, indícame: nombre o razón
        social, NIF/CIF, domicilio, email y teléfono de contacto.
      </p>
    </main>
  )
}


