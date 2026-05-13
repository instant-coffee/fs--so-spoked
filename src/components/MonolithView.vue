<template>
  <div
    :style="{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      fontFamily: 'Space Grotesk',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- Top bar -->
    <div
      :style="{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `4px solid ${theme.accent}`,
      }"
    >
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: theme.accent,
        }"
      >
        MONOLITH MODE
      </span>
      <button @click="$emit('exit')" :style="exitBtnStyle">EXIT ×</button>
    </div>

    <!-- Giant numbers -->
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 20px',
      }"
    >
      <div :style="{ marginBottom: '40px' }">
        <div :style="sideLabelStyle">{{ labelLeft }}</div>
        <div :style="{ ...bigNumStyle, color: theme.accent }">
          {{ roundSpoke(result.left) }}
        </div>
        <div :style="rawStyle">RAW {{ result.left.toFixed(2) }}MM</div>
      </div>
      <div>
        <div :style="sideLabelStyle">{{ labelRight }}</div>
        <div :style="{ ...bigNumStyle, color: '#FFFFFF' }">
          {{ roundSpoke(result.right) }}
        </div>
        <div :style="rawStyle">RAW {{ result.right.toFixed(2) }}MM</div>
      </div>
    </div>

    <!-- Footer -->
    <div
      :style="{
        padding: '20px',
        borderTop: '1px solid #2A2A28',
        fontFamily: 'Space Mono',
        fontSize: '10px',
        color: '#888880',
        letterSpacing: '0.08em',
      }"
    >
      {{ rimLabel }} · {{ hubLabel }} · {{ build.holes }}H
      {{ build.crossings }}X
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { roundSpoke } from "../utils/calc.js";

  const props = defineProps({
    theme: Object,
    result: Object,
    rim: Object,
    hub: Object,
    build: Object,
  });

  defineEmits(["exit"]);

  const labelLeft = computed(() =>
    props.build.wheelSide === "front" ? "DISC" : "NON-DRIVE"
  );
  const labelRight = computed(() =>
    props.build.wheelSide === "front" ? "NON-DISC" : "DRIVE"
  );
  const rimLabel = computed(() =>
    props.rim?._custom
      ? "CUSTOM RIM"
      : `${props.rim?.brand} ${props.rim?.model}`
  );
  const hubLabel = computed(() =>
    props.hub?._custom
      ? "CUSTOM HUB"
      : `${props.hub?.brand} ${props.hub?.model}`
  );

  const exitBtnStyle = {
    background: "transparent",
    border: "1px solid #2A2A28",
    color: "#FFF",
    padding: "8px 14px",
    cursor: "pointer",
    fontFamily: "Space Mono",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.16em",
  };

  const sideLabelStyle = {
    fontFamily: "Space Mono",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "#888880",
    marginBottom: "8px",
  };

  const bigNumStyle = {
    fontFamily: "Playfair Display",
    fontWeight: 700,
    fontSize: "min(28vw, 180px)",
    lineHeight: 0.85,
    letterSpacing: "-0.04em",
  };

  const rawStyle = {
    fontFamily: "Space Mono",
    fontSize: "12px",
    color: "#888880",
    marginTop: "8px",
    letterSpacing: "0.08em",
  };
</script>
