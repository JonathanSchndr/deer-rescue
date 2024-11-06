<template>
  <v-card class="mx-auto mt-5" max-width="500">
    <v-card-title>Anmeldung</v-card-title>
    
    <v-card-text>
      <v-tabs v-model="activeTab">
        <v-tab value="farmer">Landwirt</v-tab>
        <v-tab value="rescuer">Rehkitz Rettung</v-tab>
        <v-tab value="admin">Administrator</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Farmer Login -->
        <v-window-item value="farmer">
          <v-form @submit.prevent="loginFarmer">
            <v-text-field
              v-model="farmerName"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="birthDate"
              label="Geburtsdatum"
              type="date"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary" block>
              Anmelden
            </v-btn>
          </v-form>
        </v-window-item>

        <!-- Rescuer Login -->
        <v-window-item value="rescuer">
          <v-form @submit.prevent="loginRescuer">
            <v-text-field
              v-model="username"
              label="Benutzername"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Passwort"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary" block>
              Anmelden
            </v-btn>
          </v-form>
        </v-window-item>

        <!-- Admin Login -->
        <v-window-item value="admin">
          <v-form @submit.prevent="loginAdmin">
            <v-text-field
              v-model="username"
              label="Benutzername"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Passwort"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary" block>
              Anmelden
            </v-btn>
          </v-form>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const activeTab = ref('farmer')
const farmerName = ref('')
const birthDate = ref('')
const username = ref('')
const password = ref('')

const loginFarmer = () => {
  authStore.loginFarmer(farmerName.value, birthDate.value)
}

const loginRescuer = async () => {
  const success = await authStore.loginRescuer(username.value, password.value)
  if (!success) {
    alert('Ungültige Anmeldedaten')
  }
}

const loginAdmin = async () => {
  const success = await authStore.loginAdmin(username.value, password.value)
  if (!success) {
    alert('Ungültige Anmeldedaten')
  }
}
</script>