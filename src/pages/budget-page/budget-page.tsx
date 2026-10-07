import { useState } from 'react'
import { useBudgetStore } from '@/features/budget/model/budget-store'
import { grandTotal } from '@/features/budget/model/calc'
import { encodeBudget } from '@/features/budget/model/budget-storage'
import { useConfirm } from '@/shared/ui/modal'
import { exportElementToPdf } from '@/shared/lib/pdf-export'
import { MajorCategory } from '@/features/budget/ui/major-category'

export const BudgetPage = () => {
  const { budget, actions } = useBudgetStore()
  const { confirm } = useConfirm()
  const [copied, setCopied] = useState(false)
  const total = grandTotal(budget)
  const totalPct = total.total > 0 ? Math.min(100, Math.round((total.saved / total.total) * 100)) : 0

  const handleCopy = async () => {
    const url = encodeBudget(budget)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePdfDownload = async () => {
    const el = document.querySelector<HTMLElement>('#budget-table')
    if (!el) {
      alert('출력할 예산표가 없습니다.')
      return
    }
    try {
      await exportElementToPdf(el, '결혼-예산표.pdf')
    } catch (err) {
      console.error(err)
      alert('PDF 생성 중 오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    confirm({
      title: '혼전 예산을 초기화합니다',
      message: '지금까지 작성된 모든 카테고리·항목이 삭제됩니다. 복원할 수 없습니다.',
      confirmText: '초기화',
      cancelText: '취소',
      danger: true,
    }).then((ok) => {
      if (ok) actions.load({ majorCategories: [] })
    })
  }

  const handleApplyTemplate = () => {
    confirm({
      title: '기본 템플릿을 적용합니다',
      message: '기존 데이터를 덮어씁니다. 지금까지 작성된 내용이 모두 삭제됩니다.',
      confirmText: '적용',
      cancelText: '취소',
      danger: true,
    }).then((ok) => {
      if (ok) actions.applyTemplate()
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-ink-900 leading-tight">결혼 예산표</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleCopy} className="btn-primary text-xs px-3 py-1.5">
              {copied ? (
                <span className="text-amber-200">복사 완료!</span>
              ) : (
                '공유'
              )}
            </button>
            <button type="button" onClick={handlePdfDownload} className="btn-ghost text-xs px-3 py-1.5" title="PDF 다운로드" aria-label="PDF 다운로드">
              PDF 다운로드
            </button>
            <button type="button" onClick={handleReset} className="btn-ghost text-xs px-3 py-1.5" title="초기화" aria-label="초기화">
              초기화
            </button>
          </div>
        </div>
      </header>

      {/* 요약 바 */}
      <div className="max-w-4xl mx-auto px-4 pt-5">
        <div className="card overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-ink-300">전체 예산</div>
                <div className="text-2xl font-bold text-ink-900 tabular-nums mt-0.5">
                  {total.total.toLocaleString('en-US')}<span className="text-base font-medium text-ink-300 ml-1">₩</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div>
                  <div className="text-[11px] font-medium text-ink-300">모은 돈</div>
                  <div className="text-sm font-semibold text-slate-500 tabular-nums">{total.saved.toLocaleString('en-US')}</div>
                </div>
              </div>
            </div>

            {/* 프로그레스 */}
            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${totalPct}%` }}
              />
            </div>
            <div className="mt-1.5 text-[11px] text-ink-300 text-right">모은 돈 비율 {totalPct}%</div>
          </div>
        </div>
      </div>

      {/* 예산 표 */}
      <main id="budget-table" className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        {budget.majorCategories.length === 0 && (
          <div className="card px-5 py-10 text-center text-sm text-ink-300">
            카테고리가 없습니다. 위에 “+ 카테고리”를 눌러 추가하세요.
          </div>
        )}
        {budget.majorCategories.map((major) => (
          <MajorCategory key={major.id} major={major} />
        ))}

        <button
          type="button"
          onClick={() => actions.addMajor()}
          className="w-full card border-dashed border-2 border-slate-200 text-ink-500 hover:border-amber-300 hover:text-amber-700 font-medium text-sm py-3 transition-colors cursor-pointer"
        >
          + 카테고리 추가
        </button>
        <button
          type="button"
          onClick={handleApplyTemplate}
          className="w-full card border-dashed border-2 border-slate-200 text-ink-500 hover:border-amber-300 hover:text-amber-700 font-medium text-sm py-3 transition-colors cursor-pointer"
        >
          기본 템플릿 설정
        </button>
      </main>
    </div>
  )
}
