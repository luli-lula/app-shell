"use client"

import Link from "next/link"
import { ChevronsUpDownIcon, LanguagesIcon, LogOutIcon, SettingsIcon, CircleHelpIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { currentUser } from "@/config/nav"

// 账号菜单：点名字弹出，设置在第一位，退出登录在最下面
export function NavUser() {
  const { isMobile } = useSidebar()
  const u = currentUser
  const initial = u.name.slice(0, 1).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={u.avatar} alt={u.name} />
                <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{u.name}</span>
                <span className="truncate text-xs text-muted-foreground">{u.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="font-normal text-muted-foreground">{u.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <SettingsIcon />
                  设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguagesIcon />
                语言：简体中文
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleHelpIcon />
                帮助与反馈
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOutIcon />
                退出登录
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
