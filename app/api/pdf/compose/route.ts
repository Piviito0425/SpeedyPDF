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
        // Add extra space after headings
        if (element.bold && element.fontSize && element.fontSize > 15) {
          cursorY -= 10
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
  
  // Clean text and remove non-ASCII characters
  const cleanText = html.replace(/[^\x00-\x7F]/g, "")
  
  // First, try to parse as HTML
  const htmlElements = parseTextElements(cleanText)
  
  if (htmlElements.length > 0) {
    // HTML was found, use it
    return htmlElements
  }
  
  // If no HTML elements found, parse as structured text (like ChatGPT)
  return parseStructuredText(cleanText)
}

function parseStructuredText(text: string): any[] {
  const elements: any[] = []
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Detect "Moral:" line (should be at the end)
    if (line.startsWith('Moral:')) {
      // Add space before Moral
      if (elements.length > 0) {
        elements.push({
          type: 'text',
          content: '',
          fontSize: 13,
          bold: false,
          align: 'left',
          color: null
        })
      }
      
      elements.push({
        type: 'text',
        content: line,
        fontSize: 16,
        bold: true,
        align: 'left',
        color: null
      })
      continue
    }
    
    // Detect bullet points (• - * etc.)
    if (line.match(/^[•\-\*]\s/)) {
      elements.push({
        type: 'text',
        content: line,
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
      continue
    }
    
    // Detect numbered lists (1. 2. 3. etc.)
    if (line.match(/^\d+\.\s/)) {
      elements.push({
        type: 'text',
        content: line,
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
      continue
    }
    
    // Regular paragraph text
    elements.push({
      type: 'text',
      content: line,
      fontSize: 13,
      bold: false,
      align: 'left',
      color: null
    })
    
    // Add space after paragraphs (but not after lists)
    if (!line.match(/^\d+\.\s/) && !line.match(/^[•\-\*]\s/) && !line.startsWith('Moral:')) {
      elements.push({
        type: 'text',
        content: '',
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
    }
  }
  
  return elements
}

function parseTextElements(text: string): any[] {
  const elements: any[] = []
  
  // Parse headings
  const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi
  let headingMatch
  
  while ((headingMatch = headingRegex.exec(text)) !== null) {
    const level = parseInt(headingMatch[1].substring(1))
    const content = headingMatch[2].trim()
    
    elements.push({
      type: 'text',
      content: content,
      fontSize: level === 1 ? 24 : level === 2 ? 20 : 16,
      bold: true,
      align: 'left',
      color: null
    })
    
    // Add extra space after headings
    if (level === 2 || level === 3) {
      elements.push({
        type: 'text',
        content: '',
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
    }
  }
  
  // Parse paragraphs
  const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi
  let paragraphMatch
  
  while ((paragraphMatch = paragraphRegex.exec(text)) !== null) {
    const content = paragraphMatch[1].trim()
    
    elements.push({
      type: 'text',
      content: content,
      fontSize: 13,
      bold: false,
      align: 'left',
      color: null
    })
  }
  
  // Parse ordered lists
  const listRegex = /<ol[^>]*>(.*?)<\/ol>/gis
  let listMatch
  
  while ((listMatch = listRegex.exec(text)) !== null) {
    const listContent = listMatch[1]
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi
    let listItemMatch
    let itemNumber = 1
    
    while ((listItemMatch = listItemRegex.exec(listContent)) !== null) {
      const content = `${itemNumber}. ${listItemMatch[1].trim()}`
      
      elements.push({
        type: 'text',
        content: content,
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
      
      itemNumber++
    }
  }
  
  // Parse unordered lists
  const ulRegex = /<ul[^>]*>(.*?)<\/ul>/gis
  let ulMatch
  
  while ((ulMatch = ulRegex.exec(text)) !== null) {
    const listContent = ulMatch[1]
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi
    let listItemMatch
    
    while ((listItemMatch = listItemRegex.exec(listContent)) !== null) {
      const content = `• ${listItemMatch[1].trim()}`
      
      elements.push({
        type: 'text',
        content: content,
        fontSize: 13,
        bold: false,
        align: 'left',
        color: null
      })
    }
  }
  
  // Parse tables
  const tableRegex = /<table[^>]*>(.*?)<\/table>/gis
  let tableMatch
  
  while ((tableMatch = tableRegex.exec(text)) !== null) {
    const tableData = parseTableFromHTML(tableMatch[1])
    elements.push({
      type: 'table',
      data: tableData
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


