import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { files } from "@/config/demo-data"

// 首页 / 仪表盘：KPI 卡片 + 趋势图 + 最近文件
export default function HomePage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-xl font-semibold">早上好，Lula</h2>
        <p className="text-sm text-muted-foreground">这是你这周的工作概况。</p>
      </div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>最近文件</CardTitle>
            <CardAction>
              <Button variant="outline" size="sm" asChild>
                <Link href="/library">查看全部</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y">
            {files.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="flex-1 truncate">{f.title}</span>
                <Badge variant="secondary">{f.status}</Badge>
                <span className="w-16 text-right text-muted-foreground">{f.updated}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
