import type { Budget, Item, ItemTotals, MajorCategory, SubCategory } from './types'

export const itemTotals = (item: Item): ItemTotals => ({
  couple: item.couple || 0,
  saved: item.saved || 0,
  total: item.goal || 0,
})

export const subTotals = (sub: SubCategory): ItemTotals => {
  const totals: ItemTotals = { couple: 0, saved: 0, total: 0 }
  for (const item of sub.items) {
    const itemTotal = itemTotals(item)
    totals.couple += itemTotal.couple
    totals.saved += itemTotal.saved
    totals.total += itemTotal.total
  }
  return totals
}

export const majorTotals = (major: MajorCategory): ItemTotals => {
  const totals: ItemTotals = { couple: 0, saved: 0, total: 0 }
  for (const sub of major.subCategories) {
    const subTotal = subTotals(sub)
    totals.couple += subTotal.couple
    totals.saved += subTotal.saved
    totals.total += subTotal.total
  }
  return totals
}

export const grandTotal = (budget: Budget): ItemTotals => {
  const totals: ItemTotals = { couple: 0, saved: 0, total: 0 }
  for (const major of budget.majorCategories) {
    const majorTotal = majorTotals(major)
    totals.couple += majorTotal.couple
    totals.saved += majorTotal.saved
    totals.total += majorTotal.total
  }
  return totals
}
