<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Rehkitz Rettung</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="authStore.user" @click="authStore.logout">
        Abmelden
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <LoginView v-if="!authStore.user" />
        <template v-else>
          <FarmerView v-if="authStore.user.type === 'farmer'" />
          <RescuerView v-if="authStore.user.type === 'rescuer'" />
          <AdminView v-if="authStore.user.type === 'admin'" />
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>