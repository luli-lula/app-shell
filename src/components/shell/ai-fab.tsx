"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpIcon, Maximize2Icon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

// 悬浮 AI 入口：除 AI 对话页外都显示，点开是右侧小窗，可展开成整页
export function AiFab() {
  const pathname = usePathname()
  if (pathname.startsWith("/chat")) return null

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg" aria-label="问 AI">
          <SparklesIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b">
          <div>
            <SheetTitle>问 AI</SheetTitle>
            <SheetDescription>正在看：{pathname === "/" ? "首页" : pathname}</SheetDescription>
          </div>
          <Button variant="ghost" size="icon" asChild className="mr-8">
            <Link href="/chat" aria-label="展开为整页">
              <Maximize2Icon />
            </Link>
          </Button>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl bg-muted px-3 py-2">这一页的数据说明了什么？</div>
          <p className="leading-relaxed">本周新增 1,234 次访问，比上周多 12%。主要来自「竞品调研」项目的分享链接。</p>
        </div>
        <div className="border-t p-3">
          <div className="relative">
            <Textarea placeholder="问点什么…" className="min-h-20 resize-none pr-12" />
            <Button size="icon" className="absolute right-2 bottom-2 size-8 rounded-full" aria-label="发送">
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
