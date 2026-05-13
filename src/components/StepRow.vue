<template>
  <div :style="wrapStyle">
    <button @click="$emit('toggle')" :style="btnStyle">
      <span :style="numStyle">{{ num }}</span>

      <span
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }"
      >
        <span :style="labelStyle">{{ label }}</span>
        <span :style="valueStyle">
          <template v-if="value">{{ value }}</template>
          <span v-else :style="{ color: theme.muted }">—</span>
        </span>
        <span v-if="sub" :style="subStyle">{{ sub }}</span>
      </span>

      <!-- Chevron -->
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        :style="{
          transition: 'transform 240ms cubic-bezier(.4,0,.2,1)',
          transform: `rotate(${open ? 90 : 0}deg)`,
          flexShrink: 0,
        }"
      >
        <path
          d="M5 3 L9 7 L5 11"
          fill="none"
          :stroke="theme.text"
          stroke-width="1.5"
          stroke-linecap="square"
        />
      </svg>
    </button>

    <div :style="expandStyle">
      <div :style="{ padding: '4px 20px 24px' }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    num: String,
    label: String,
    value: String,
    sub: String,
    open: Boolean,
    theme: Object,
  });

  defineEmits(["toggle"]);

  const wrapStyle = computed(() => ({
    borderTop: `1px solid ${props.theme.border}`,
    backgroundColor: props.open ? props.theme.surfaceActive : "transparent",
    transition: "background-color 200ms ease",
  }));

  const btnStyle = computed(() => ({
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "20px 20px",
    textAlign: "left",
    cursor: "pointer",
    display: "grid",
    gridTemplateColumns: "32px 1fr auto",
    gap: "14px",
    alignItems: "center",
    color: props.theme.text,
    fontFamily: props.theme.bodyFont,
  }));

  const numStyle = computed(() => ({
    fontFamily: "Space Mono",
    fontSize: "11px",
    color: props.theme.accent,
    letterSpacing: "0.1em",
    fontWeight: 700,
  }));

  const labelStyle = computed(() => ({
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: props.theme.muted,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  }));

  const valueStyle = computed(() => ({
    fontFamily: props.theme.bodyFont,
    fontWeight: 500,
    fontSize: "18px",
    color: props.theme.text,
    lineHeight: 1.15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }));

  const subStyle = computed(() => ({
    fontFamily: "Space Mono",
    fontSize: "10px",
    color: props.theme.muted,
    letterSpacing: "0.05em",
  }));

  const expandStyle = computed(() => ({
    maxHeight: props.open ? "2000px" : "0",
    overflow: "hidden",
    transition: props.open
      ? "max-height 500ms ease-in-out"
      : "max-height 320ms ease-in-out",
  }));
</script>
