"use client"

import { AlertCircleIcon, Loader2Icon, RotateCwIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// 异步任务的三种状态：处理中（进度 + 骨架屏）、失败（原因 + 重试）、加载中占位
export default function StatusPage() {
  return (
    <div className="grid gap-4 p-4 lg:grid-cols-2 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Loader2Icon className="size-4 animate-spin" />正在分析 12 份文件</CardTitle>
          <CardDescription>大约还需 2 分钟。可以离开这个页面，完成后会提醒你。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-3/5 rounded-full bg-primary" /></div>
          <p className="text-xs text-muted-foreground">第 7 / 12 份：竞品功能对比表</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircleIcon className="size-4" />分析失败</CardTitle>
          <CardDescription>第 3 份文件格式无法识别（.pages）。其余 11 份已完成。</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={() => toast("已重新开始")}><RotateCwIcon />重试</Button>
          <Button variant="outline">跳过这份</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>加载中占位</CardTitle><CardDescription>数据没回来之前，用骨架屏占位，不显示空白。</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3"><Skeleton className="size-9 rounded-md" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-3 w-1/3" /></div></div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
