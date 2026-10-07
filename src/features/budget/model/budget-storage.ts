import LZString from 'lz-string'
import type { Budget } from './types'

const COOKIE_NAME = 'wedding_budget'
const HASH_KEY = '#wb='

const isValidBudget = (value: unknown): value is Budget =>
  !!value && typeof value === 'object' && Array.isArray((value as Budget).majorCategories)

// 공유용: 압축한 뒤 URL 해시에 담아 길이를 줄이고 정합성을 유지한다.
export const encodeBudget = (budget: Budget): string => {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(budget))
  return window.location.pathname + HASH_KEY + compressed
}

export const decodeFromHash = (hash: string): Budget | null => {
  if (!hash.includes(HASH_KEY)) return null
  try {
    const compressed = hash.slice(hash.indexOf(HASH_KEY) + HASH_KEY.length)
    const json = LZString.decompressFromEncodedURIComponent(compressed)
    if (!json) return null
    return isValidBudget(JSON.parse(json)) ? JSON.parse(json) : null
  } catch {
    return null
  }
}

// 세션 쿠키 저장 (브라우저를 닫을 때까지 유지)
export const saveToSessionCookie = (budget: Budget): void => {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(budget))
  document.cookie = `${COOKIE_NAME}=${compressed}; path=/; max-age=2419200; SameSite=Lax`
}

export const readFromSessionCookie = (): Budget | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  if (!match) return null
  try {
    const json = LZString.decompressFromEncodedURIComponent(match[1])
    if (!json) return null
    return isValidBudget(JSON.parse(json)) ? JSON.parse(json) : null
  } catch {
    return null
  }
}

export const clearSessionCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
