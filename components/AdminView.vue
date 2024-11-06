<template>
  <div>
    <h2 class="text-h4 mb-4">Administrator Dashboard</h2>

    <v-tabs v-model="activeTab">
      <v-tab value="assignments">Team-Zuweisungen</v-tab>
      <v-tab value="overview">Feldübersicht</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Team-Zuweisungen -->
      <v-window-item value="assignments">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mb-4">
              <v-card-title>Rettungsteams</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="team in rescueTeams"
                    :key="team.id"
                  >
                    <v-list-item-title>
                      {{ team.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Zugewiesene Felder: {{ getTeamFieldCount(team.id) }}/{{ MAX_FIELDS_PER_TEAM }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>Feldzuweisungen</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th>Feldname</th>
                      <th>Landwirt</th>
                      <th>Zugewiesenes Team</th>
                      <th>Status</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="field in fieldsStore.allFields" :key="field.id">
                      <td>{{ field.name }}</td>
                      <td>{{ field.farmerId }}</td>
                      <td>
                        <v-select
                          v-model="field.assignedTo"
                          :items="rescueTeams"
                          item-title="name"
                          item-value="id"
                          label="Team auswählen"
                          :disabled="isTeamFullyLoaded(field.assignedTo, field.id)"
                          @update:model-value="assignField(field.id, $event)"
                          clearable
                        ></v-select>
                      </td>
                      <td>
                        <v-chip
                          :color="field.checkedAt ? 'success' : 'warning'"
                          small
                        >
                          {{ field.checkedAt ? 'Abgeflogen' : 'Ausstehend' }}
                        </v-chip>
                      </td>
                      <td>
                        <v-btn
                          v-if="field.assignedTo"
                          icon
                          small
                          color="error"
                          @click="unassignField(field.id)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Feldübersicht -->
      <v-window-item value="overview">
        <v-card>
          <v-card-title>
            Feldübersicht nach Landwirt
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Suchen"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="groupedFields"
              :search="search"
              group-by="farmerId"
            >
              <template v-slot:item.checkedAt="{ item }">
                {{ item.checkedAt ? new Date(item.checkedAt).toLocaleString() : '-' }}
              </template>
              <template v-slot:item.checkedBy="{ item }">
                {{ item.checkedBy || '-' }}
              </template>
              <template v-slot:item.assignedTo="{ item }">
                {{ getTeamName(item.assignedTo) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
const MAX_FIELDS_PER_TEAM = 5

const fieldsStore = useFieldsStore()
const activeTab = ref('assignments')
const search = ref('')

// Lade die Felder beim Mounten
onMounted(async () => {
  await fieldsStore.fetchFields()
})

const headers = [
  { title: 'Feldname', key: 'name' },
  { title: 'Landwirt', key: 'farmerId' },
  { title: 'Zugewiesenes Team', key: 'assignedTo' },
  { title: 'Abgeflogen am', key: 'checkedAt' },
  { title: 'Abgeflogen von', key: 'checkedBy' }
]

const rescueTeams = computed(() => {
  const { data } = useFetch('/api/teams')
  return data.value || []
})

const getTeamName = (teamId: number) => {
  const team = rescueTeams.value.find(t => t.id === teamId)
  return team ? team.name : '-'
}

const getTeamFieldCount = (teamId: number) => 
  fieldsStore.allFields.filter(f => f.assignedTo === teamId).length

const isTeamFullyLoaded = (teamId: number, currentFieldId: string) => {
  if (!teamId) return false
  const count = fieldsStore.allFields.filter(f => 
    f.assignedTo === teamId && f.id !== currentFieldId
  ).length
  return count >= MAX_FIELDS_PER_TEAM
}

const assignField = async (fieldId: string, rescuerId: number | null) => {
  if (rescuerId && isTeamFullyLoaded(rescuerId, fieldId)) {
    alert(`Team hat bereits die maximale Anzahl von ${MAX_FIELDS_PER_TEAM} Feldern zugewiesen`)
    return
  }
  await fieldsStore.assignField(fieldId, rescuerId)
}

const unassignField = async (fieldId: string) => {
  if (confirm('Möchten Sie die Zuweisung wirklich aufheben?')) {
    await fieldsStore.assignField(fieldId, null)
  }
}

const groupedFields = computed(() => {
  return fieldsStore.allFields.map(field => ({
    ...field,
    assignedTo: getTeamName(field.assignedTo as number)
  }))
})
</script>