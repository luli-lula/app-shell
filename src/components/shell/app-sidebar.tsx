"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderIcon, PlusIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { mainNav, productName, projects } from "@/config/nav"
import { NavUser } from "@/components/shell/nav-user"

// 侧栏：可收成图标条（collapsible="icon"），状态记在 cookie，⌘B 切换，手机端自动变抽屉
export function AppSidebar() {
  const pathname = usePathname()
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url))

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  P
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{productName}</span>
                  <span className="truncate text-xs text-muted-foreground">个人版</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>项目</SidebarGroupLabel>
          <SidebarGroupAction title="新建项目">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((p) => (
                <SidebarMenuItem key={p.url}>
                  <SidebarMenuButton asChild>
                    <Link href={p.url}>
                      <FolderIcon />
                      <span>{p.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
