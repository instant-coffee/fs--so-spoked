<template>
  <div :style="wrapStyle">
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '12px',
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
        LACING DIAGRAM
      </span>
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '9px',
          color: theme.muted,
          letterSpacing: '0.1em',
        }"
      >
        {{ holes }}H · {{ crossings }}X
      </span>
    </div>
    <div :style="diagramBoxStyle">
      <LacingDiagram
        :holes="holes"
        :crossings="crossings"
        :accent="theme.accent"
        :text-color="theme.text"
        :muted-color="theme.muted"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import LacingDiagram from "./LacingDiagram.vue";

  const props = defineProps({
    theme: Object,
    holes: Number,
    crossings: Number,
  });

  const wrapStyle = computed(() => ({
    padding: "32px 20px",
    borderTop: `1px solid ${props.theme.border}`,
    backgroundColor: props.theme.bg,
  }));

  const diagramBoxStyle = computed(() => ({
    backgroundColor: props.theme.surface,
    border: `1px solid ${props.theme.border}`,
    padding: "20px",
    aspectRatio: "1 / 1",
    maxWidth: "320px",
    margin: "0 auto",
  }));
</script>
