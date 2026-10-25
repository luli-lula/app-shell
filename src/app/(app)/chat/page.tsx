"use client"

import { useState } from "react"
import { ArrowUpIcon, CheckIcon, FileTextIcon, PanelRightCloseIcon, PaperclipIcon, PlusIcon, SquarePenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { conversations } from "@/config/demo-data"

// AI 对话整页：左会话历史 | 中消息流 | 右产出物面板（点产出物卡片打开，可关闭）
export default function ChatPage() {
  const [active, setActive] = useState("c1")
  const [artifactOpen, setArtifactOpen] = useState(true)

  return (
    <div className="flex min-h-0 flex-1">
      {/* 会话历史：窄屏隐藏 */}
      <aside className="hidden w-60 shrink-0 flex-col border-r lg:flex">
        <div className="p-3">
          <Button variant="outline" className="w-full justify-start">
            <SquarePenIcon />
            新对话
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <p className="px-2 py-1 text-xs text-muted-foreground">最近</p>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
                active === c.id && "bg-accent font-medium",
              )}
            >
              <span className="flex-1 truncate">{c.title}</span>
              <span className="text-xs text-muted-foreground">{c.time}</span>
            </button>
          ))}
        </ScrollArea>
      </aside>

      {/* 消息流 */}
      <section className="flex min-w-0 flex-1 flex-col">
        <ScrollArea className="flex-1">
          <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 text-sm">
            <div className="ml-auto max-w-[85%] rounded-2xl bg-muted px-4 py-2.5">我想做一个记账工具，先帮我看看市面上有哪些类似产品</div>
            <div className="space-y-3">
              <div className="space-y-1.5 border-l-2 pl-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><CheckIcon className="size-3.5 text-emerald-600" />检索公开产品与开源项目</p>
                <p className="flex items-center gap-2"><CheckIcon className="size-3.5 text-emerald-600" />整理成对比表</p>
              </div>
              <p className="leading-relaxed">找到 8 个类似产品，其中 3 个是开源的。对比表在右边，主要差别在多币种和账单导入两点上。</p>
              <button
                onClick={() => setArtifactOpen(true)}
                className="flex w-full max-w-sm items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left hover:bg-accent"
              >
                <FileTextIcon className="size-5 text-primary" />
                <span className="flex-1">
                  <span className="block font-medium">记账工具竞品对比</span>
                  <span className="block text-xs text-muted-foreground">文档 · 点击在右侧查看</span>
                </span>
              </button>
            </div>
          </div>
        </ScrollArea>
        <div className="mx-auto w-full max-w-2xl px-4 pb-4">
          <div className="mb-2 flex flex-wrap gap-2">
            {["哪个最值得参考？", "开源的能直接复用吗？", "帮我列 MVP 功能"].map((q) => (
              <Button key={q} variant="outline" size="sm" className="rounded-full">{q}</Button>
            ))}
          </div>
          <div className="relative rounded-2xl border bg-card shadow-xs">
            <Textarea placeholder="问点什么，或让我帮你检索、整理、起草…" className="min-h-20 resize-none border-0 pb-10 shadow-none focus-visible:ring-0" />
            <div className="absolute inset-x-2 bottom-2 flex items-center">
              <Button variant="ghost" size="icon" className="size-8" aria-label="添加附件"><PlusIcon /></Button>
              <Button variant="ghost" size="icon" className="size-8" aria-label="上传文件"><PaperclipIcon /></Button>
              <Button size="icon" className="ml-auto size-8 rounded-full" aria-label="发送"><ArrowUpIcon /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* 产出物面板：窄屏不显示 */}
      {artifactOpen && (
        <aside className="hidden w-[440px] shrink-0 flex-col border-l bg-card xl:flex">
          <div className="flex items-center gap-2 border-b px-4 py-2.5">
            <FileTextIcon className="size-4 text-primary" />
            <span className="flex-1 truncate text-sm font-medium">记账工具竞品对比</span>
            <Button variant="outline" size="sm">导出</Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setArtifactOpen(false)} aria-label="关闭面板">
              <PanelRightCloseIcon />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-3 p-5 text-sm">
              <h3 className="text-base font-semibold">记账工具竞品对比</h3>
              <table className="w-full text-xs">
                <thead className="text-muted-foreground">
                  <tr className="border-b"><th className="py-2 text-left font-medium">产品</th><th className="text-left font-medium">多币种</th><th className="text-left font-medium">账单导入</th><th className="text-left font-medium">开源</th></tr>
                </thead>
                <tbody>
                  {[["产品 A", "✓", "✓", "–"], ["产品 B", "–", "✓", "✓"], ["产品 C", "✓", "–", "✓"], ["产品 D", "–", "–", "–"]].map((r) => (
                    <tr key={r[0]} className="border-b">{r.map((c, i) => <td key={i} className="py-2">{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="leading-relaxed text-muted-foreground">示意内容：产出物面板用来放对话里生成的文档、表格、图表，可以导出或在编辑器里继续改。</p>
            </div>
          </ScrollArea>
        </aside>
      )}
    </div>
  )
}
