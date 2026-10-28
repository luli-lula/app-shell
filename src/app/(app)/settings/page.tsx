"use client"

import { useTheme } from "next-themes"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { currentUser } from "@/config/nav"

// 设置页：个人资料 / 偏好 / 账号 三个页签；保存后弹提示条
export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const saved = () => toast.success("已保存")

  return (
    <div className="mx-auto w-full max-w-3xl p-4 lg:p-6">
      <h2 className="mb-1 text-lg font-semibold">设置</h2>
      <p className="mb-5 text-sm text-muted-foreground">管理你的资料、偏好和账号。</p>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="prefs">偏好</TabsTrigger>
          <TabsTrigger value="account">账号</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>个人资料</CardTitle>
              <CardDescription>名字会显示在侧栏和分享出去的内容里。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12"><AvatarFallback>{currentUser.name.slice(0, 1)}</AvatarFallback></Avatar>
                <Button variant="outline" size="sm">更换头像</Button>
              </div>
              <div className="grid gap-2"><Label htmlFor="name">名字</Label><Input id="name" defaultValue={currentUser.name} /></div>
              <div className="grid gap-2"><Label htmlFor="email">邮箱</Label><Input id="email" defaultValue={currentUser.email} disabled /></div>
            </CardContent>
            <CardFooter><Button onClick={saved}>保存</Button></CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="prefs">
          <Card>
            <CardHeader><CardTitle>偏好</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div><Label>界面语言</Label><p className="text-xs text-muted-foreground">切换后立即生效</p></div>
                <Select defaultValue="zh">
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="zh">简体中文</SelectItem><SelectItem value="en">English</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div><Label>外观</Label><p className="text-xs text-muted-foreground">跟随系统，或固定浅色、深色</p></div>
                <Select value={theme ?? "system"} onValueChange={setTheme}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="system">跟随系统</SelectItem><SelectItem value="light">浅色</SelectItem><SelectItem value="dark">深色</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div><Label htmlFor="notify">邮件通知</Label><p className="text-xs text-muted-foreground">任务完成时发邮件提醒</p></div>
                <Switch id="notify" defaultChecked onCheckedChange={saved} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader><CardTitle>账号</CardTitle><CardDescription>登录方式：邮箱 {currentUser.email}</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline">导出我的数据</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive">删除账号</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>删除账号？</AlertDialogTitle>
                    <AlertDialogDescription>账号和全部数据会被永久删除，不能恢复。</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">删除</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
