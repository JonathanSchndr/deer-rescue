import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Field {
  id: string
  farmerId: string
  coordinates: number[][]
  name: string
  createdAt: string
  assignedTo?: number | null
  checkedAt?: string
  checkedBy?: string
  checkHistory?: {
    date: string
    checkedBy: string
  }[]
}

export const useFieldsStore = defineStore('fields', {
  state: () => ({
    fields: [] as Field[]
  }),
  getters: {
    farmerFields: (state) => {
      const authStore = useAuthStore()
      return state.fields.filter(
        field => field.farmerId === `${authStore.user?.name}-${authStore.user?.birthDate}`
      )
    },
    rescuerFields: (state) => {
      const authStore = useAuthStore()
      return state.fields.filter(
        field => field.assignedTo === authStore.user?.id
      )
    },
    allFields: (state) => state.fields
  },
  actions: {
    async fetchFields() {
      const { data } = await useFetch('/api/fields')
      if (data.value) {
        this.fields = data.value as Field[]
      }
    },
    async addField(coordinates: number[][], name: string) {
      const authStore = useAuthStore()
      const field: Field = {
        id: Date.now().toString(),
        farmerId: `${authStore.user?.name}-${authStore.user?.birthDate}`,
        coordinates,
        name,
        createdAt: new Date().toISOString(),
        checkHistory: []
      }
      
      await useFetch('/api/fields', {
        method: 'POST',
        body: field
      })
      
      this.fields.push(field)
    },
    async deleteField(fieldId: string) {
      await useFetch('/api/fields', {
        method: 'DELETE',
        body: { id: fieldId }
      })
      
      this.fields = this.fields.filter(f => f.id !== fieldId)
    },
    async assignField(fieldId: string, rescuerId: number | null) {
      const field = this.fields.find(f => f.id === fieldId)
      if (field) {
        const updatedField = {
          ...field,
          assignedTo: rescuerId
        }
        
        await useFetch('/api/fields', {
          method: 'PUT',
          body: updatedField
        })
        
        const index = this.fields.findIndex(f => f.id === fieldId)
        this.fields[index] = updatedField
      }
    },
    async markFieldChecked(fieldId: string) {
      const authStore = useAuthStore()
      const field = this.fields.find(f => f.id === fieldId)
      if (field) {
        const checkDate = new Date().toISOString()
        const checkedBy = authStore.user?.name
        
        // Add to check history
        if (!field.checkHistory) {
          field.checkHistory = []
        }
        
        field.checkHistory.push({
          date: checkDate,
          checkedBy
        })
        
        const updatedField = {
          ...field,
          checkedAt: checkDate,
          checkedBy
        }
        
        await useFetch('/api/fields', {
          method: 'PUT',
          body: updatedField
        })
        
        const index = this.fields.findIndex(f => f.id === fieldId)
        this.fields[index] = updatedField
      }
    }
  },
  persist: true
})