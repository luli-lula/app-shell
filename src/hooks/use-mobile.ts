import * as React from "react"

const MOBILE_BREAKPOINT = 768
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// 订阅媒体查询；服务端渲染时按桌面处理
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
