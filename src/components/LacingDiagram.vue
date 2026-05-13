<template>
  <svg :viewBox="`0 0 ${size} ${size}`" width="100%" height="100%" style="display: block">
    <!-- Dashed outer ring -->
    <circle :cx="cx" :cy="cy" :r="rimR + 6"
      fill="none" :stroke="mutedColor" stroke-width="1"
      stroke-dasharray="2 3" opacity="0.5" />
    <!-- Rim -->
    <circle :cx="cx" :cy="cy" :r="rimR"
      fill="none" :stroke="textColor" stroke-width="1.2" />

    <!-- Spokes -->
    <line
      v-for="l in lines" :key="l.i"
      :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2"
      :stroke="l.dir > 0 ? textColor : accent"
      stroke-width="0.7"
      stroke-linecap="round"
      style="transition: all 380ms cubic-bezier(.4,.0,.2,1)"
    />

    <!-- Hub flange -->
    <circle :cx="cx" :cy="cy" :r="hubR"
      fill="none" :stroke="textColor" stroke-width="1.2" />
    <circle :cx="cx" :cy="cy" r="4" :fill="textColor" />

    <!-- Rim hole markers -->
    <circle
      v-for="h in rimHoles" :key="`rh-${h.i}`"
      :cx="h.x" :cy="h.y" r="1.4" :fill="textColor"
      style="transition: all 380ms ease"
    />

    <!-- Hub hole markers -->
    <circle
      v-for="h in hubHoles" :key="`hh-${h.i}`"
      :cx="h.x" :cy="h.y" r="1" :fill="textColor"
      style="transition: all 380ms ease"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  holes:     { type: Number, default: 32 },
  crossings: { type: Number, default: 3 },
  accent:    { type: String, default: '#FF5C00' },
  textColor: { type: String, default: '#101010' },
  mutedColor:{ type: String, default: '#A0A098' },
})

const size = 220
const cx   = size / 2
const cy   = size / 2
const rimR = 96
const hubR = 26

const lines = computed(() => {
  const result = []
  for (let i = 0; i < props.holes; i++) {
    const dir      = i % 2 === 0 ? 1 : -1
    const rimAngle = (2 * Math.PI * i) / props.holes - Math.PI / 2
    const hubIdx   = i + 2 * props.crossings * dir
    const hubAngle = (2 * Math.PI * hubIdx) / props.holes - Math.PI / 2
    result.push({
      i,
      dir,
      x1: cx + hubR * Math.cos(hubAngle),
      y1: cy + hubR * Math.sin(hubAngle),
      x2: cx + rimR * Math.cos(rimAngle),
      y2: cy + rimR * Math.sin(rimAngle),
    })
  }
  return result
})

const rimHoles = computed(() =>
  Array.from({ length: props.holes }, (_, i) => {
    const a = (2 * Math.PI * i) / props.holes - Math.PI / 2
    return { i, x: cx + rimR * Math.cos(a), y: cy + rimR * Math.sin(a) }
  })
)

const hubHoles = computed(() =>
  Array.from({ length: props.holes }, (_, i) => {
    const a = (2 * Math.PI * i) / props.holes - Math.PI / 2
    return { i, x: cx + hubR * Math.cos(a), y: cy + hubR * Math.sin(a) }
  })
)
</script>