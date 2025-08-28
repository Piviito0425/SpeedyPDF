"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Type,
  Minus,
  Plus
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => void
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [internalContent, setInternalContent] = useState(content)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontSize, setFontSize] = useState("16")
  const [textColor, setTextColor] = useState("#000000")
  const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">("left")
  const [wordCount, setWordCount] = useState(0)

  const fonts = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" }
  ]

  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "56", "64", "72"]

  const colors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#808080", "#C0C0C0"
  ]

  useEffect(() => {
    if (content !== internalContent) {
      setInternalContent(content)
      if (editorRef.current) {
        const selection = window.getSelection()
        const range = selection?.getRangeAt(0)
        const wasEditorFocused = editorRef.current.contains(selection?.focusNode)
        
        editorRef.current.innerHTML = content
        updateWordCount()
        
        // Restaurar la posición del cursor si el editor estaba enfocado
        if (wasEditorFocused && selection && range) {
          try {
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (e) {
            // Si falla, simplemente enfocar el editor
            editorRef.current.focus()
          }
        }
      }
    }
  }, [content, internalContent])

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || ""
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateWordCount()
  }

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      if (newContent !== internalContent) {
        setInternalContent(newContent)
        onChange(newContent)
      }
      updateWordCount()
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageUpload) {
      onImageUpload(file)
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
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
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
            <Button 
              variant={isBold ? "default" : "ghost"} 
              size="sm" 
              onClick={() => {
                execCommand("bold")
                setIsBold(!isBold)
              }}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant={isItalic ? "default" : "ghost"} 
              size="sm" 
              onClick={() => {
                execCommand("italic")
                setIsItalic(!isItalic)
              }}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant={isUnderline ? "default" : "ghost"} 
              size="sm" 
              onClick={() => {
                execCommand("underline")
                setIsUnderline(!isUnderline)
              }}
            >
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
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("image-upload")?.click()}>
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
        </CardContent>
      </Card>

      {/* Hidden file input for image upload */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor */}
      <Card>
        <CardContent className="p-0">
                        <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                className="min-h-[400px] p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  color: textColor,
                  backgroundColor: "#FFFFFF"
                }}
                suppressContentEditableWarning
              />
        </CardContent>
      </Card>

      {/* Word Count */}
      <div className="text-right text-sm text-gray-500">
        {wordCount} PALABRAS
      </div>
    </div>
  )
}
