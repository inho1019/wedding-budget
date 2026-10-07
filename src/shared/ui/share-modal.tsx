import { useState } from "react";
import type { Budget } from "@/features/budget/model/types";
import {
  buildShareUrl,
  buildShareTitle,
  openKakaoShare,
  shareNative,
} from "@/features/budget/model/share";
import { Modal } from "@/shared/ui/modal";
import { useToast } from "@/shared/ui/toast";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  budget: Budget;
}

/**
 * 공유 모달 — "링크 공유" + "카카오 공유(별도 설정 없음)"
 *
 * - 링크 공유: 예산을 압축한 링크를复制或하거나 네이티브 공유 시트로 공유
 * - 카카오 공유: 앱 등록 카카오 공유 페이지를 열어 카카오톡으로 전송
 */
export const ShareModal = ({ open, onClose, budget }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = buildShareUrl(budget);
  const shareTitle = buildShareTitle(budget);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    await shareNative(shareUrl, shareTitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast("링크를 복사했어요");
  };

  const handleKakao = () => {
    openKakaoShare(shareUrl, shareTitle);
    // 카카오 공유 페이지가 새 탭으로 열리므로 모달은 바로 닫지 않고
    // 백드롭 클릭으로 닫힐 수 있도록 한다.
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-base font-bold text-ink-900">예산 공유</div>
      <div className="mt-2 text-sm leading-relaxed text-ink-600">
        현재 예산을 링크로 공유해요. 링크를 가진 사람이 열면 같은 내용을 확인할
        수 있어요.
      </div>

      <div className="mt-4 space-y-2.5">
        {/* 카카오 공유 — 별도 설정 불필요 */}
        <button
          type="button"
          onClick={handleKakao}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900
            font-semibold text-sm px-3 py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          카카오톡 공유
        </button>

        {/* 링크 공유 */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-2 btn-ghost text-sm px-3 py-3"
        >
          {copied ? <>링크를 복사했어요!</> : <>링크 복사</>}
        </button>
      </div>
    </Modal>
  );
};
