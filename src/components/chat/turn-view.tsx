import { AlertCircleIcon, CheckIcon, CopyIcon, FileTextIcon, Loader2Icon, RefreshCcwIcon } from "lucide-react"
import { toast } from "sonner"

import { Confirmation, ConfirmationAccepted, ConfirmationAction, ConfirmationActions, ConfirmationRejected, ConfirmationRequest, ConfirmationTitle } from "@/components/ai-elements/confirmation"
import { InlineCitation, InlineCitationCard, InlineCitationCardBody, InlineCitationCardTrigger, InlineCitationSource, InlineCitationText } from "@/components/ai-elements/inline-citation"
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/ai-elements/message"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task"
import { Button } from "@/components/ui/button"
import { FileChip } from "./file-chip"
import { answer, reasoningText, sources, type Turn } from "./mock-chat"

// 过程里的一行：图标 + 文字 + 右侧结果
function StepRow({ running, children, meta }: { running?: boolean; children: React.ReactNode; meta?: string }) {
  return (
    <TaskItem className="flex items-center gap-2">
      {running ? <Loader2Icon className="size-3.5 animate-spin" /> : <CheckIcon className="size-3.5" />}
      <span className="flex-1 truncate">{children}</span>
      {meta && <span className="text-xs">{meta}</span>}
    </TaskItem>
  )
}

// 一个回合 = 用户消息 + AI 回复。
// 只有三处有框：用户气泡、过程（合成一块）、需确认的动作；其余都是无框文字。
export function TurnView({ turn, onRetry, onDecide, onOpenArtifact }: {
  turn: Turn
  onRetry: () => void
  onDecide: (ok: boolean) => void
  onOpenArtifact: () => void
}) {
  const { phase } = turn
  const thinking = phase === "thinking"
  const approvalState = phase === "approval" ? "approval-requested" : "approval-responded"
  const answered = phase === "streaming" || phase === "done"

  // 逐字显示：引用角标等该句完整显示后再出现
  const parts = answer.map((seg, i) => {
    const start = answer.slice(0, i).reduce((n, x) => n + x.text.length, 0)
    const text = seg.text.slice(0, Math.max(0, turn.shown - start))
    return { seg, text, complete: turn.shown >= start + seg.text.length }
  })

  return (
    <div className="flex flex-col gap-5">
      <Message from="user">
        {turn.files && turn.files.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {turn.files.map((f, i) => <FileChip key={i} name={f.name} type={f.type} url={f.url} />)}
          </div>
        )}
        <MessageContent>{turn.prompt}</MessageContent>
      </Message>

      <Message from="assistant" className="max-w-full">
        <MessageContent className="w-full gap-4">
          <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-muted-foreground">
            <Reasoning isStreaming={thinking}>
              <ReasoningTrigger getThinkingMessage={(streaming, d) => streaming ? <Shimmer>思考中…</Shimmer> : <p>已思考 {d ?? 1} 秒</p>} />
              <ReasoningContent>{reasoningText}</ReasoningContent>
            </Reasoning>
            {phase !== "thinking" && (
              <Task defaultOpen className="mt-2">
                <TaskTrigger title={turn.toolRunning ? "正在检索…" : "检索了 2 步"} />
                <TaskContent className="mt-2 space-y-1.5">
                  <StepRow running={turn.toolRunning} meta={turn.toolRunning ? undefined : "8 条结果"}>搜索「记账工具」相关产品</StepRow>
                  {!turn.toolRunning && <StepRow>按多币种、账单导入、开源整理</StepRow>}
                </TaskContent>
              </Task>
            )}
          </div>

          {turn.wantsApproval && phase !== "thinking" && phase !== "tool" && (
            <Confirmation state={approvalState} approval={{ id: turn.id, approved: turn.approved }}>
              <ConfirmationTitle>
                <ConfirmationRequest>
                  要覆盖旧文件「记账工具竞品对比.md」，这个操作无法撤销。继续吗？
                </ConfirmationRequest>
                <ConfirmationAccepted>已确认，文件已覆盖。</ConfirmationAccepted>
                <ConfirmationRejected>已取消，没有改动文件。</ConfirmationRejected>
              </ConfirmationTitle>
              <ConfirmationActions>
                <ConfirmationAction variant="outline" onClick={() => onDecide(false)}>取消</ConfirmationAction>
                <ConfirmationAction onClick={() => onDecide(true)}>覆盖</ConfirmationAction>
              </ConfirmationActions>
            </Confirmation>
          )}

          {phase === "error" && (
            <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircleIcon className="size-4 shrink-0" />
              请求失败（模拟）。你的输入没有丢。
              <Button size="sm" variant="ghost" className="text-foreground" onClick={onRetry}><RefreshCcwIcon />重试</Button>
            </p>
          )}

          {phase === "stopped" && <p className="text-sm text-muted-foreground">已停止生成。</p>}

          {answered && (
            <p className="leading-relaxed">
              {parts.map(({ seg, text, complete }, i) =>
                seg.cite === undefined ? (
                  <span key={i}>{text}</span>
                ) : (
                  <InlineCitation key={i}>
                    <InlineCitationText>{text}</InlineCitationText>
                    {complete && (
                      <InlineCitationCard>
                        <InlineCitationCardTrigger sources={[sources[seg.cite].url]} />
                        <InlineCitationCardBody>
                          <div className="p-4"><InlineCitationSource {...sources[seg.cite]} /></div>
                        </InlineCitationCardBody>
                      </InlineCitationCard>
                    )}
                  </InlineCitation>
                ),
              )}
            </p>
          )}

          {phase === "done" && turn.approved !== false && (
            <>
              <Sources className="mb-0">
                <SourcesTrigger count={sources.length} />
                <SourcesContent>
                  {sources.map((s) => <Source key={s.url} href={s.url} title={s.title} />)}
                </SourcesContent>
              </Sources>
              <div className="space-y-1.5">
                <p className="text-xs tracking-wide text-muted-foreground">已生成 · 1</p>
                <button
                  onClick={onOpenArtifact}
                  className="flex w-full max-w-xs items-center gap-3 rounded-xl border px-3 py-2.5 text-left hover:bg-accent"
                >
                  <FileTextIcon className="size-5 text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">记账工具竞品对比.md</span>
                    <span className="block text-xs text-muted-foreground">点击在右侧查看</span>
                  </span>
                </button>
              </div>
              <MessageActions className="items-center text-muted-foreground">
                <MessageAction tooltip="复制" label="复制" onClick={() => { void navigator.clipboard.writeText(answer.map((s) => s.text).join("")); toast.success("已复制") }}><CopyIcon className="size-4" /></MessageAction>
                <span className="ml-1 text-xs">刚刚</span>
              </MessageActions>
            </>
          )}
        </MessageContent>
      </Message>
    </div>
  )
}
