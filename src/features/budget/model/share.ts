import { useCallback } from 'react'
import type { Budget } from './types'
import { encodeBudget } from './budget-storage'

/**
 * 공유 유틲
 *
 * "링크 공유" + "카카오 공유(별도 설정 없음)"를 제공합니다.
 *
 * 카카오 공유는 앱 등록(JS 키·REST 키 필요) 없이, 카카오가 제공하는
 * 공유 페이지 스킴(`https://kakaotalk.com/sharesend`)을 열어 구현합니다.
 * 따라서 별도 설정이 필요하지 않으며, 카카오톡 앱이 설치되어 있으면
 * 자동으로 앱 공유 화면로 연결됩니다.
 */

const SHARE_TITLE = '결혼 예산표'
const SHARE_DESCRIPTION = '결혼 예산을 함께 확인해보세요. 링크를 열면 그대로 반영돼요.'

// 공유할 링크 생성 (예산 데이터를 압축해 URL 해시에 담음)
export const buildShareUrl = (budget: Budget): string => encodeBudget(budget)

// 공유 카드 제목 (현재 전체 예산을 담아 동적으로 변경하면 좋아요)
export const buildShareTitle = (budget: Budget): string => {
  const total = budget.majorCategories.reduce((sum, m) => {
    return sum + m.subCategories.reduce((s, sub) => s + sub.items.reduce((i, it) => i + it.goal, 0), 0)
  }, 0)
  return total > 0 ? `결혼 예산 ${total.toLocaleString('en-US')}원 계획중` : SHARE_TITLE
}

/**
 * 카카오톡 공유 (별도 설정 불필요)
 *
 * 카카오 JS SDK 대신 공유 URL 스킴를 사용합니다.
 * - 데스크톱/웹: 카카오 공유 페이지 opens
 * - 모바일: 가능하다면 카카오톡 앱 딥링크로 연결, 안 되면 웹 페이지 사용
 */
export const openKakaoShare = (url: string, title: string): void => {
  const encoded = encodeURIComponent(url)

  // 1) 모바일에서 카카오톡 앱을 직접 열尝试 (폴백 포함)
  const deeplink = `kakaotalk://send?clientUrl=${encoded}&templateUrl=`
  const webFallback = `https://kakaotalk.com/sharesend?clientUrl=${encoded}`

  const openWeb = () => window.open(webFallback, '_blank', 'noopener,noreferrer')

  // 앱 열기가 실패하면 일정 시간 후 웹 페이지로 폴백
  let failed = false
  const fallbackTimer = setTimeout(openWeb, 1200)

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = deeplink
  document.body.appendChild(iframe)

  iframe.addEventListener('error', () => {
    failed = true
    clearTimeout(fallbackTimer)
    openWeb()
  })

  // 앱이 열렸는지 확인: blur 이벤트는 모바일에서 앱 이동 시 발생
  const onBlur = () => {
    // 앱으로 이동했으면 폴백 취소
    clearTimeout(fallbackTimer)
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    window.removeEventListener('blur', onBlur)
  }
  window.addEventListener('blur', onBlur, { once: true })

  // 모바일이 아니면 앱 열기 시도 없이 바로 웹 공유 페이지 열기
  const isMobile = /Android|iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)
  if (!isMobile) {
    failed = true
    clearTimeout(fallbackTimer)
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    window.removeEventListener('blur', onBlur)
    openWeb()
  }

  void title
}

/**
 * 네이티브 공유 시트 (iOS/Android) — 카카오·링크공유 등을 선택할 수 있는 시스템 공유 메뉴
 * 미지원 환경에서는 링크 복사로 폴백합니다.
 */
export const shareNative = async (url: string, title: string): Promise<void> => {
  const shareData = { title, url }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return
    } catch {
      // 사용자가 취소하거나 실패하면 아래 복사 처리
    }
  }
  await copyText(url)
}

const copyText = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}


