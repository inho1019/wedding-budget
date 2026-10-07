import type { SVGProps } from 'react'

// Plus 아이콘만 SVG로 유지, 나머지는 텍스트로 대체했습니다.
export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    className={`inline-block align-middle fill-current ${props.className ?? ''}`}
    fill="currentColor"
    {...props}
  >
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
)

// 꺽쇠(화살표) 아이콘 - <details> 열기/닫기 토글용으로 사용
export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    className={`inline-block fill-current ${props.className ?? ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 5l6 5-6 5" />
  </svg>
)
