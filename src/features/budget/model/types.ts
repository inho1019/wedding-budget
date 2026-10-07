// 데이터 모델
// 항목(세부예산)은 사용자가 직접 수정하는 노란 영역입니다.
// 구분 / 카테고리의 합계는 이 항목들의 합계에서 자동 계산됩니다.

export interface Item {
  id: string
  name: string // 세부 항목명
  couple: number // 예랑+예신 (수입으로 내는 금액)
  split: number // 예신 비율 (%) - 0~100, 기본 50
  saved: number // 모은 돈
  goal: number // 목표액 (직접 입력)
}

export interface SubCategory {
  id: string
  name: string // 구분 (중분류) 명
  items: Item[]
}

export interface MajorCategory {
  id: string
  name: string // 카테고리 명
  subCategories: SubCategory[]
}

export interface Budget {
  majorCategories: MajorCategory[]
}

export interface ItemTotals {
  couple: number
  saved: number
  total: number
}
