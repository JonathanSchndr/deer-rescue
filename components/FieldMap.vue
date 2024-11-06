<template>
  <div>
    <div class="field-map" ref="mapRef"></div>
    <div v-if="editable" class="drawing-controls mt-4">
      <v-btn-group>
        <v-btn
          color="primary"
          :disabled="isDrawing"
          @click="startDrawing"
        >
          <v-icon>mdi-pencil</v-icon>
          Feld einzeichnen
        </v-btn>
        <v-btn
          color="error"
          @click="clearDrawing"
        >
          <v-icon>mdi-delete</v-icon>
          Zurücksetzen
        </v-btn>
      </v-btn-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

const props = defineProps<{
  editable?: boolean
  initialPolygon?: number[][]
}>()

const emit = defineEmits(['update:coordinates'])

const mapRef = ref<HTMLElement>()
const map = ref<L.Map>()
const drawingLayer = ref<L.FeatureGroup>()
const isDrawing = ref(false)

onMounted(() => {
  if (!mapRef.value) return

  // Initialize map
  map.value = L.map(mapRef.value).setView([51.1657, 10.4515], 6)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)

  // Initialize drawing layer
  drawingLayer.value = new L.FeatureGroup()
  map.value.addLayer(drawingLayer.value)

  if (props.editable) {
    // Initialize Geoman controls
    map.value.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolyline: false,
      drawMarker: false,
      cutPolygon: false,
      rotateMode: false,
      editMode: false,
      dragMode: false,
    })

    // Handle drawing events
    map.value.on('pm:create', (e) => {
      const layer = e.layer
      drawingLayer.value?.clearLayers()
      drawingLayer.value?.addLayer(layer)
      emitCoordinates(layer)
      isDrawing.value = false
      map.value?.pm.disableDraw()
    })
  }

  if (props.initialPolygon) {
    const polygon = L.polygon(props.initialPolygon as L.LatLngExpression[])
    drawingLayer.value.addLayer(polygon)
    map.value.fitBounds(polygon.getBounds())
  }
})

const startDrawing = () => {
  if (!map.value) return
  isDrawing.value = true
  map.value.pm.enableDraw('Polygon')
}

const clearDrawing = () => {
  if (!map.value) return
  drawingLayer.value?.clearLayers()
  emit('update:coordinates', [])
  isDrawing.value = false
  map.value.pm.disableDraw()
}

const emitCoordinates = (layer: L.Layer) => {
  if (layer instanceof L.Polygon) {
    const coords = layer.getLatLngs()[0]
    emit('update:coordinates', coords.map((c: any) => [c.lat, c.lng]))
  }
}
</script>