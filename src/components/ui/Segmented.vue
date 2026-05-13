<template>
  <div :style="containerStyle">
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      @click="$emit('change', opt.value)"
      :style="btnStyle(opt.value, i)"
    >{{ opt.label }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: Array,
  value: [String, Number],
  theme: Object,
  size: { type: String, default: 'md' },
})

defineEmits(['change'])

const pad = computed(() => props.size === 'sm' ? '8px 10px' : '12px 14px')
const fs  = computed(() => props.size === 'sm' ? 11 : 12)

const containerStyle = computed(() => ({
  display: 'inline-flex',
  border: `1px solid ${props.theme.border}`,
  backgroundColor: props.theme.surface,
}))

function btnStyle(val, i) {
  const active = props.value === val
  return {
    padding: pad.value,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? props.theme.text : 'transparent',
    color: active ? props.theme.surface : props.theme.text,
    fontFamily: 'Space Mono',
    fontSize: `${fs.value}px`,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    borderLeft: i === 0 ? 'none' : `1px solid ${props.theme.border}`,
    transition: 'all 160ms ease',
  }
}
</script>