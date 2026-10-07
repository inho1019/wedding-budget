export const makeId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`
