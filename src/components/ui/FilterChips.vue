<template>
  <div :style="outerStyle">
    <div v-for="group in groups" :key="group.key" :style="rowStyle">
      <span :style="labelStyle">{{ group.label }}</span>
      <div :style="chipsStyle">
        <button
          @click="$emit('change', { key: group.key, value: null })"
          :style="chipStyle(values[group.key] === null)"
        >All</button>
        <button
          v-for="opt in group.options"
          :key="opt"
          @click="$emit('change', { key: group.key, value: opt })"
          :style="chipStyle(values[group.key] === opt)"
        >{{ opt }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  groups: Array,
  values: Object,
  theme: Object,
});

defineEmits(["change"]);

const outerStyle = computed(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  paddingBottom: "10px",
  borderBottom: `1px solid ${props.theme.border}`,
  marginBottom: "10px",
}));

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
};

const labelStyle = computed(() => ({
  fontFamily: "Space Mono",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: props.theme.muted,
  minWidth: "60px",
  flexShrink: 0,
}));

const chipsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
};

function chipStyle(active) {
  return {
    padding: "3px 8px",
    border: `1px solid ${active ? props.theme.text : props.theme.border}`,
    backgroundColor: active ? props.theme.text : "transparent",
    color: active ? props.theme.surface : props.theme.muted,
    fontFamily: "Space Mono",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 120ms ease",
  };
}
</script>
