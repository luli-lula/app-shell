import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { ChatClient } from "./chat-client"

// 会话列表按「今天 / 昨天」分组，要读当前时间；Next.js 16 要求这类客户端组件放进 Suspense，在请求时渲染
export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6"><Skeleton className="h-8 w-48" /></div>}>
      <ChatClient />
    </Suspense>
  )
}
