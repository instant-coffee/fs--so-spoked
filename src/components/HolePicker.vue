<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
    }"
  >
    <button
      v-for="h in HOLE_OPTIONS"
      :key="h"
      @click="select(h)"
      :style="btnStyle(h)"
    >
      {{ h }}
      <span
        :style="{
          display: 'block',
          fontFamily: 'Space Mono',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          marginTop: '4px',
          opacity: 0.7,
        }"
      >
        HOLES
      </span>
    </button>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { HOLE_OPTIONS } from "../data/options.js";

  const props = defineProps({
    value: Number,
    theme: Object,
  });

  const emit = defineEmits(["change", "done"]);

  function select(h) {
    emit("change", h);
    emit("done");
  }

  function btnStyle(h) {
    const active = props.value === h;
    return {
      padding: "24px 0",
      cursor: "pointer",
      border: `1px solid ${active ? props.theme.text : props.theme.border}`,
      backgroundColor: active ? props.theme.text : props.theme.surface,
      color: active ? props.theme.surface : props.theme.text,
      fontFamily: props.theme.displayFont,
      fontSize: "28px",
      fontWeight: 700,
      transition: "all 140ms ease",
    };
  }
</script>
