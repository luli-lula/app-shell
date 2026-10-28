"use client"

import { FileTextIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

// 附件小卡：图片显示缩略图，其他文件显示图标和文件名。输入框里可删除，消息里只读。
export function FileChip({ name, type, url, onRemove }: { name: string; type: string; url: string; onRemove?: () => void }) {
  const isImage = type.startsWith("image/")
  return (
    <div className="group/chip relative flex max-w-48 items-center gap-2 rounded-lg border bg-background p-1.5 pr-3 text-xs">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- 用户本地选择的 blob 地址，不走 next/image
        <img src={url} alt={name} className="size-8 shrink-0 rounded object-cover" />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted"><FileTextIcon className="size-4 text-muted-foreground" /></span>
      )}
      <span className="truncate">{name}</span>
      {onRemove && (
        <Button type="button" variant="secondary" size="icon" aria-label={`移除 ${name}`} onClick={onRemove} className="absolute -top-2 -right-2 size-5 rounded-full opacity-0 group-hover/chip:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  )
}
