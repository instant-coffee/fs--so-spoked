<template>
  <div
    :style="{
      padding: '24px 20px 8px',
      borderTop: `1px solid ${theme.border}`,
    }"
  >
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '14px',
      }"
    >
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: theme.accent,
        }"
      >
        SAVED BUILDS
      </span>
      <button @click="$emit('clear')" :style="clearBtnStyle">CLEAR</button>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
      <button
        v-for="r in recents"
        :key="r.id"
        @click="$emit('load', r)"
        :style="rowStyle"
      >
        <span
          :style="{
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }"
        >
          {{ r.label }}
          <span
            :style="{
              display: 'block',
              fontFamily: 'Space Mono',
              fontSize: '10px',
              color: theme.muted,
              letterSpacing: '0.06em',
              marginTop: '2px',
            }"
          >
            {{ r.sub }}
          </span>
        </span>
        <span
          :style="{
            fontFamily: 'Space Mono',
            fontSize: '11px',
            fontWeight: 700,
            color: theme.accent,
          }"
        >
          {{ roundSpoke(r.left) }}/{{ roundSpoke(r.right) }}
        </span>
        <!-- Chevron -->
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M5 3 L9 7 L5 11"
            fill="none"
            :stroke="theme.muted"
            stroke-width="1.5"
            stroke-linecap="square"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { roundSpoke } from "../utils/calc.js";

  const props = defineProps({
    theme: Object,
    recents: Array,
  });

  defineEmits(["load", "clear"]);

  const clearBtnStyle = computed(() => ({
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "Space Mono",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    color: props.theme.muted,
    padding: 0,
  }));

  const rowStyle = computed(() => ({
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    border: `1px solid ${props.theme.border}`,
    backgroundColor: props.theme.surface,
    padding: "12px 14px",
    color: props.theme.text,
    fontFamily: props.theme.bodyFont,
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "14px",
    alignItems: "center",
  }));
</script>
