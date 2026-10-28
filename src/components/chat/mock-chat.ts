"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { conversations as seedConversations } from "@/config/demo-data"

// 模拟后端：没有任何网络请求，用定时器演示一次完整的 AI 回合。
// 接真实后端时，只替换 run() 里的几个 await，界面组件不用改。

export type Phase = "thinking" | "tool" | "approval" | "streaming" | "done" | "stopped" | "error"

export type Turn = {
  id: string
  prompt: string
  phase: Phase
  toolRunning: boolean
  approved?: boolean
  shown: number
  wantsApproval: boolean
  willFail: boolean
  files?: ChatFile[]
}

export type ChatFile = { name: string; type: string; url: string }

export type Segment = { text: string; cite?: number }

export const sources = [
  { title: "记账工具对比评测（示例）", url: "https://example.com/review", description: "示意来源：对比 8 款记账工具的多币种、导入与价格。" },
  { title: "开源记账项目列表（示例）", url: "https://example.com/open-source", description: "示意来源：3 个可自托管的开源记账项目。" },
]

export const answer: Segment[] = [
  { text: "找到 8 个类似产品，其中 3 个是开源的。" },
  { text: "多币种支持是最大的分水岭，只有 4 个产品做到了", cite: 0 },
  { text: "；" },
  { text: "账单导入则几乎是标配", cite: 1 },
  { text: "。如果只参考一个，建议看产品 B：它开源，导入能力也最完整。" },
  { text: "两个开源项目都支持自托管，数据留在自己手里；其余产品要么只有云端版，要么导出受限。选型时先确认三件事：要不要多币种、账单从哪里导入、数据能不能带走。" },
]

export const answerLength = answer.reduce((n, s) => n + s.text.length, 0)

export const reasoningText = "用户想了解记账工具的市场。先查公开产品和开源项目，再按多币种、账单导入、是否开源整理成对比表。"

export const suggestions = ["哪个最值得参考？", "导出对比表（会覆盖旧文件）", "模拟一次失败"]

class Aborted extends Error {}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new Aborted())
    const t = setTimeout(resolve, ms)
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new Aborted()) }, { once: true })
  })
}

export type Conversation = { id: string; title: string; updatedAt: number; turns: Turn[]; pinned?: boolean; groupId?: string }
export type Group = { id: string; name: string; collapsed: boolean }

export const NEW_TITLE = "新对话"
export const NEW_GROUP = "新分组"
const HOUR = 3600_000

// 示例数据：每个会话带已完成的回合，方便看列表、分组、置顶、重命名、删除。真实项目换成接口返回的列表。
function seedTurn(id: string, prompt: string): Turn {
  return { id, prompt, phase: "done", toolRunning: false, shown: answerLength, wantsApproval: false, willFail: false }
}
const longPrompts = ["我想做一个记账工具，先帮我看看市面上有哪些类似产品", "哪个最值得参考？", "开源的能直接复用吗？", "多币种怎么处理汇率？", "账单导入支持哪些格式？", "帮我列 MVP 功能", "哪些功能第一版可以不做？", "给我一个两周的开发计划", "再帮我检查一下风险"]
function seed(): Conversation[] {
  const ago = [0, 26 * HOUR, 5 * 24 * HOUR, 7 * 24 * HOUR]
  const now = Date.now()
  return seedConversations.map((c, i) => ({
    id: c.id,
    title: c.title,
    updatedAt: now - ago[i],
    // 第一个会话做成长对话，用来看「回到顶部 / 底部」按钮
    turns: i === 0 ? longPrompts.map((p, k) => seedTurn(`${c.id}-t${k}`, p)) : [seedTurn(`${c.id}-t1`, c.title)],
    pinned: c.id === "c2" ? true : undefined,
    groupId: c.id === "c1" || c.id === "c4" ? "g1" : undefined,
  }))
}
function seedGroups(): Group[] {
  return [{ id: "g1", name: "产品调研", collapsed: false }]
}
function blank(): Conversation {
  return { id: crypto.randomUUID(), title: NEW_TITLE, updatedAt: Date.now(), turns: [] }
}

// 未分组对话按时间分段：今天 / 昨天 / 更早
export function groupOf(updatedAt: number) {
  const day = (t: number) => new Date(t).setHours(0, 0, 0, 0)
  const diff = Math.round((day(Date.now()) - day(updatedAt)) / (24 * HOUR))
  return diff <= 0 ? "今天" : diff === 1 ? "昨天" : "更早"
}

export function useMockChat() {
  const [list, setList] = useState<Conversation[]>(seed)
  const [groups, setGroups] = useState<Group[]>(seedGroups)
  const [activeId, setActiveId] = useState(() => list[0].id)
  const abortRef = useRef<AbortController | null>(null)
  const approvalRef = useRef<((ok: boolean) => void) | null>(null)

  const active = list.find((c) => c.id === activeId) ?? list[0]
  const turns = active.turns

  const patch = useCallback((cid: string, id: string, p: Partial<Turn>) => {
    setList((cs) => cs.map((c) => (c.id === cid ? { ...c, turns: c.turns.map((t) => (t.id === id ? { ...t, ...p } : t)) } : c)))
  }, [])

  const run = useCallback(async (cid: string, turn: Turn) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const { signal } = ctrl
    const id = turn.id
    const set = (p: Partial<Turn>) => patch(cid, id, p)
    try {
      set({ phase: "thinking", shown: 0, approved: undefined, toolRunning: true })
      await sleep(1600, signal)
      set({ phase: "tool" })
      await sleep(1400, signal)
      set({ toolRunning: false })
      if (turn.wantsApproval) {
        set({ phase: "approval" })
        const ok = await new Promise<boolean>((resolve, reject) => {
          approvalRef.current = resolve
          signal.addEventListener("abort", () => reject(new Aborted()), { once: true })
        })
        set({ approved: ok })
        if (!ok) { set({ phase: "done", shown: 0 }); return }
      }
      if (turn.willFail) { await sleep(500, signal); set({ phase: "error" }); return }
      set({ phase: "streaming" })
      for (let n = 0; n < answerLength; n += 3) {
        await sleep(35, signal)
        set({ shown: Math.min(n + 3, answerLength) })
      }
      set({ phase: "done", shown: answerLength })
    } catch (e) {
      if (e instanceof Aborted) set({ phase: "stopped" })
      else throw e
    }
  }, [patch])

  const stop = useCallback(() => abortRef.current?.abort(), [])

  const send = useCallback((prompt: string, files: ChatFile[] = []) => {
    const text = prompt.trim() || (files.length ? "（见附件）" : "")
    if (!text) return
    const turn: Turn = {
      id: crypto.randomUUID(),
      prompt: text,
      phase: "thinking",
      toolRunning: true,
      shown: 0,
      wantsApproval: text.includes("导出"),
      willFail: text.includes("失败"),
      files,
    }
    const cid = active.id
    // 第一条消息自动起标题；之后的消息把会话顶到列表最前
    setList((cs) => {
      const cur = cs.find((c) => c.id === cid)
      if (!cur) return cs
      const next = { ...cur, turns: [...cur.turns, turn], updatedAt: Date.now(), title: cur.title === NEW_TITLE ? (prompt.trim() || files[0]?.name || text).slice(0, 20) : cur.title }
      return [next, ...cs.filter((c) => c.id !== cid)]
    })
    void run(cid, turn)
  }, [active, run])

  const retry = useCallback((id: string) => {
    const turn = turns.find((t) => t.id === id)
    if (turn) void run(active.id, { ...turn, willFail: false })
  }, [active, run, turns])

  const decide = useCallback((ok: boolean) => approvalRef.current?.(ok), [])

  // 新对话：当前已经是空白会话就不再多建
  const create = useCallback(() => {
    stop()
    if (active.turns.length === 0 && active.title === NEW_TITLE) return
    const c = blank()
    setList((cs) => [c, ...cs])
    setActiveId(c.id)
  }, [active, stop])

  const select = useCallback((id: string) => { if (id !== activeId) { stop(); setActiveId(id) } }, [activeId, stop])

  const rename = useCallback((id: string, title: string) => {
    const t = title.trim()
    if (!t) return
    setList((cs) => cs.map((c) => (c.id === id ? { ...c, title: t } : c)))
  }, [])

  // 删除：直接删，给一个撤销提示（可撤销就不需要确认弹窗）
  const remove = useCallback((id: string) => {
    const index = list.findIndex((c) => c.id === id)
    const removed = list[index]
    if (!removed) return
    if (id === activeId) stop()
    const rest = list.filter((c) => c.id !== id)
    if (rest.length === 0) {
      const c = blank()
      setList([c])
      setActiveId(c.id)
    } else {
      setList(rest)
      if (id === activeId) setActiveId(rest[Math.min(index, rest.length - 1)].id)
    }
    toast(`已删除「${removed.title}」`, {
      action: {
        label: "撤销",
        onClick: () => {
          setList((cs) => { const next = [...cs]; next.splice(Math.min(index, next.length), 0, removed); return next })
          setActiveId(removed.id)
        },
      },
    })
  }, [list, activeId, stop])

  // ---- 置顶与分组 ----
  const togglePin = useCallback((id: string) => {
    setList((cs) => cs.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }, [])

  const moveToGroup = useCallback((id: string, groupId: string | null) => {
    setList((cs) => cs.map((c) => (c.id === id ? { ...c, groupId: groupId ?? undefined } : c)))
    if (groupId) setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, collapsed: false } : g)))
  }, [])

  // 新建分组；传入对话 id 时顺便把它放进去。返回新分组 id，方便界面马上进入改名
  const createGroup = useCallback((moveId?: string) => {
    const g: Group = { id: crypto.randomUUID(), name: NEW_GROUP, collapsed: false }
    setGroups((gs) => [...gs, g])
    if (moveId) setList((cs) => cs.map((c) => (c.id === moveId ? { ...c, groupId: g.id } : c)))
    return g.id
  }, [])

  const renameGroup = useCallback((id: string, name: string) => {
    const t = name.trim()
    if (!t) return
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, name: t } : g)))
  }, [])

  const toggleGroup = useCallback((id: string) => {
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, collapsed: !g.collapsed } : g)))
  }, [])

  // 删除分组：里面的对话回到未分组（不删对话），可撤销
  const removeGroup = useCallback((id: string) => {
    const index = groups.findIndex((g) => g.id === id)
    const removed = groups[index]
    if (!removed) return
    const members = list.filter((c) => c.groupId === id).map((c) => c.id)
    setGroups((gs) => gs.filter((g) => g.id !== id))
    setList((cs) => cs.map((c) => (c.groupId === id ? { ...c, groupId: undefined } : c)))
    toast(`已删除分组「${removed.name}」，里面的对话保留`, {
      action: {
        label: "撤销",
        onClick: () => {
          setGroups((gs) => { const next = [...gs]; next.splice(Math.min(index, next.length), 0, removed); return next })
          setList((cs) => cs.map((c) => (members.includes(c.id) ? { ...c, groupId: id } : c)))
        },
      },
    })
  }, [groups, list])

  useEffect(() => () => abortRef.current?.abort(), [])

  const busy = turns.some((t) => t.phase === "thinking" || t.phase === "tool" || t.phase === "streaming")
  return { list, groups, active, turns, busy, send, retry, stop, decide, create, select, rename, remove, togglePin, moveToGroup, createGroup, renameGroup, toggleGroup, removeGroup }
}
