// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'vuetify-nuxt-module'],
  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/css/main.css'],
  nitro: {
    preset: 'node',
  },
  vuetify: {
    moduleOptions: {
      /* vuetify module options */
      /* styles: { configFile: 'assets/css/main.css' } */
    },
    vuetifyOptions: {
      /* vuetify options */
      theme: {
        defaultTheme: 'light',
      },
    },
  },
  app: {
    head: {
      title: 'Rehkitz Rettung',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        },
      ],
      script: [
        {
          src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        },
      ],
    },
  }
});