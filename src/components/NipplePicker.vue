<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '6px',
    }"
  >
    <button
      v-for="opt in NIPPLES"
      :key="opt.key"
      @click="select(opt.key)"
      :style="btnStyle(opt.key)"
    >
      {{ opt.short }}
      <span
        :style="{
          display: 'block',
          fontSize: '8px',
          fontWeight: 400,
          letterSpacing: '0.1em',
          marginTop: '4px',
          opacity: 0.7,
        }"
      >
        {{ opt.label.split("-")[0].toUpperCase() }}
      </span>
    </button>
  </div>
</template>

<script setup>
  import { NIPPLES } from "../data/nipples.js";

  const props = defineProps({
    value: String,
    theme: Object,
  });

  const emit = defineEmits(["change", "done"]);

  function select(key) {
    emit("change", key);
    emit("done");
  }

  function btnStyle(key) {
    const active = props.value === key;
    return {
      padding: "20px 0",
      cursor: "pointer",
      border: `1px solid ${active ? props.theme.text : props.theme.border}`,
      backgroundColor: active ? props.theme.text : props.theme.surface,
      color: active ? props.theme.surface : props.theme.text,
      fontFamily: "Space Mono",
      fontWeight: 700,
      fontSize: "12px",
      letterSpacing: "0.08em",
      transition: "all 140ms ease",
    };
  }
</script>
