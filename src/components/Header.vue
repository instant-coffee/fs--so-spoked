<template>
  <header :style="headerStyle">
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }"
    >
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.16em',
          color: theme.accentLine,
        }"
      >
        SPOKE CALC
      </span>
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#888880',
        }"
      >
        FULLSEND · V1.0
      </span>
    </div>

    <h1 :style="h1Style">Spoke<br />length.</h1>

    <p :style="subtitleStyle">
      Dial in your custom build. Pick a rim, hub and lacing pattern — we'll
      compute drive- and non-drive-side spoke length live.
    </p>

    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
      <span
        :style="{
          fontFamily: 'Space Mono',
          fontSize: '9px',
          letterSpacing: '0.18em',
          color: '#888880',
          fontWeight: 700,
        }"
      >
        WHEEL:
      </span>
      <div
        :style="{
          display: 'inline-flex',
          border: '1px solid #2A2A28',
          backgroundColor: '#000000',
        }"
      >
        <button
          v-for="(side, i) in ['front', 'rear']"
          :key="side"
          @click="$emit('set-wheel-side', side)"
          :style="wheelBtnStyle(side, i)"
        >
          {{ side }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    theme: Object,
    wheelSide: String,
  });

  defineEmits(["set-wheel-side"]);

  const headerStyle = computed(() => ({
    backgroundColor: props.theme.headerBg,
    color: "#FFFFFF",
    padding: "20px 20px 28px",
    position: "relative",
    borderBottom: `4px solid ${props.theme.accentLine}`,
  }));

  const h1Style = computed(() => ({
    fontFamily: props.theme.displayFont,
    fontWeight: 700,
    fontSize: "44px",
    lineHeight: 0.95,
    margin: 0,
    color: "#FFFFFF",
    letterSpacing: "-0.02em",
  }));

  const subtitleStyle = computed(() => ({
    fontFamily: props.theme.bodyFont,
    fontSize: "13px",
    color: "#A0A098",
    margin: "14px 0 22px 0",
    maxWidth: "320px",
    lineHeight: 1.45,
  }));

  function wheelBtnStyle(side, i) {
    const active = props.wheelSide === side;
    return {
      padding: "8px 14px",
      border: "none",
      cursor: "pointer",
      backgroundColor: active ? props.theme.accentLine : "transparent",
      color: active ? "#000000" : "#FFFFFF",
      fontFamily: "Space Mono",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      borderLeft: i === 0 ? "none" : "1px solid #2A2A28",
      transition: "all 140ms ease",
    };
  }
</script>
