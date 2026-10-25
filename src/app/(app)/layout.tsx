import { Suspense } from "react"
import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { SiteHeader } from "@/components/shell/site-header"
import { AiFab } from "@/components/shell/ai-fab"

// 有外壳的页面：侧栏 + 顶栏 + 悬浮 AI。
// 侧栏展开状态从 cookie 读（刷新后保持）；读 cookie 是动态的，按 Next.js 16 的要求放进 Suspense 里流式渲染
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Shell defaultOpen>{children}</Shell>}>
      <ShellWithCookie>{children}</ShellWithCookie>
    </Suspense>
  )
}

async function ShellWithCookie({ children }: { children: React.ReactNode }) {
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false"
  return <Shell defaultOpen={defaultOpen}>{children}</Shell>
}

function Shell({ defaultOpen, children }: { defaultOpen: boolean; children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
      <AiFab />
    </SidebarProvider>
  )
}
