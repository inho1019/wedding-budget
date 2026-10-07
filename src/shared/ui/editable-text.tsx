import { useEffect, useRef, useState } from 'react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// 더블클릭 / 꾹 누름(long press)으로 편집하는 텍스트 (항목/대소분류 명칭)
export const EditableText = ({ value, onChange, placeholder, className }: EditableTextProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    setEditing(false)
    const trimmed = draft.trim()
    onChange(trimmed.length ? trimmed : value)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit()
          if (event.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
        onBlur={commit}
        className={`bg-amber-50 outline-none rounded px-2 py-1 text-sm font-semibold text-ink-900 ${className ?? ''}`}
      />
    )
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      onPointerDown={() => {
        pressTimer.current = setTimeout(() => setEditing(true), 400)
      }}
      onPointerUp={() => pressTimer.current && clearTimeout(pressTimer.current)}
      onPointerLeave={() => pressTimer.current && clearTimeout(pressTimer.current)}
      title="더블클릭 / 꾹 누름으로 수정"
      className={`cursor-pointer rounded px-2 py-1 hover:bg-slate-100 transition-colors ${className ?? ''}`}
    >
      {value || <span className="text-ink-300 italic">{placeholder ?? '미설정'}</span>}
    </div>
  )
}
