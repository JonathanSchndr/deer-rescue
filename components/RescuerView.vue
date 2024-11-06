<template>
  <div>
    <h2 class="text-h4 mb-4">
      Willkommen {{ authStore.user?.name }}
    </h2>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Zugewiesene Felder</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="field in fieldsStore.rescuerFields"
                :key="field.id"
                :active="selectedField?.id === field.id"
                @click="selectField(field)"
              >
                <v-list-item-title>
                  {{ field.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Status: {{ field.checkedAt ? `Zuletzt abgeflogen am ${new Date(field.checkedAt).toLocaleDateString()}` : 'Noch nicht abgeflogen' }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    color="success"
                    @click.stop="markFieldChecked(field.id)"
                  >
                    Abgeflogen
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <FieldMap 
              ref="mapRef" 
              :initial-polygon="selectedField?.coordinates"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const fieldsStore = useFieldsStore()
const selectedField = ref(null)

const selectField = (field) => {
  selectedField.value = field
}

const markFieldChecked = (fieldId: string) => {
  if (confirm('Möchten Sie dieses Feld als abgeflogen markieren?')) {
    fieldsStore.markFieldChecked(fieldId)
  }
}

// Load fields when component mounts
onMounted(async () => {
  await fieldsStore.fetchFields()
  if (fieldsStore.rescuerFields.length > 0) {
    selectField(fieldsStore.rescuerFields[0])
  }
})
</script>