import {
  HomeIcon,
  SparklesIcon,
  LibraryIcon,
  LoaderIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"

// 导航只在这里定义一份，侧栏、面包屑、手机端都读它
export type NavItem = { title: string; url: string; icon: LucideIcon; badge?: string }

export const productName = "产品名"

export const mainNav: NavItem[] = [
  { title: "首页", url: "/", icon: HomeIcon },
  { title: "AI 对话", url: "/chat", icon: SparklesIcon },
  { title: "文件库", url: "/library", icon: LibraryIcon, badge: "3" },
  { title: "任务状态", url: "/status", icon: LoaderIcon },
]

export const projects = [
  { title: "客户访谈整理", url: "/library?project=interviews" },
  { title: "竞品调研", url: "/library?project=competitors" },
]

export const footerNav: NavItem[] = [{ title: "设置", url: "/settings", icon: SettingsIcon }]

export const currentUser = { name: "Lula", email: "lula@example.com", avatar: "" }

export function titleOf(pathname: string) {
  return [...mainNav, ...footerNav].find((n) => (n.url === "/" ? pathname === "/" : pathname.startsWith(n.url)))?.title ?? ""
}
