export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

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

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 in points
    const { width, height } = page.getSize()

    // Background
    const [rr, gg, bb] = hexToRgb(bgColor)
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(rr / 255, gg / 255, bb / 255) })

    // Colors and fonts
    const [tr, tg, tb] = hexToRgb(textColor)
    const color = rgb(tr / 255, tg / 255, tb / 255)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let cursorY = height - margin

    // Optional image (png or jpg)
    if (imgBuf) {
      try {
        let img
        if (isPng(imgBuf)) img = await pdfDoc.embedPng(imgBuf)
        else img = await pdfDoc.embedJpg(imgBuf)
        const maxW = width - margin * 2
        const scaled = img.scaleToFit(maxW, 280)
        const imgX = (width - scaled.width) / 2
        const imgY = cursorY - scaled.height
        page.drawImage(img, { x: imgX, y: imgY, width: scaled.width, height: scaled.height })
        cursorY = imgY - 16
      } catch {}
    }

    const [firstLine, ...rest] = (text || "(sin contenido)").split(/\r?\n/)
    // Title
    page.drawText(firstLine, {
      x: margin,
      y: cursorY - titleFontSize,
      size: titleFontSize,
      font,
      color,
    })
    cursorY -= titleFontSize + 10
    // Body
    const bodyText = rest.join("\n")
    drawMultilineText(page, bodyText, {
      x: margin,
      yTop: cursorY,
      maxWidth: width - margin * 2,
      lineHeight: bodyFontSize * (template === "compact" ? 1.2 : 1.35),
      size: bodyFontSize,
      font,
      color,
    })

    const bytes = await pdfDoc.save()

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "no-store",
      },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "PDF error", stack: e?.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || []
  return [parseInt(m[1] || "00", 16), parseInt(m[2] || "00", 16), parseInt(m[3] || "00", 16)]
}

function isPng(buf: Buffer): boolean {
  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
}

function drawMultilineText(
  page: any,
  text: string,
  opts: { x: number; yTop: number; maxWidth: number; lineHeight: number; size: number; font: any; color: any }
) {
  const { x, yTop, maxWidth, lineHeight, size, font, color } = opts
  const lines = text.split(/\r?\n/)
  let y = yTop
  for (const line of lines) {
    const wrapped = wrapLine(line, maxWidth, size, font)
    for (const w of wrapped) {
      y -= lineHeight
      page.drawText(w, { x, y, size, font, color })
    }
  }
}

function wrapLine(line: string, maxWidth: number, fontSize: number, font: any): string[] {
  const words = line.split(/\s+/)
  const out: string[] = []
  let cur = ""
  for (const w of words) {
    const test = cur ? cur + " " + w : w
    const width = font.widthOfTextAtSize(test, fontSize)
    if (width > maxWidth && cur) {
      out.push(cur)
      cur = w
    } else {
      cur = test
    }
  }
  if (cur) out.push(cur)
  return out
}


