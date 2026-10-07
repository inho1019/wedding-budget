import { create } from 'zustand'
import type { Budget, Item } from './types'
import { decodeFromHash, readFromSessionCookie } from './budget-storage'
import { makeId } from './id'
import { buildBudgetFromTemplate } from './template'

export type BudgetAction = 'couple' | 'split' | 'saved' | 'goal'

export interface BudgetStore {
  budget: Budget
  actions: {
    load: (budget: Budget) => void
    applyTemplate: () => void
    addMajor: () => void
    deleteMajor: (majorId: string) => void
    renameMajor: (majorId: string, name: string) => void
    addSub: (majorId: string) => void
    deleteSub: (majorId: string, subId: string) => void
    renameSub: (majorId: string, subId: string, name: string) => void
    addItem: (majorId: string, subId: string) => void
    deleteItem: (majorId: string, subId: string, itemId: string) => void
    renameItem: (majorId: string, subId: string, itemId: string, name: string) => void
    setItem: (majorId: string, subId: string, itemId: string, field: BudgetAction, value: number) => void
  }
}

const emptyBudget: Budget = { majorCategories: [] }

const loadInitialBudget = (): Budget => {
  const fromHash = decodeFromHash(window.location.hash)
  if (fromHash) return fromHash
  const fromCookie = readFromSessionCookie()
  if (fromCookie) return fromCookie
  return emptyBudget
}

export const useBudgetStore = create<BudgetStore>()((set) => ({
  budget: loadInitialBudget(),
  actions: {
    load: (budget) => set(() => ({ budget })),

    applyTemplate: () => set(() => ({ budget: buildBudgetFromTemplate() })),

    addMajor: () => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: [...state.budget.majorCategories, { id: makeId('m'), name: '새 카테고리', subCategories: [] }],
      },
    })),

    deleteMajor: (majorId) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.filter((major) => major.id !== majorId),
      },
    })),

    renameMajor: (majorId, name) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) => (major.id === majorId ? { ...major, name } : major)),
      },
    })),

    addSub: (majorId) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? { ...major, subCategories: [...major.subCategories, { id: makeId('s'), name: '새 구분', items: [] }] }
            : major,
        ),
      },
    })),

    deleteSub: (majorId, subId) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? { ...major, subCategories: major.subCategories.filter((sub) => sub.id !== subId) }
            : major,
        ),
      },
    })),

    renameSub: (majorId, subId, name) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? { ...major, subCategories: major.subCategories.map((sub) => (sub.id === subId ? { ...sub, name } : sub)) }
            : major,
        ),
      },
    })),

    addItem: (majorId, subId) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? {
                ...major,
                subCategories: major.subCategories.map((sub) =>
                  sub.id === subId
                    ? { ...sub, items: [...sub.items, { id: makeId('i'), name: '새 항목', couple: 0, split: 50, saved: 0, goal: 0 }] }
                    : sub,
                ),
              }
            : major,
        ),
      },
    })),

    deleteItem: (majorId, subId, itemId) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? {
                ...major,
                subCategories: major.subCategories.map((sub) =>
                  sub.id === subId ? { ...sub, items: sub.items.filter((item: Item) => item.id !== itemId) } : sub,
                ),
              }
            : major,
        ),
      },
    })),

    renameItem: (majorId, subId, itemId, name) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? {
                ...major,
                subCategories: major.subCategories.map((sub) =>
                  sub.id === subId
                    ? { ...sub, items: sub.items.map((item) => (item.id === itemId ? { ...item, name } : item)) }
                    : sub,
                ),
              }
            : major,
        ),
      },
    })),

    setItem: (majorId, subId, itemId, field, value) => set((state) => ({
      budget: {
        ...state.budget,
        majorCategories: state.budget.majorCategories.map((major) =>
          major.id === majorId
            ? {
                ...major,
                subCategories: major.subCategories.map((sub) =>
                  sub.id === subId
                    ? { ...sub, items: sub.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)) }
                    : sub,
                ),
              }
            : major,
        ),
      },
    })),
  },
}))
