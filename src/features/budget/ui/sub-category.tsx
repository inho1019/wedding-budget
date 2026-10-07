import { useRef } from "react";
import { useBudgetStore } from "@/features/budget/model/budget-store";
import type { BudgetAction } from "@/features/budget/model/budget-store";
import type {
  Item,
  MajorCategory,
  SubCategory as SubCategoryModel,
} from "@/features/budget/model/types";
import { subTotals } from "@/features/budget/model/calc";
import { ItemRow } from "@/features/budget/ui/item-row";
import { EditableText } from "@/shared/ui/editable-text";
import { ChevronDownIcon, PlusIcon } from "@/shared/ui/icons";
import { useConfirm } from "@/shared/ui/modal";
import { useToast } from "@/shared/ui/toast";

interface SubCategoryProps {
  major: MajorCategory;
  sub: SubCategoryModel;
}

// 구분 섹션: 구분명 + 세부 항목들 + 구분 합계
export const SubCategory = ({ major, sub }: SubCategoryProps) => {
  const { actions } = useBudgetStore();
  const { confirm } = useConfirm();
  const { toast } = useToast();
  const totals = subTotals(sub);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const setItem = (itemId: string, field: BudgetAction, value: number) => {
    actions.setItem(major.id, sub.id, itemId, field, value);
  };

  const handleDelete = () => {
    confirm({
      title: "구분을 삭제합니다",
      message: `'${sub.name}' 구분을 삭제합니다. 삭제하면 복구할 수 없습니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      danger: true,
    }).then((ok) => {
      if (ok) {
        actions.deleteSub(major.id, sub.id);
        toast(`'${sub.name}' 구분을 삭제했어요`);
      }
    });
  };

  return (
    <tr>
      <td colSpan={5} className="align-middle">
        {/* 구분과 그 하위 항목을 묶어 열고 닫기 가능하게 함 */}
        <details className="category-details" open ref={detailsRef}>
          {/* 구분 라벨 행 (열고 닫기 클릭 영역) */}
          <summary className="list-none cursor-pointer">
            <div className="w-full flex items-center justify-between gap-2 bg-slate-50/80 px-2 py-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <ChevronDownIcon className="chevron text-ink-300 shrink-0" />
                <EditableText
                  value={sub.name}
                  onChange={(name) => actions.renameSub(major.id, sub.id, name)}
                  placeholder="새 구분"
                  className="text-left text-sm font-semibold text-ink-700"
                />
              </div>
              <div className="flex items-center gap-1 justify-end shrink-0">
                <button
                  type="button"
                  onClick={(event) => {
                    // details 토글(닫기)을 방지하고 열려 있도록 유지
                    event.preventDefault();
                    event.stopPropagation();
                    if (detailsRef.current) detailsRef.current.open = true;
                    actions.addItem(major.id, sub.id);
                    toast("항목을 추가했어요");
                  }}
                  className="btn-amber text-xs px-2 py-1 opacity-70 hover:opacity-100 cursor-pointer whitespace-nowrap"
                  aria-label="세부 항목 추가"
                  title="세부 항목 추가"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  항목
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn-ghost text-xs px-2 py-1 opacity-70 hover:opacity-100 cursor-pointer"
                  title="구분 삭제"
                  aria-label="구분 삭제"
                >
                  ✕
                </button>
              </div>
            </div>
          </summary>

          {/* 하위 항목 + 구분 합계 (열리면 표시) */}
          <table className="w-full border-collapse">
            <tbody>
              {/* 세부 항목 행 */}
              {sub.items.map((item: Item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onRename={(name) =>
                    actions.renameItem(major.id, sub.id, item.id, name)
                  }
                  onSetSplit={(value) => setItem(item.id, "split", value)}
                  onSetSaved={(value) => setItem(item.id, "saved", value)}
                  onSetGoal={(value) => setItem(item.id, "goal", value)}
                  onDelete={() => actions.deleteItem(major.id, sub.id, item.id)}
                />
              ))}

              {/* 구분 합계 행 */}
              <tr className="border-t border-slate-200 bg-slate-100">
                <td className="px-3 py-2 align-middle min-w-0 max-w-[45%] whitespace-normal break-words text-sm font-medium text-ink-700">
                  합계
                </td>
                <td className="px-2 py-2" />
                <td className="px-2 py-2 text-right text-sm font-medium text-ink-500 tabular-nums">
                  {totals.saved.toLocaleString("en-US")}
                </td>
                <td className="px-2 py-2 text-right text-sm font-semibold text-ink-700 tabular-nums">
                  {totals.total.toLocaleString("en-US")}
                </td>
                <td className="px-2 py-2 w-10" />
              </tr>
            </tbody>
          </table>
        </details>
      </td>
    </tr>
  );
};
