import { useBudgetStore } from "@/features/budget/model/budget-store";
import type { MajorCategory as MajorCategoryModel } from "@/features/budget/model/types";
import { majorTotals } from "@/features/budget/model/calc";
import { SubCategory } from "@/features/budget/ui/sub-category";
import { EditableText } from "@/shared/ui/editable-text";
import { PlusIcon } from "@/shared/ui/icons";
import { useConfirm } from "@/shared/ui/modal";

interface MajorCategoryProps {
  major: MajorCategoryModel;
}

// 카테고리 카드
export const MajorCategory = ({ major }: MajorCategoryProps) => {
  const { actions } = useBudgetStore();
  const { confirm } = useConfirm();
  const totals = majorTotals(major);

  const handleDelete = () => {
    confirm({
      title: "카테고리를 삭제합니다",
      message: `'${major.name}' 카테고리를 삭제합니다. 삭제하면 복구할 수 없습니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      danger: true,
    }).then((ok) => {
      if (ok) actions.deleteMajor(major.id);
    });
  };

  return (
    <section className="card overflow-hidden">
      {/* 카테고리 헤더 */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-1 h-5 rounded-full bg-amber-400" />
          <EditableText
            value={major.name}
            onChange={(name) => actions.renameMajor(major.id, name)}
            placeholder="새 카테고리"
            className="text-base font-bold text-ink-900"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-right shrink-0 flex-col md:flex-row">
            <div className="text-sm font-bold text-slate-500 backdrop:tabular-nums">
              {totals.saved.toLocaleString("en-US")}
            </div>
            <div className="text-sm font-bold text-ink-900 tabular-nums">
              <span className="text-xs">&nbsp;\&nbsp;</span>
              {totals.total.toLocaleString("en-US")}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => actions.addSub(major.id)}
              className="btn-amber text-xs px-2 py-1 cursor-pointer"
              title="구분 추가"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-ghost text-xs px-2 py-1 cursor-pointer"
              title="카테고리 삭제"
              aria-label="카테고리 삭제"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* 표 */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-sm font-medium text-ink-300 border-b border-slate-100">
            <th className="px-3 py-2 text-left font-medium min-w-0">항목</th>
            <th className="hidden md:table-cell py-2 md:w-52 text-left">
              <div className="flex items-center justify-between gap-2 text-sm font-medium">
                <span>신랑</span>
                <span>신부</span>
              </div>
            </th>
            <th className="px-1 py-2 text-right text-sm font-medium w-32">
              모은 돈
            </th>
            <th className="px-1 md:px-2 py-2 text-right text-sm font-medium w-28">
              목표액
            </th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {major.subCategories.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-ink-300"
              >
                구분을 추가하세요
              </td>
            </tr>
          )}
          {major.subCategories.map((sub) => (
            <SubCategory key={sub.id} major={major} sub={sub} />
          ))}
        </tbody>
      </table>
    </section>
  );
};
