<template>
  <div>
    <h2 class="text-h4 mb-4">
      Willkommen {{ authStore.user?.name }}
    </h2>

    <v-tabs v-model="activeTab">
      <v-tab value="list">Felderliste</v-tab>
      <v-tab value="map">Neues Feld</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item value="list">
        <v-card class="mt-4">
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Letzter Abflug</th>
                  <th>Abgeflogen von</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in fieldsStore.farmerFields" :key="field.id">
                  <td>{{ field.name }}</td>
                  <td>
                    <v-chip
                      :color="field.checkedAt ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ field.checkedAt ? 'Abgeflogen' : 'Ausstehend' }}
                    </v-chip>
                  </td>
                  <td>{{ field.checkedAt ? new Date(field.checkedAt).toLocaleString() : '-' }}</td>
                  <td>{{ field.checkedBy || '-' }}</td>
                  <td>
                    <v-btn icon size="small" color="error" @click="deleteField(field.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon size="small" class="ml-2" @click="showFieldOnMap(field)">
                      <v-icon>mdi-map-marker</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="showMapDialog" max-width="800">
          <v-card>
            <v-card-title>{{ selectedField?.name }}</v-card-title>
            <v-card-text>
              <FieldMap :initial-polygon="selectedField?.coordinates" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="showMapDialog = false">
                Schließen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-window-item>

      <v-window-item value="map">
        <v-card class="mt-4">
          <v-card-text>
            <FieldMap
              editable
              @update:coordinates="coordinates = $event"
            />

            <v-form @submit.prevent="saveField" class="mt-4">
              <v-text-field
                v-model="fieldName"
                label="Feldname"
                required
              ></v-text-field>
              <v-btn 
                type="submit" 
                color="primary"
                :disabled="!coordinates.length || !fieldName"
              >
                Speichern
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const fieldsStore = useFieldsStore()

const activeTab = ref('list')
const coordinates = ref<number[][]>([])
const fieldName = ref('')
const showMapDialog = ref(false)
const selectedField = ref(null)

const saveField = async () => {
  if (coordinates.value.length < 3 || !fieldName.value) {
    alert('Bitte zeichnen Sie ein Feld ein und geben Sie einen Namen an')
    return
  }

  await fieldsStore.addField(coordinates.value, fieldName.value)
  coordinates.value = []
  fieldName.value = ''
}

const deleteField = async (fieldId: string) => {
  if (confirm('Möchten Sie dieses Feld wirklich löschen?')) {
    await fieldsStore.deleteField(fieldId)
  }
}

const showFieldOnMap = (field) => {
  selectedField.value = field
  showMapDialog.value = true
}

// Load fields when component mounts
onMounted(async () => {
  await fieldsStore.fetchFields()
})
</script>