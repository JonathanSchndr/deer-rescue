import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createPersistedState({
    storage: process.client ? localStorage : null,
    key: prefix => `rehkitz-${prefix}`
  }))
})