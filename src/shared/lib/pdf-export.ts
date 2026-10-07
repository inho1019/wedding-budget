import html2pdf from 'html2pdf.js'

/**
 * 주어진 DOM 엘리먼트를 PDF 파일로 변환해 다운로드합니다.
 *
 * @param element        PDF로 추출할 대상 엘리먼트 (또는 선택자 문자열)
 * @param fileName       다운로드할 파일명 (.pdf 포함, 기본값: document.pdf)
 */
export const exportElementToPdf = async (
  element: HTMLElement | string,
  fileName = 'wedding-budget.pdf',
): Promise<void> => {
  const target: HTMLElement =
    typeof element === 'string' ? document.querySelector(element)! : element

  if (!target) {
    throw new Error('PDF로 변환할 엘리먼트를 찾을 수 없습니다.')
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jspdf: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid', 'legacy'] },
  }

  // 일시적으로 스크롤 고정 (배경 스크롤 방지)
  const prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  try {
    await html2pdf()
      .set(opt)
      .from(target)
      .save()
  } finally {
    document.body.style.overflow = prevOverflow
  }
}
