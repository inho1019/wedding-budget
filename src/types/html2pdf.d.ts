declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type: string; quality: number }
    html2canvas?: Record<string, unknown>
    jspdf?: { unit?: string; format?: string; orientation?: string }
    pagebreak?: { mode?: string[]; before?: string[]; after?: string[]; avoid?: string[] }
  }

  interface Html2Pdf extends Partial<Html2PdfOptions> {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement): Html2Pdf
    save(): Promise<void>
  }

  interface Html2PdfFactory {
    (options?: Html2PdfOptions): Html2Pdf
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement): Html2Pdf
    save(): Promise<void>
  }

  const html2pdf: Html2PdfFactory
  export default html2pdf
}
