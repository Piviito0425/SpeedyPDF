export const runtime = "nodejs"

import PDFDocument from "pdfkit"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const text = String(form.get("text") ?? "")
    const template = String(form.get("template") ?? "classic")
    const textColor = String(form.get("textColor") ?? "#000000")
    const bgColor = String(form.get("bgColor") ?? "#FFFFFF")
    const file = form.get("image") as File | null
    const imgBuf = file ? Buffer.from(await file.arrayBuffer()) : null

    const margin = template === "compact" ? 30 : 50
    const titleFontSize = template === "compact" ? 16 : 20
    const bodyFontSize = template === "compact" ? 12 : 13

    const doc = new PDFDocument({ size: "A4", margin })

    const chunks: Buffer[] = []
    doc.on("data", (c) => chunks.push(c as Buffer))
    const done = new Promise<void>((r) => doc.on("end", () => r()))

    const [r, g, b] = hexToRgb(bgColor)
    doc.rect(0, 0, doc.page.width, doc.page.height).fill([r / 255, g / 255, b / 255])

    // Reset fill color for text and drawings after background
    doc.fillColor(textColor)

    // Optional image
    if (imgBuf) {
      const maxW = doc.page.width - margin * 2
      doc.image(imgBuf, { fit: [maxW, 280], align: "center" }).moveDown()
    }

    // Title (first line of the text if any)
    const [firstLine, ...rest] = (text || "(sin contenido)").split(/\r?\n/)
    doc.fontSize(titleFontSize).text(firstLine, { align: "left" }).moveDown(0.5)
    doc.fontSize(bodyFontSize).text(rest.join("\n"), { align: "left" })

    doc.end()
    await done

    return new Response(Buffer.concat(chunks), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "no-store",
      },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "PDF error" }), { status: 500 })
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || []
  return [parseInt(m[1] || "00", 16), parseInt(m[2] || "00", 16), parseInt(m[3] || "00", 16)]
}


