import { useEffect, useState } from 'react'
import { useBudgetStore } from '@/features/budget/model/budget-store'
import { decodeFromHash, readFromSessionCookie, saveToSessionCookie } from '@/features/budget/model/budget-storage'
import { ConfirmProvider, useConfirm } from '@/shared/ui/modal'
import { BudgetPage } from '@/pages/budget-page'
import { encodeBudget } from '@/features/budget/model/budget-storage'

// 앱 프로바이더: 상태 동기화 + 공유 링크 확인 + 페이지 렌더링
export const Providers = () => (
  <ConfirmProvider>
    <ProvidersInner />
  </ConfirmProvider>
)

const ProvidersInner = () => {
  const budget = useBudgetStore((state) => state.budget)
  const { confirm, Dialog } = useConfirm()
  const { load } = useBudgetStore((s) => s.actions)
  const [resolved, setResolved] = useState(false)

  // 공유 링크로 열렸을 때만: 저장된 데이터와 다르면 덮어쓰기 전에 확인받는다.
  // 저장된 데이터와 공유된 데이터가 같으면 확인 없이 스킵한다.
  useEffect(() => {
    const fromHash = decodeFromHash(window.location.hash)
    if (!fromHash) {
      setResolved(true)
      return
    }

    const fromCookie = readFromSessionCookie()
    // 쿠키 데이터가 없으면 확인 없이 공유 데이터로 진행한다
    if (!fromCookie) {
      setResolved(true)
      return
    }

    // 두 데이터가 동일하면 덮어쓰기 똑같이 같으므로 스킵
    if (JSON.stringify(fromHash) === JSON.stringify(fromCookie)) {
      setResolved(true)
      return
    }

    // 다른 데이터가 존재 → 덮어쓰기 확인
    confirm({
      title: '공유된 데이터를 불러옵니다',
      message:
        '이전에 저장된 데이터가 있다면 삭제되고, 공유된 데이터로 대체됩니다. ' +
        '공유된 데이터로 교체하시겠습니까?',
      confirmText: '공유된 데이터로 대체',
      cancelText: '내 데이터 유지',
      danger: true,
    }).then((accepted) => {
      // 확인 → 공유 데이터 유지(이미 로드됨), 취소 → 저장된 데이터 복원
      load(accepted ? fromHash : fromCookie)
      setResolved(true)
    })
  }, [])

  // resolved 전에는 저장/인코딩을 멈춰 확정 전까지 상태가 흔들리지 않도록 한다.
  useEffect(() => {
    if (!resolved) return
    saveToSessionCookie(budget)
    window.history.replaceState(null, '', encodeBudget(budget))
  }, [budget, resolved])

  return (
    <>
      {Dialog}
      <BudgetPage />
    </>
  )
}
