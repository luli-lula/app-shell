"use client"

import { useMemo, useState } from "react"
import { FileTextIcon, PlusIcon, SearchIcon, Trash2Icon, InboxIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { files as seed, type FileItem } from "@/config/demo-data"

// 列表页：搜索 + 筛选 + 表格；点行打开右侧详情；删除要确认，删除后提示条可撤销；无结果时显示空状态
export default function LibraryPage() {
  const [items, setItems] = useState<FileItem[]>(seed)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [open, setOpen] = useState<FileItem | null>(null)
  const [toDelete, setToDelete] = useState<FileItem | null>(null)

  const shown = useMemo(
    () => items.filter((f) => f.title.includes(q) && (status === "all" || f.status === status)),
    [items, q, status],
  )

  const remove = (f: FileItem) => {
    setItems((list) => list.filter((x) => x.id !== f.id))
    setOpen(null)
    toast("已删除「" + f.title + "」", {
      action: { label: "撤销", onClick: () => setItems((list) => [...list, f].sort((a, b) => a.id.localeCompare(b.id))) },
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-2 text-lg font-semibold">全部文件</h2>
        <span className="text-sm text-muted-foreground">{shown.length} 个</span>
        <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索文件" className="pl-8" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="草稿">草稿</SelectItem>
              <SelectItem value="进行中">进行中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => toast.success("已新建文件")}><PlusIcon />新建</Button>
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
            <EmptyTitle>没有找到文件</EmptyTitle>
            <EmptyDescription>换个关键词试试，或者新建一个文件。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => { setQ(""); setStatus("all") }}>清除筛选</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead className="w-24">状态</TableHead>
                <TableHead className="hidden w-24 md:table-cell">负责人</TableHead>
                <TableHead className="w-20 text-right">更新</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((f) => (
                <TableRow key={f.id} className="cursor-pointer" onClick={() => setOpen(f)}>
                  <TableCell className="max-w-0 truncate font-medium">{f.title}</TableCell>
                  <TableCell><Badge variant="secondary">{f.status}</Badge></TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{f.owner}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{f.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 详情：右侧抽屉 */}
      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2"><FileTextIcon className="size-4" />{open?.title}</SheetTitle>
            <SheetDescription>{open?.owner} · 更新于 {open?.updated}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 text-sm">
            <Badge variant="secondary">{open?.status}</Badge>
            <p className="leading-relaxed">{open?.summary}</p>
          </div>
          <SheetFooter className="flex-row">
            <Button className="flex-1">打开</Button>
            <Button variant="outline" size="icon" aria-label="删除" onClick={() => setToDelete(open)}><Trash2Icon /></Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 删除确认：短标题 + 一句确认 + 取消 / 红色确认 */}
      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除这个文件？</AlertDialogTitle>
            <AlertDialogDescription>「{toDelete?.title}」会被删除，10 秒内可以在提示条里撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => toDelete && remove(toDelete)}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
