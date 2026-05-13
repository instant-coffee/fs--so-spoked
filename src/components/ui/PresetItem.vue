<template>
  <button @click="$emit('select')" :style="btnStyle">
    <span :style="{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }">
      <span :style="primaryStyle">{{ primary }}</span>
      <span :style="secondaryStyle">{{ secondary }}</span>
    </span>
    <span v-if="badge" :style="badgeStyle">{{ badge }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: Boolean,
  theme: Object,
  primary: String,
  secondary: String,
  badge: String,
})

defineEmits(['select'])

const btnStyle = computed(() => ({
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  backgroundColor: props.active ? props.theme.text : props.theme.surface,
  color: props.active ? props.theme.surface : props.theme.text,
  border: `1px solid ${props.active ? props.theme.text : props.theme.border}`,
  padding: '14px 14px',
  marginBottom: '6px',
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: '12px',
  fontFamily: props.theme.bodyFont,
  transition: 'all 140ms ease',
}))

const primaryStyle = computed(() => ({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

const secondaryStyle = computed(() => ({
  fontFamily: 'Space Mono',
  fontSize: '10px',
  opacity: props.active ? 0.7 : 0.6,
  letterSpacing: '0.05em',
}))

const badgeStyle = computed(() => ({
  fontFamily: 'Space Mono',
  fontSize: '10px',
  fontWeight: 700,
  padding: '3px 6px',
  letterSpacing: '0.08em',
  color: props.active ? props.theme.text : props.theme.accent,
  backgroundColor: props.active ? props.theme.surface : 'transparent',
  border: `1px solid ${props.active ? props.theme.surface : props.theme.accent}`,
  flexShrink: 0,
}))
</script>