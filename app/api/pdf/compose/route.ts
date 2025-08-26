export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { Buffer } from "buffer"

export async function POST(req: Request) {
  try {
    console.log("PDF compose endpoint called")
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
    const page = pdfDoc.addPage()

    const { width, height } = page.getSize()

    // Background
    const [br, bg, bb] = hexToRgb(bgColor)
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(br / 255, bg / 255, bb / 255),
    })

    const [tr, tg, tb] = hexToRgb(textColor)
    const color = rgb(tr / 255, tg / 255, tb / 255)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    let cursorY = height - margin

    // Image
    if (imgBuf) {
      let image
      if (file?.type === "image/jpeg") {
        image = await pdfDoc.embedJpg(imgBuf)
      } else if (file?.type === "image/png") {
        image = await pdfDoc.embedPng(imgBuf)
      }

      if (image) {
        const imgDims = image.scaleToFit(width - margin * 2, 280)
        page.drawImage(image, {
          x: width / 2 - imgDims.width / 2,
          y: cursorY - imgDims.height,
          width: imgDims.width,
          height: imgDims.height,
        })
        cursorY -= imgDims.height + 20
      }
    }

    // Parse HTML content
    const parsedContent = parseHTMLContent(text || "(sin contenido)")
    
    // Render content
    for (const element of parsedContent) {
      if (element.type === 'text') {
        const lines = wrapLine(element.content, width - margin * 2, element.fontSize || bodyFontSize, element.bold ? boldFont : font)
        for (const line of lines) {
          page.drawText(line, {
            x: margin + (element.align === 'center' ? (width - margin * 2 - font.widthOfTextAtSize(line, element.fontSize || bodyFontSize)) / 2 : 0),
            y: cursorY - (element.fontSize || bodyFontSize),
            font: element.bold ? boldFont : font,
            size: element.fontSize || bodyFontSize,
            color: element.color || color,
          })
          cursorY -= (element.fontSize || bodyFontSize) * 1.2
        }
      } else if (element.type === 'table') {
        cursorY = drawTable(page, element, margin, cursorY, font, color)
      }
    }

    const bytes = await pdfDoc.save()
    console.log("PDF generated, size:", bytes.length, "bytes")

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "no-store",
      },
    })
  } catch (e: any) {
    console.error("PDF compose error:", e)
    return new Response(JSON.stringify({ error: e?.message || "PDF error" }), { status: 500 })
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || []
  return [parseInt(m[1] || "00", 16), parseInt(m[2] || "00", 16), parseInt(m[3] || "00", 16)]
}

function wrapLine(line: string, maxWidth: number, fontSize: number, font: any): string[] {
  try {
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
  } catch (e) {
    // Fallback: split by characters if font encoding fails
    const chars = Math.floor(maxWidth / (fontSize * 0.6))
    const out: string[] = []
    for (let i = 0; i < line.length; i += chars) {
      out.push(line.slice(i, i + chars))
    }
    return out
  }
}

function parseHTMLContent(html: string): any[] {
  const elements: any[] = []
  
  // Simple regex-based HTML parser for basic elements
  const cleanText = html.replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
  
  // Extract tables first
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi
  let tableMatch
  let lastIndex = 0
  
  while ((tableMatch = tableRegex.exec(cleanText)) !== null) {
    // Add text before table
    const textBefore = cleanText.slice(lastIndex, tableMatch.index).trim()
    if (textBefore) {
      elements.push({
        type: 'text',
        content: textBefore,
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
    }
    
    // Add table
    const tableData = parseTableFromHTML(tableMatch[1])
    elements.push({
      type: 'table',
      data: tableData
    })
    
    lastIndex = tableMatch.index + tableMatch[0].length
  }
  
  // Add remaining text
  const remainingText = cleanText.slice(lastIndex).trim()
  if (remainingText) {
    elements.push({
      type: 'text',
      content: remainingText,
      fontSize: 13,
      bold: false,
      align: 'left',
      color: null
    })
  }
  
  // If no content was parsed, treat the whole thing as text
  if (elements.length === 0) {
    elements.push({
      type: 'text',
      content: cleanText || "(sin contenido)",
      fontSize: 13,
      bold: false,
      align: 'left',
      color: null
    })
  }
  
  return elements
}

function parseTableFromHTML(tableHTML: string): string[][] {
  const rows: string[][] = []
  
  // Extract rows
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let rowMatch
  
  while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
    const rowData: string[] = []
    
    // Extract cells from this row
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/(td|th)>/gi
    let cellMatch
    
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      // Clean cell content
      const cellContent = cellMatch[2]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp;
        .replace(/&amp;/g, '&') // Replace &amp;
        .replace(/&lt;/g, '<') // Replace &lt;
        .replace(/&gt;/g, '>') // Replace &gt;
        .trim()
      
      rowData.push(cellContent)
    }
    
    if (rowData.length > 0) {
      rows.push(rowData)
    }
  }
  
  return rows
}

function drawTable(page: any, tableElement: any, margin: number, startY: number, font: any, color: any): number {
  const { width } = page.getSize()
  const tableWidth = width - margin * 2
  const cellPadding = 8
  const cellHeight = 20
  const borderWidth = 1
  
  let currentY = startY
  
  for (let i = 0; i < tableElement.data.length; i++) {
    const row = tableElement.data[i]
    const maxCells = Math.max(...tableElement.data.map((r: string[]) => r.length))
    const cellWidth = tableWidth / maxCells
    
    for (let j = 0; j < row.length; j++) {
      const cellText = row[j]
      const cellX = margin + j * cellWidth
      const cellY = currentY - cellHeight
      
      // Draw cell border
      page.drawRectangle({
        x: cellX,
        y: cellY,
        width: cellWidth,
        height: cellHeight,
        borderWidth: borderWidth,
        borderColor: color,
      })
      
      // Draw cell text
      const textLines = wrapLine(cellText, cellWidth - cellPadding * 2, 10, font)
      for (let k = 0; k < textLines.length && k < 2; k++) {
        page.drawText(textLines[k], {
          x: cellX + cellPadding,
          y: cellY + cellHeight - 12 - k * 12,
          font,
          size: 10,
          color,
        })
      }
    }
    
    currentY -= cellHeight
  }
  
  return currentY - 10
}


