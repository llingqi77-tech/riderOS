import { create } from 'zustand'

export type Role = 'rider' | 'finance'

interface RoleState {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'rider',
  setRole: (role) => set({ role }),
}))
