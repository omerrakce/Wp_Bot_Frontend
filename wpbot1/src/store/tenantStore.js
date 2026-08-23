import { create } from 'zustand'

const useTenantStore = create((set) => ({
  companyId: 'tenant-001',
  companyName: 'ModaShop A.Ş.',
  plan: 'pro',
  setTenant: (data) => set(data),
  clearTenant: () => set({
    companyId: null,
    companyName: null,
    plan: null,
  }),
}))

export default useTenantStore