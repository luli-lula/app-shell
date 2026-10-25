"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本月新增文件</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,250
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            本月上升{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            近 6 个月
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>活跃项目</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon
              />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            本期下降 20%{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            需要关注
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>AI 对话次数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4,568
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            保持稳定{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">高于目标</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>完成率</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            86%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon
              />
              +86%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            稳步提升{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">符合预期</div>
        </CardFooter>
      </Card>
    </div>
  )
}
