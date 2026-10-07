import { createContext, createElement, useContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* ------------------------------------------------------------------ */
/*  포탈(portal) 기반 공통 모달 래퍼                                    */
/* ------------------------------------------------------------------ */

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey as unknown as EventListener)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        // 백드롭 또는 바깥 클릭 시 닫기
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 p-5"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/* ------------------------------------------------------------------ */
/*  확인 모달                                                           */
/* ------------------------------------------------------------------ */

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  // 삭제·초기화 등 되돌릴 수 없는 위험 행동은 빨간색으로 표시
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  onConfirm: () => void
  onCancel: () => void
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  Dialog: ReactNode
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

// 확인 모달을 호출하는 훅. Promise를 반환해 "확인/취소" 결과를 기다릴 수 있다.
// ConfirmProvider 아래에서 사용해야 앱 전체의 단일 모달 상태를 공유할 수 있다.
export const useConfirm = (): ConfirmContextValue => {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  확인 제공자: 앱 전체에서 단일 모달 상태를 공유한다                   */
/* ------------------------------------------------------------------ */

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback(
    ({
      title,
      message,
      confirmText = '확인',
      cancelText = '취소',
      danger = false,
    }: ConfirmOptions): Promise<boolean> =>
      new Promise((resolve) => {
        setState({
          title,
          message,
          confirmText,
          cancelText,
          danger,
          onConfirm: () => {
            setState(null)
            resolve(true)
          },
          onCancel: () => {
            setState(null)
            resolve(false)
          },
        })
      }),
    [],
  )

  const Dialog = state ? (
    <ConfirmDialog
      open
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      danger={state.danger}
      onConfirm={state.onConfirm}
      onCancel={state.onCancel}
    />
  ) : null

  return createElement(ConfirmContext.Provider, { value: { confirm, Dialog } }, children)
}

/* ------------------------------------------------------------------ */
/*  실제 보이는 확인 다이얼로그                                         */
/* ------------------------------------------------------------------ */

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Modal open={open} onClose={onCancel}>
    <div className="text-base font-bold text-ink-900">{title}</div>
    <div className="mt-2 text-sm leading-relaxed text-ink-600">{message}</div>

    <div className="mt-5 flex gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 btn-ghost text-sm px-3 py-2.5"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className={`flex-1 text-sm px-3 py-2.5 rounded-xl font-medium transition-all active:scale-95 cursor-pointer ${
          danger
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-ink-900 text-white hover:bg-ink-700'
        }`}
      >
        {confirmText}
      </button>
    </div>
  </Modal>
)
