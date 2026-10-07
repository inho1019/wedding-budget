// 금액 포매팅 (한국 원화, 쉼표 포함)
export const formatWon = (n: number): string => {
  const value = Math.round(n || 0)
  const sign = value < 0 ? '-' : ''
  return sign + Math.abs(value).toLocaleString('en-US')
}

export const formatWonFull = (n: number): string => `${formatWon(n)}₩`

// 숫자 입력 처리 (빈문자/숫자 외 제거)
export const parseNum = (raw: string): number => {
  const cleaned = raw.replace(/[^0-9]/g, '')
  if (!cleaned) return 0
  return parseInt(cleaned, 10) || 0
}

// 최대 입력 단위: 억 (9억 구천구구구구구)
export const MAX_WON = 999999999

// 만원 단위로 변환 (예: 600000 -> "60만")
export const formatMan = (n: number): string => {
  const value = Math.round(n || 0)
  return `${Math.round(value / 10000)}만`
}
