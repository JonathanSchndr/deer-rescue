import { defineStore } from 'pinia'

interface User {
  id?: number
  name: string
  birthDate?: string
  type: 'farmer' | 'rescuer' | 'admin'
  username?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    loginFarmer(name: string, birthDate: string) {
      this.user = {
        name,
        birthDate,
        type: 'farmer'
      }
    },
    async loginRescuer(username: string, password: string) {
      const { data } = await useFetch('/api/auth', {
        method: 'POST',
        body: {
          type: 'rescuer',
          username,
          password
        }
      })
      
      if (data.value?.success) {
        this.user = data.value.user
        return true
      }
      return false
    },
    async loginAdmin(username: string, password: string) {
      const { data } = await useFetch('/api/auth', {
        method: 'POST',
        body: {
          type: 'admin',
          username,
          password
        }
      })
      
      if (data.value?.success) {
        this.user = data.value.user
        return true
      }
      return false
    },
    logout() {
      this.user = null
    }
  },
  persist: true
})