import type { Item } from "@/features/budget/model/types";
import { AmountInput } from "@/shared/ui/amount-input";
import { EditableText } from "@/shared/ui/editable-text";
import { RatioSlider } from "@/shared/ui/ratio-slider";
import { useConfirm } from "@/shared/ui/modal";

interface ItemRowProps {
  item: Item;
  onRename: (name: string) => void;
  onSetSplit: (value: number) => void;
  onSetSaved: (value: number) => void;
  onSetGoal: (value: number) => void;
  onDelete: () => void;
}

// 세부 예산 행 - 사용자가 수정하는 노란 영역
export const ItemRow = ({
  item,
  onRename,
  onSetSplit,
  onSetSaved,
  onSetGoal,
  onDelete,
}: ItemRowProps) => {
  const { confirm } = useConfirm();

  const handleDelete = () => {
    confirm({
      title: "항목을 삭제합니다",
      message: `'${item.name}' 항목을 삭제합니다. 삭제하면 복구할 수 없습니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      danger: true,
    }).then((ok) => {
      if (ok) onDelete();
    });
  };

  return (
    <tr className="border-t border-slate-100 hover:bg-amber-50/40 transition-colors">
      <td className="px-1 py-1 align-middle min-w-0 max-w-[45%] whitespace-normal break-words">
        <EditableText
          value={item.name}
          onChange={onRename}
          className="text-left text-sm"
        />
      </td>
      <td className="sr-only md:not-sr-only md:w-52 py-1 md:py-2 align-middle">
        <RatioSlider
          total={item.couple + item.saved}
          ratio={item.split}
          onChange={(ratio) => onSetSplit(ratio)}
        />
      </td>
      <td className="px-1 py-1 md:py-2 align-middle w-28 md:w-32 text-right">
        <AmountInput
          value={item.saved}
          onChange={onSetSaved}
          className="text-xs md:text-sm"
        />
      </td>
      <td className="px-1 py-1 md:py-2 align-middle w-28 text-right">
        <AmountInput
          value={item.goal}
          onChange={onSetGoal}
          color={item.saved > item.goal ? "red" : "default"}
          className="text-xs md:text-sm"
        />
      </td>
      <td className="px-1 py-0.5 md:py-1 align-middle w-3 text-right">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex h-full w-full items-center justify-end opacity-100 sm:opacity-0 hover:opacity-100 px-2 text-ink-300 hover:text-red-500 transition-all cursor-pointer text-xs"
          title="삭제"
          aria-label="항목 삭제"
        >
          ✕
        </button>
      </td>
    </tr>
  );
};
