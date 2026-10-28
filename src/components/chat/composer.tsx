"use client"

import { useRef, useState, useSyncExternalStore } from "react"
import { ArrowUpIcon, MicIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input"
import { cn } from "@/lib/utils"
import { FileChip } from "./file-chip"
import type { ChatFile } from "./mock-chat"

// 浏览器自带的语音识别（Chrome、Edge、Safari 有；Firefox 没有，没有就不显示按钮）
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type RecognitionCtor = new () => Recognition
const getRecognition = () => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}
const subscribe = () => () => {}

function AttachmentRow() {
  const { files, remove } = usePromptInputAttachments()
  if (files.length === 0) return null
  return (
    <PromptInputHeader className="flex-wrap justify-start gap-2 pt-3">
      {files.map((f) => <FileChip key={f.id} name={f.filename ?? "文件"} type={f.mediaType} url={f.url} onRemove={() => remove(f.id)} />)}
    </PromptInputHeader>
  )
}

// 发送键：没内容时是淡灰的禁用样式，有文字或附件才变主色；回答中变成停止键
function SendButton({ busy, onStop }: { busy: boolean; onStop: () => void }) {
  const { textInput, attachments } = usePromptInputController()
  const empty = !textInput.value.trim() && attachments.files.length === 0
  return (
    <PromptInputSubmit
      status={busy ? "streaming" : undefined}
      onStop={onStop}
      disabled={empty && !busy}
      className={cn("size-8 rounded-full", empty && !busy && "bg-muted text-muted-foreground opacity-100")}
    >
      {busy ? undefined : <ArrowUpIcon className="size-4" />}
    </PromptInputSubmit>
  )
}

function VoiceButton() {
  const supported = useSyncExternalStore(subscribe, () => !!getRecognition(), () => false)
  const { textInput } = usePromptInputController()
  const recRef = useRef<Recognition | null>(null)
  const baseRef = useRef("")
  const [listening, setListening] = useState(false)

  if (!supported) return null

  const toggle = () => {
    if (recRef.current) { recRef.current.stop(); return }
    const Ctor = getRecognition()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = "zh-CN"
    rec.continuous = true
    rec.interimResults = true
    baseRef.current = textInput.value
    rec.onresult = (e) => {
      const said = Array.from(e.results).map((r) => r[0].transcript).join("")
      textInput.setInput(baseRef.current + said)
    }
    rec.onerror = () => toast.error("语音输入失败，检查一下麦克风权限")
    rec.onend = () => { recRef.current = null; setListening(false) }
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <PromptInputButton tooltip={listening ? "停止语音输入" : "语音输入"} aria-label="语音输入" aria-pressed={listening} onClick={toggle} className={cn(listening && "bg-destructive/10 text-destructive animate-pulse")}>
      <MicIcon className="size-4" />
    </PromptInputButton>
  )
}
// 模型选择：名字 + 一句说明。换项目时改这个列表；选中的值随 onSend 一起交给后端
export const models = [
  { id: "auto", name: "Auto", hint: "自动选择" },
  { id: "fast", name: "快速", hint: "简单问题，响应快" },
  { id: "deep", name: "深度", hint: "复杂问题，想得更久" },
]

// 输入框：多行文字（Enter 发送，Shift+Enter 换行）、图片和文件（点「+」选、直接粘贴、拖进来）、截屏、语音。
export function Composer({ busy, onSend, onStop }: {
  busy: boolean
  onSend: (text: string, files: ChatFile[], model: string) => void
  onStop: () => void
}) {
  const [model, setModel] = useState(models[0].id)
  return (
    <PromptInputProvider>
      <PromptInput
        multiple
        globalDrop
        maxFiles={6}
        maxFileSize={10 * 1024 * 1024}
        onError={(err) => toast.error(err.code === "max_files" ? "最多 6 个附件" : err.code === "max_file_size" ? "单个文件不能超过 10 MB" : "不支持这种文件")}
        onSubmit={({ text, files }) => {
          if (busy || (!text.trim() && files.length === 0)) return
          onSend(text, files.map((f) => ({ name: f.filename ?? "文件", type: f.mediaType, url: f.url })), model)
        }}
        // 外框由内部的 InputGroup 画：改成大圆角、淡阴影，聚焦时只换边框色，不要那圈粗的 ring
        className="[&>[data-slot=input-group]]:rounded-2xl [&>[data-slot=input-group]]:bg-card [&>[data-slot=input-group]]:shadow-sm [&>[data-slot=input-group]]:has-[[data-slot=input-group-control]:focus-visible]:ring-0 [&>[data-slot=input-group]]:has-[[data-slot=input-group-control]:focus-visible]:border-foreground/30"
      >
        <AttachmentRow />
        <PromptInputBody>
          <PromptInputTextarea placeholder="问点什么，或粘贴、拖入图片和文件…" className="max-h-48 min-h-12 px-4 pt-4 text-base md:text-sm" />
        </PromptInputBody>
        {/* 左边放常用的「+」；右边依次是模型选择、语音（少用）、发送 */}
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger tooltip="添加"><PlusIcon className="size-4" /></PromptInputActionMenuTrigger>
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments label="添加图片或文件" />
                <PromptInputActionAddScreenshot label="截取屏幕" />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputTools>
            <PromptInputSelect value={model} onValueChange={setModel}>
              <PromptInputSelectTrigger aria-label="选择模型" className="h-8 w-auto gap-1 px-2 text-xs"><PromptInputSelectValue>{models.find((m) => m.id === model)?.name}</PromptInputSelectValue></PromptInputSelectTrigger>
              <PromptInputSelectContent align="end">
                {models.map((m) => (
                  <PromptInputSelectItem key={m.id} value={m.id}>
                    {m.name}<span className="ml-2 text-xs text-muted-foreground">{m.hint}</span>
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
            <VoiceButton />
            <SendButton busy={busy} onStop={onStop} />
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  )
}
