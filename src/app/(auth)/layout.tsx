import Link from "next/link"

import { site } from "@/config/site"

// 登录 / 注册页的外框：上方 logo + 产品名（点击回首页）+ 一句话介绍，下方法务链接
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex flex-col items-center gap-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" className="size-10 rounded-xl" />
          <span className="text-lg font-semibold">{site.name}</span>
          <span className="text-sm text-muted-foreground">{site.tagline}</span>
        </Link>
        {children}
        <p className="text-center text-xs text-muted-foreground">
          继续即表示你同意
          <Link href={site.legal.terms} className="underline underline-offset-4">用户协议</Link>
          和
          <Link href={site.legal.privacy} className="underline underline-offset-4">隐私政策</Link>
        </p>
      </div>
    </div>
  )
}
