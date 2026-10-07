import { useEffect, useState } from 'react'
import { parseNum, formatWon, MAX_WON } from '@/shared/lib/format'

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  readonly?: boolean
  max?: number
  color?: 'red' | 'default'
  className?: string
}

// 금액 입력 - 입력 중에는 원본 숫자, 확정 후 포맷 표시 (엑셀 느낌)
export const AmountInput = ({ value, onChange, readonly, max = MAX_WON, color, className }: AmountInputProps) => {
  const safeValue = value ?? 0
  const [draft, setDraft] = useState(safeValue)

  useEffect(() => {
    setDraft(value ?? 0)
  }, [value])

  const colorClass = color === 'red' ? 'text-red-500' : 'text-ink-700'

  if (readonly) {
    return <span className={`text-right text-sm font-medium ${colorClass} tabular-nums`}>{formatWon(safeValue)}</span>
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      max={max}
      value={draft.toLocaleString('en-US')}
      onChange={(event) => {
        const parsed = Math.min(MAX_WON, parseNum(event.target.value))
        setDraft(parsed)
        onChange(parsed)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === 'Tab') event.currentTarget.blur()
      }}
      onBlur={() => setDraft(value ?? 0)}
      className={`num-input tabular-nums ${color === 'red' ? 'text-red-500' : ''} ${className ?? ''}`.trim()}
      aria-label="금액"
    />
  )
}
