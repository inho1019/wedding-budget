import { formatMan } from '@/shared/lib/format'

interface RatioSliderProps {
  total: number // 예랑+예신 합계 금액
  ratio: number // 신부 비율 (%) - 0~100, 기본 50
  onChange: (ratio: number) => void
}

// 신랑/신부 금액 분할 슬라이더 - 슬라이더로 좌우 비율 조절 (만원 표시)
export const RatioSlider = ({ total, ratio, onChange }: RatioSliderProps) => {
  const clamped = Math.max(0, Math.min(100, ratio ?? 50))
  const shiran = Math.round(total * (100 - clamped) / 100)
  const shinbu = Math.round(total * clamped / 100)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2 text-sm font-medium">
        <span className="text-amber-700 tabular-nums min-w-0 truncate">{formatMan(shiran)}</span>
        <span className="text-sm font-medium text-ink-300 tabular-nums shrink-0">
          {100 - clamped}% : {clamped}%
        </span>
        <span className="text-amber-700 tabular-nums min-w-0 truncate">{formatMan(shinbu)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={clamped}
        onChange={(event) => onChange(parseInt(event.target.value, 10) || 0)}
        className="ratio-slider w-full"
        title="신랑/신부 비율"
        aria-label="신랑/신부 비율"
      />
    </div>
  )
}
