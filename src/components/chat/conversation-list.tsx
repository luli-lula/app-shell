"use client"

import { CheckIcon, ChevronDownIcon, ChevronRightIcon, FolderIcon, FolderPlusIcon, MoreHorizontalIcon, PencilIcon, PinIcon, PinOffIcon, SquarePenIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { groupOf, type Conversation, type Group } from "./mock-chat"
import { TitleEditor } from "./title-editor"

export type ListActions = {
  create: () => void
  select: (id: string) => void
  rename: (id: string, title: string) => void
  remove: (id: string) => void
  togglePin: (id: string) => void
  moveToGroup: (id: string, groupId: string | null) => void
  createGroup: (moveId?: string) => string
  renameGroup: (id: string, name: string) => void
  toggleGroup: (id: string) => void
  removeGroup: (id: string) => void
}

// 悬停才出现的「⋯」按钮（触屏一直显示）
function MoreButton({ label }: { label: string }) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        className="absolute top-1/2 right-1 size-7 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <MoreHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>
  )
}

// 关闭菜单时不把焦点还给按钮，否则改名输入框会立刻失焦
const keepFocus = (e: Event) => e.preventDefault()

// 会话列表。从上到下：新对话 / 新建分组、置顶、自建分组（可折叠）、未分组（今天 / 昨天 / 更早）。
// 每行的「⋯」菜单：重命名、置顶、移到分组、删除。桌面放侧栏，窄屏放抽屉，同一个组件。
export function ConversationList({ list, groups, activeId, editingId, setEditingId, actions }: {
  list: Conversation[]
  groups: Group[]
  activeId: string
  editingId: string | null
  setEditingId: (id: string | null) => void
  actions: ListActions
}) {
  const pinned = list.filter((c) => c.pinned)
  const loose = list.filter((c) => !c.pinned && !c.groupId)
  const commitRename = (id: string, t: string) => { actions.rename(id, t); setEditingId(null) }

  const row = (c: Conversation) => (
    <div key={c.id} className="group/item relative">
      {editingId === c.id ? (
        <TitleEditor value={c.title} onCommit={(t) => commitRename(c.id, t)} onCancel={() => setEditingId(null)} className="h-8" />
      ) : (
        <>
          <button
            onClick={() => actions.select(c.id)}
            aria-current={c.id === activeId ? "true" : undefined}
            className={cn("flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 pr-8 text-left text-sm hover:bg-accent", c.id === activeId && "bg-accent font-medium")}
          >
            <span className="truncate">{c.title}</span>
          </button>
          <DropdownMenu>
            <MoreButton label={`「${c.title}」的更多操作`} />
            <DropdownMenuContent align="start" className="min-w-44" onCloseAutoFocus={keepFocus}>
              <DropdownMenuItem onSelect={() => setEditingId(c.id)}><PencilIcon />重命名</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => actions.togglePin(c.id)}>
                {c.pinned ? <><PinOffIcon />取消置顶</> : <><PinIcon />置顶</>}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><FolderIcon />移到分组</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {groups.map((g) => (
                    <DropdownMenuItem key={g.id} onSelect={() => actions.moveToGroup(c.id, g.id)}>
                      {g.name}{c.groupId === g.id && <CheckIcon className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                  {groups.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem onSelect={() => setEditingId(actions.createGroup(c.id))}><FolderPlusIcon />新建分组…</DropdownMenuItem>
                  {c.groupId && <DropdownMenuItem onSelect={() => actions.moveToGroup(c.id, null)}>移出分组</DropdownMenuItem>}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => actions.remove(c.id)}><Trash2Icon />删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-1 px-2 pt-2">
        <Button variant="ghost" className="flex-1 justify-start gap-2" onClick={actions.create}>
          <SquarePenIcon />
          新对话
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="新建分组" onClick={() => setEditingId(actions.createGroup())}><FolderPlusIcon /></Button>
          </TooltipTrigger>
          <TooltipContent>新建分组</TooltipContent>
        </Tooltip>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-2">
        {list.length === 0 && groups.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted-foreground">还没有对话</p>}

        {pinned.length > 0 && (
          <section>
            <p className="flex items-center gap-1 px-2 pt-3 pb-1 text-xs text-muted-foreground"><PinIcon className="size-3" />置顶</p>
            {pinned.map(row)}
          </section>
        )}

        {groups.map((g) => {
          const members = list.filter((c) => !c.pinned && c.groupId === g.id)
          return (
            <section key={g.id}>
              <div className="group/item relative mt-2">
                {editingId === g.id ? (
                  <TitleEditor value={g.name} onCommit={(t) => { actions.renameGroup(g.id, t); setEditingId(null) }} onCancel={() => setEditingId(null)} className="h-8" />
                ) : (
                  <>
                    <button
                      onClick={() => actions.toggleGroup(g.id)}
                      aria-expanded={!g.collapsed}
                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 pr-8 text-left text-xs text-muted-foreground hover:bg-accent"
                    >
                      {g.collapsed ? <ChevronRightIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
                      <span className="truncate">{g.name}</span>
                      <span className="ml-auto tabular-nums">{list.filter((c) => c.groupId === g.id).length}</span>
                    </button>
                    <DropdownMenu>
                      <MoreButton label={`分组「${g.name}」的更多操作`} />
                      <DropdownMenuContent align="start" className="min-w-44" onCloseAutoFocus={keepFocus}>
                        <DropdownMenuItem onSelect={() => setEditingId(g.id)}><PencilIcon />重命名分组</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => actions.removeGroup(g.id)}><Trash2Icon />删除分组</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
              {!g.collapsed && (members.length > 0 ? members.map(row) : <p className="px-2 py-1.5 text-xs text-muted-foreground">空分组：用对话的「⋯」把对话移进来</p>)}
            </section>
          )
        })}

        {loose.map((c, i) => (
          <div key={c.id}>
            {(i === 0 || groupOf(c.updatedAt) !== groupOf(loose[i - 1].updatedAt)) && (
              <p className="px-2 pt-3 pb-1 text-xs text-muted-foreground">{groupOf(c.updatedAt)}</p>
            )}
            {row(c)}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
