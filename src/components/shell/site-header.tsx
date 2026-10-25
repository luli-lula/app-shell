"use client"

import { usePathname } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { titleOf } from "@/config/nav"

// 顶栏：收起侧栏按钮 + 当前页标题 + 搜索入口 + 语言切换
export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
      <h1 className="text-sm font-medium">{titleOf(pathname)}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden w-56 justify-start text-muted-foreground sm:flex">
          <SearchIcon />
          搜索…
          <Kbd className="ml-auto">⌘K</Kbd>
        </Button>
        <Button variant="ghost" size="sm">中 / EN</Button>
      </div>
    </header>
  )
}
