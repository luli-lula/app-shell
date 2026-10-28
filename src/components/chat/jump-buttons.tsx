"use client"

import { useEffect, useState } from "react"
import { ArrowDownToLineIcon, ArrowUpToLineIcon } from "lucide-react"
import { useStickToBottomContext } from "use-stick-to-bottom"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function JumpButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" className="size-9 rounded-full bg-background shadow-sm" aria-label={label} onClick={onClick}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  )
}

// 长对话的快捷按钮：离开顶部时出现「回到顶部」，离开底部时出现「回到底部」。放在 <Conversation> 里面。
export function JumpButtons() {
  const { isAtBottom, scrollToBottom, stopScroll, scrollRef } = useStickToBottomContext()
  const [away, setAway] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setAway(el.scrollTop > 240)
    update()
    el.addEventListener("scroll", update, { passive: true })
    return () => el.removeEventListener("scroll", update)
  }, [scrollRef])

  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-2">
      {away && <JumpButton label="回到顶部" onClick={() => { stopScroll(); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }) }}><ArrowUpToLineIcon /></JumpButton>}
      {!isAtBottom && <JumpButton label="回到底部" onClick={() => void scrollToBottom()}><ArrowDownToLineIcon /></JumpButton>}
    </div>
  )
}
