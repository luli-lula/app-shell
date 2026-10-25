// 演示数据：换项目时删掉，换成真实数据源
export type FileItem = {
  id: string
  title: string
  status: "草稿" | "进行中" | "已完成"
  owner: string
  updated: string
  summary: string
}

export const files: FileItem[] = [
  { id: "1", title: "用户访谈纪要 · 第 3 轮", status: "进行中", owner: "Lula", updated: "今天", summary: "6 位用户的访谈要点，按痛点归类，附原话。" },
  { id: "2", title: "竞品功能对比表", status: "已完成", owner: "Lula", updated: "昨天", summary: "5 个竞品在 12 个功能点上的对比和定价。" },
  { id: "3", title: "上线前检查清单", status: "草稿", owner: "Lula", updated: "10-23", summary: "品牌、落地页、法务、页面基础、质量、安全 6 项。" },
  { id: "4", title: "定价方案 v2", status: "草稿", owner: "Lula", updated: "10-20", summary: "免费版、个人版、团队版三档，附成本估算。" },
  { id: "5", title: "首页文案", status: "已完成", owner: "Lula", updated: "10-18", summary: "标题、副标题、四个能力和 FAQ。" },
  { id: "6", title: "数据看板需求", status: "进行中", owner: "Lula", updated: "10-15", summary: "周活、留存、关键事件三张图。" },
]

export const conversations = [
  { id: "c1", title: "竞品调研怎么入手", time: "今天" },
  { id: "c2", title: "首页文案改写", time: "昨天" },
  { id: "c3", title: "定价方案对比", time: "10-20" },
  { id: "c4", title: "访谈提纲检查", time: "10-18" },
]
