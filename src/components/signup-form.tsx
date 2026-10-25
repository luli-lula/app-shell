import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>
          填写信息创建账号
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">名字</FieldLabel>
              <Input id="name" type="text" placeholder="你的名字" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">邮箱</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                只用来联系你，不会给任何第三方。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">密码</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                至少 8 位。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                确认密码
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>再输入一次密码。</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">创建账号</Button>
                <Button variant="outline" type="button">
                  用 Google 注册
                </Button>
                <FieldDescription className="px-6 text-center">
                  已有账号？<a href="/login">登录</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
