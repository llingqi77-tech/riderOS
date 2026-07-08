import { create } from 'zustand'
import { CITIES, getCityData, type CityId, type CityProfile } from '@/mocks/cities'
import type { ExpenseCategory } from '@/types'

interface RiderState {
  city: CityId
  extraExpense: number
  extraIncome: number
  setCity: (city: CityId) => void
  cityData: () => CityProfile
  addExpense: (category: ExpenseCategory, amount: number) => void
  addIncome: (amount: number) => void
  netIncome: () => number
}

export const useRiderStore = create<RiderState>((set, get) => ({
  city: 'lagos',
  extraExpense: 0,
  extraIncome: 0,
  setCity: (city) =>
    set({ city, extraExpense: 0, extraIncome: 0 }),
  cityData: () => getCityData(get().city),
  addExpense: (_category, amount) =>
    set((s) => ({ extraExpense: s.extraExpense + amount })),
  addIncome: (amount) => set((s) => ({ extraIncome: s.extraIncome + amount })),
  netIncome: () => {
    const data = getCityData(get().city)
    return data.todaySnapshot.dailyIncome + get().extraIncome - get().extraExpense
  },
}))

export { CITIES, CITY_LIST } from '@/mocks/cities'
