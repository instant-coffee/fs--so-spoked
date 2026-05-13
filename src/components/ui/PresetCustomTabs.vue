<template>
  <div :style="{ display: 'flex', marginBottom: '14px' }">
    <button @click="$emit('change', 'preset')" :style="tabStyle(value === 'preset', false)">
      {{ presetLabel }}
    </button>
    <button @click="$emit('change', 'custom')" :style="tabStyle(value === 'custom', true)">
      {{ customLabel }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  value: String,
  theme: Object,
  presetLabel: { type: String, default: 'Presets' },
  customLabel:  { type: String, default: 'Custom' },
})

defineEmits(['change'])

function tabStyle(active, noLeft) {
  return {
    flex: 1,
    padding: '10px 0',
    cursor: 'pointer',
    backgroundColor: active ? props.theme.text : 'transparent',
    color: active ? props.theme.surface : props.theme.text,
    border: `1px solid ${props.theme.text}`,
    ...(noLeft ? { borderLeft: 'none' } : {}),
    fontFamily: 'Space Mono',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    transition: 'all 140ms ease',
  }
}
</script>