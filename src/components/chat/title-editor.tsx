"use client"

import { useEffect, useRef } from "react"

import { Input } from "@/components/ui/input"

// 原地改名：Enter 保存，Esc 取消，点到别处也保存；空标题或没改动就取消。
// 从下拉菜单进入时，菜单还在关闭动画里并持有焦点，所以等它关完再聚焦；聚焦前的失焦不算。
export function TitleEditor({ value, onCommit, onCancel, className }: {
  value: string
  onCommit: (title: string) => void
  onCancel: () => void
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const armed = useRef(false)
  const done = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      armed.current = true
      ref.current?.focus()
      ref.current?.select()
    }, 200)
    return () => clearTimeout(t)
  }, [])

  const finish = (save: boolean, text: string) => {
    if (done.current) return
    done.current = true
    if (save && text.trim() && text.trim() !== value) onCommit(text)
    else onCancel()
  }

  return (
    <Input
      ref={ref}
      defaultValue={value}
      aria-label="对话标题"
      maxLength={60}
      className={className}
      onBlur={(e) => { if (armed.current) finish(true, e.currentTarget.value) }}
      onKeyDown={(e) => {
        if (e.nativeEvent.isComposing) return
        if (e.key === "Enter") finish(true, e.currentTarget.value)
        if (e.key === "Escape") finish(false, "")
      }}
    />
  )
}
