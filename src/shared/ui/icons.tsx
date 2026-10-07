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
