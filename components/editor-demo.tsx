"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Image as ImageIcon,
  Link,
  Table,
  Code,
  Search,
  Grid3X3,
  Undo,
  Redo,
  Palette,
  Eye,
  Download
} from "lucide-react"

export default function EditorDemo() {
  const [content, setContent] = useState("")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontSize, setFontSize] = useState("16")
  const [textColor, setTextColor] = useState("#000000")
  const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">("left")
  const [wordCount, setWordCount] = useState(0)

  const fonts = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Georgia", label: "Georgia" }
  ]

  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "56", "64", "72"]

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateWordCount()
  }

  const updateWordCount = () => {
    const editor = document.getElementById("rich-editor")
    if (editor) {
      const text = editor.innerText || ""
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    }
  }

  const handleInput = () => {
    const editor = document.getElementById("rich-editor") as HTMLDivElement
    if (editor) {
      setContent(editor.innerHTML)
      updateWordCount()
    }
  }

  const insertTable = () => {
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 1</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 3</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 4</td>
        </tr>
      </table>
    `
    execCommand("insertHTML", tableHTML)
  }

  const insertLink = () => {
    const url = prompt("Introduce la URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Editor de Documentos Avanzado</h1>
        <p className="text-gray-600">Editor WYSIWYG completo con todas las funcionalidades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Editor</span>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  7 páginas
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Toolbar */}
              <div className="border-b pb-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Undo/Redo */}
                  <Button variant="ghost" size="sm" onClick={() => execCommand("undo")}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("redo")}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Text Formatting */}
                  <Button variant="ghost" size="sm" onClick={() => execCommand("bold")}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("italic")}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("underline")}>
                    <Underline className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Font Family */}
                  <Select value={fontFamily} onValueChange={(value) => {
                    setFontFamily(value)
                    execCommand("fontName", value)
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Font Size */}
                  <Select value={fontSize} onValueChange={(value) => {
                    setFontSize(value)
                    execCommand("fontSize", value)
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Text Alignment */}
                  <Button 
                    variant={alignment === "left" ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => {
                      setAlignment("left")
                      execCommand("justifyLeft")
                    }}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "center" ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => {
                      setAlignment("center")
                      execCommand("justifyCenter")
                    }}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "right" ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => {
                      setAlignment("right")
                      execCommand("justifyRight")
                    }}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={alignment === "justify" ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => {
                      setAlignment("justify")
                      execCommand("justifyFull")
                    }}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Lists */}
                  <Button variant="ghost" size="sm" onClick={() => execCommand("insertUnorderedList")}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("insertOrderedList")}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Indent */}
                  <Button variant="ghost" size="sm" onClick={() => execCommand("indent")}>
                    <Indent className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("outdent")}>
                    <Outdent className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Insert Elements */}
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={insertLink}>
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={insertTable}>
                    <Table className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => execCommand("insertHTML", "<code>código aquí</code>")}>
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  
                  {/* Text Color */}
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => {
                        setTextColor(e.target.value)
                        execCommand("foreColor", e.target.value)
                      }}
                      className="w-8 h-8 p-0 border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div
                id="rich-editor"
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                className="min-h-[400px] p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset border rounded-lg"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  color: textColor
                }}
                suppressContentEditableWarning
              />

              {/* Word Count */}
              <div className="text-right text-sm text-gray-500 mt-4">
                {wordCount} PALABRAS
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Plantilla</Label>
                <Select defaultValue="classic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Clásica</SelectItem>
                    <SelectItem value="compact">Compacta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color del texto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <Label>Color de fondo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    defaultValue="#FFFFFF"
                    className="w-12 h-10"
                  />
                  <Input
                    defaultValue="#FFFFFF"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Previsualizar
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Previsualización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Genera una previsualización para ver el PDF</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
