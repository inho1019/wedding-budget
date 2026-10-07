import { createContext, ReactNode, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* ------------------------------------------------------------------ */
/*  포탈(portal) 기반 전역 토스트                                      */
/* ------------------------------------------------------------------ */

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  // fade-out 애니메이션 중인지 (transition이 끝났을 때 실제 삭제)
  exiting?: boolean
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// 토스트를 호출하는 훅. ToastProvider 위에서 사용해야 앱 전체에서 공통으로 사용할 수 있다.
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

const VARIANT_STYLE: Record<ToastVariant, string> = {
  info: 'bg-slate-800 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-500 text-white',
}

// 단일 토스트 UI
const Toast = ({ item, onExit }: { item: ToastItem; onExit: (id: number) => void }) => (
  <div
    role="status"
    aria-live="polite"
    className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-slate-900/20 transition-all duration-300 ease-out ${item.exiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'} animate-toast-in ${VARIANT_STYLE[item.variant]}`}
    onTransitionEnd={() => onExit(item.id)}
  >
    {item.message}
  </div>
)

// 토스트 제공자: 앱 전체에서 토스트 상태를 공유한다
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counterRef.current
    setToasts((prev) => [...prev, { id, message, variant }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // fade-out 애니메이션을 위해 opacity를 먼저 낮추고,
  // transition이 끝난 후에야 실제 목록에서 제거한다.
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    )
  }, [])

  const handleTransitionEnd = useCallback((id: number) => {
    setToasts((prev) => {
      const found = prev.find((t) => t.id === id && t.exiting)
      return found ? prev.filter((t) => t.id !== id) : prev
    })
  }, [removeToast])

  // 자동으로 사라지는 토스트 (info/success는 2.5초 후, warning/error는 3.5초 후)
  useEffect(() => {
    if (toasts.length === 0) return
    const latest = toasts[toasts.length - 1]
    // 이미 fade-out 중이면 무시
    if (latest.exiting) return
    const ms = latest.variant === 'info' ? 2500 : 3500
    const timer = setTimeout(() => dismissToast(latest.id), ms)
    return () => clearTimeout(timer)
  }, [toasts])

  const value = useMemo(() => ({ toast }), [])

  const portal =
    toasts.length > 0
      ? createPortal(
          <div className="fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 pointer-events-none">
            {toasts.map((item) => (
              <Toast key={item.id} item={item} onExit={handleTransitionEnd} />
            ))}
          </div>,
          document.body,
        )
      : null

  return <ToastContext.Provider value={value}>{children}{portal}</ToastContext.Provider>
}
