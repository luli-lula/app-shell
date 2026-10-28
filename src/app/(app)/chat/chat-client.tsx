"use client"

import { useRef, useState } from "react"
import type { StickToBottomContext } from "use-stick-to-bottom"
import { DownloadIcon, FileTextIcon, HistoryIcon, MoreHorizontalIcon, PencilIcon, SparklesIcon, SquarePenIcon, Trash2Icon } from "lucide-react"

import { Artifact, ArtifactAction, ArtifactActions, ArtifactClose, ArtifactContent, ArtifactHeader, ArtifactTitle } from "@/components/ai-elements/artifact"
import { Conversation, ConversationContent, ConversationEmptyState } from "@/components/ai-elements/conversation"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Composer } from "@/components/chat/composer"
import { ConversationList } from "@/components/chat/conversation-list"
import { JumpButtons } from "@/components/chat/jump-buttons"
import { TitleEditor } from "@/components/chat/title-editor"
import { suggestions, useMockChat } from "@/components/chat/mock-chat"
import { TurnView } from "@/components/chat/turn-view"

// AI 对话整页：左会话列表 | 中消息流 | 右产出物面板。
// 后端是模拟的（components/chat/mock-chat.ts），用来演示交互模式，接真实后端时只换那一个文件。
export function ChatClient() {
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const stickRef = useRef<StickToBottomContext>(null)
  const chat = useMockChat()
  const { list, groups, active, turns, busy } = chat

  const send = (text: string, files: Parameters<typeof chat.send>[1] = []) => {
    if (busy) return
    chat.send(text, files)
    void stickRef.current?.scrollToBottom()
  }

  // 侧栏和窄屏抽屉共用同一份列表；窄屏里选中或新建后顺手关掉抽屉
  const actions = {
    ...chat,
    create: () => { chat.create(); setHistoryOpen(false) },
    select: (id: string) => { chat.select(id); setHistoryOpen(false) },
  }
  const listProps = { list, groups, activeId: active.id, editingId, setEditingId, actions }

  return (
    <div className="flex h-[calc(100svh-3rem)] min-h-0">
      <aside className="hidden w-64 shrink-0 flex-col border-r lg:flex">
        <ConversationList {...listProps} />
      </aside>

      {/* 窄屏：对话列表放进左侧抽屉 */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <SheetHeader className="sr-only"><SheetTitle>对话历史</SheetTitle><SheetDescription>选择、分组、重命名或删除对话</SheetDescription></SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col pt-8"><ConversationList {...listProps} /></div>
        </SheetContent>
      </Sheet>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* 对话标题行：标题 + 更多菜单；窄屏多出「历史」「新对话」两个图标 */}
        <div className="flex h-12 shrink-0 items-center gap-1 px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 size-8 lg:hidden" aria-label="对话历史" onClick={() => setHistoryOpen(true)}><HistoryIcon /></Button>
            </TooltipTrigger>
            <TooltipContent>对话历史</TooltipContent>
          </Tooltip>
          {editingId === active.id ? (
            <TitleEditor value={active.title} onCommit={(t) => { chat.rename(active.id, t); setEditingId(null) }} onCancel={() => setEditingId(null)} className="h-8 max-w-sm" />
          ) : (
            <h2 className="min-w-0 truncate text-sm font-medium" title={active.title}>{active.title}</h2>
          )}
          <div className="ml-auto flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 lg:hidden" aria-label="新对话" onClick={actions.create}><SquarePenIcon /></Button>
              </TooltipTrigger>
              <TooltipContent>新对话</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="对话更多操作"><MoreHorizontalIcon /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuItem onSelect={() => setEditingId(active.id)}><PencilIcon />重命名</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => chat.remove(active.id)}><Trash2Icon />删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Conversation className="min-h-0" contextRef={stickRef}>
          <ConversationContent className="mx-auto w-full max-w-2xl gap-8 px-4 py-6">
            {turns.length === 0 ? (
              <ConversationEmptyState icon={<SparklesIcon className="size-6" />} title="问点什么" description="点下面的建议，看一次完整的回答过程。后端是模拟的，不会产生费用。" />
            ) : (
              turns.map((t) => (
                <TurnView key={t.id} turn={t} onRetry={() => chat.retry(t.id)} onDecide={chat.decide} onOpenArtifact={() => setArtifactOpen(true)} />
              ))
            )}
          </ConversationContent>
          <JumpButtons />
        </Conversation>

        <div className="mx-auto w-full max-w-2xl px-4 pb-4">
          <Suggestions className="mb-2">
            {suggestions.map((q) => <Suggestion key={q} suggestion={q} disabled={busy} onClick={(text) => send(text)} className="h-8 px-3 text-[13px] font-normal text-muted-foreground shadow-none hover:text-foreground" />)}
          </Suggestions>
          <Composer busy={busy} onSend={send} onStop={chat.stop} />
        </div>
      </section>

      {artifactOpen && (
        <Artifact className="my-3 mr-3 hidden w-[440px] shrink-0 rounded-xl border shadow-none xl:flex">
          <ArtifactHeader className="border-b-0 bg-transparent">
            <ArtifactTitle className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm">
              <FileTextIcon className="size-4 text-muted-foreground" />记账工具竞品对比.md
              <ArtifactClose onClick={() => setArtifactOpen(false)} className="-mr-1 size-5" />
            </ArtifactTitle>
            <ArtifactActions>
              <ArtifactAction tooltip="导出" label="导出" icon={DownloadIcon} />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
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
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">示意内容：产出物面板放对话里生成的文档、表格、图表，只在有产物时才打开。</p>
          </ArtifactContent>
        </Artifact>
      )}
    </div>
  )
}
