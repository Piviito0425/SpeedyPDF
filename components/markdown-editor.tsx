"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, LinkIcon, Heading2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder = "Escribe tu Markdown aquí..." }: MarkdownEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertText = (before: string, after = "") => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textareaRef.focus()
      textareaRef.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          insertText("**", "**")
          break
        case "i":
          e.preventDefault()
          insertText("*", "*")
          break
        case "2":
          e.preventDefault()
          insertText("## ")
          break
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <TooltipProvider>
        <div className="flex items-center space-x-1 p-2 border rounded-md bg-muted/50">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" aria-label="Encabezados">
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Encabezados</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => insertText("# ")}>H1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText("## ")}>H2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText("### ")}>H3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={() => insertText("**", "**")} aria-label="Negrita">
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Negrita (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={() => insertText("*", "*")} aria-label="Cursiva">
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cursiva (Ctrl+I)</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" aria-label="Listas">
                    <List className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Listas</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => insertText("- ")}>Viñetas ( - )</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText("* ")}>Viñetas ( * )</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertText("1. ")}>Numerada ( 1. )</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={() => insertText("[texto](", ")")} aria-label="Enlace">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enlace</TooltipContent>
          </Tooltip>

          
        </div>
      </TooltipProvider>

      {/* Editor */}
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[400px] font-mono text-sm resize-none"
        aria-label="Editor de Markdown"
      />
    </div>
  )
}
